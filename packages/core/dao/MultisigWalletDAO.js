/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import resultCodes from 'chronobank-smart-contracts/common/errors'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxExecModel from '../models/TxExecModel'
import MultisigTransactionModel from '../models/wallet/MultisigTransactionModel'
import MultisigWalletPendingTxCollection from '../models/wallet/MultisigWalletPendingTxCollection'
import MultisigWalletPendingTxModel from '../models/wallet/MultisigWalletPendingTxModel'
import OwnerModel from '../models/wallet/OwnerModel'
import { WalletABI } from './abi'
import MultisigEthWalletModel from '../models/wallet/MultisigEthWalletModel'

export default class MultisigWalletDAO extends AbstractMultisigContractDAO {

  constructor (address, history) {
    super({ address, history, abi: WalletABI })
    this._okCodes.push(resultCodes.WALLET_CONFIRMATION_NEEDED)
  }

  // watchers
  _transactCallback = (callback) => async (result) => {
    const { owner, operation, value, to, data } = result.args

    callback(new MultisigTransactionModel({
      id: operation,
      owner,
      wallet: this.address,
      value,
      to,
      data: await this.decodeData(data),
    }))
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleAllEventsData)

  }

  handleAllEventsData = (data) => {
    this.emit(data.event, data)
  }

  watchMultiTransact (callback) {
    return this.on('MultisigWalletMultiTransact', this._transactCallback(callback))
  }

  watchSingleTransact (callback) {
    return this.on('MultisigWalletSingleTransact', this._transactCallback(callback))
  }

  watchDeposit (callback) {
    return this.on('MultisigWalletDeposit', (data) => callback(data.returnValues.value))
  }

  watchRevoke (callback) {
    return this.on('MultisigWalletRevoke', (data) => callback(data.returnValues.operation))
  }

  watchConfirmation (callback) {
    return this.on('MultisigWalletConfirmation', (data) => {
      // TODO @dkchv: something wrong with contract
      if (data.returnValues.owner === '0x') {
        return
      }
      callback(data.returnValues.operation, data.returnValues.owner)
    })
  }

  watchConfirmationNeeded (callback) {
    return this.on('MultisigWalletConfirmationNeeded', async (tx) => {
      const { operation, initiator, value, to } = tx.returnValues
      callback(new MultisigWalletPendingTxModel({
        id: operation,
        value,
        to,
        isConfirmed: initiator === AbstractContractDAO.getAccount(),
        decodedTx: await this.decodeData(tx.raw.data),
      }))
    })
  }

  watchOwnerAdded (callback) {
    return this.on('MultisigWalletOwnerAdded', async (data) => {
      callback(new OwnerModel({
        address: data.returnValues.newOwner,
      }))
    })
  }

  watchOwnerRemoved (callback) {
    return this.on('MultisigWalletOwnerRemoved', async (data) => {
      // TODO @dkchv: if its me - remove wallet!
      callback(new OwnerModel({
        address: data.returnValues.oldOwner,
      }))
    })
  }

  watchError (callback) {
    return this.on('Error', async (data) => {
      callback(this._c.hexToDecimal(data.returnValues.errorCode))
    })
  }

  watchRequirementChanged (callback) {
    return this.on('MultisigWalletRequirementChanged', async (data) => {
      callback(+data.returnValues.newRequirement)
    })
  }

  // getters
  async getPendings () {
    let pendingTxCollection = new MultisigWalletPendingTxCollection()
    const res = await this.contract.methods.getPendings().call()
    const [values, operations, isConfirmed] = Object.values(res)

    let verifiedOperationsPromises = []
    let pendingDataPromises = []
    operations.filter(this.isValidId).map((operation) => {
      verifiedOperationsPromises.push(ethereumProvider.checkConfirm2FAtx(operation))
      pendingDataPromises.push(this.getPendingData(operation))
    })
    const verifiedOperations = await Promise.all(verifiedOperationsPromises)
    const pendingData = await Promise.all(pendingDataPromises)

    operations.filter(this.isValidId).forEach((id, i) => {
      let pendingTxModel
      pendingTxModel = new MultisigWalletPendingTxModel({
        id,
        value: values [i],
        isConfirmed: isConfirmed[i],
        isPending: verifiedOperations[i] ? verifiedOperations[i].activated : false,
        decodedTx: pendingData[i] ? pendingData[i] : null,
      })
      pendingTxCollection = pendingTxCollection.add(pendingTxModel)
    })
    return pendingTxCollection
  }

  async getOwners () {
    const counter = await this.contract.methods.m_numOwners().call()
    let promises = []
    for (let i = 0; i < counter; i++) {
      promises.push(this.contract.methods.getOwner(i).call())
    }
    return Promise.all(promises)
  }

  getRequired () {
    return this.contract.methods.m_required().call()
  }

  async getPendingData (id: string): Promise<TxExecModel> {
    const data = await this.contract.methods.getData(id).call()
    return this.decodeData(data)
  }

  async getReleaseTime () {
    return this.contract.methods.releaseTime().call()
  }

  // actions
  async removeWallet (wallet, account: string) {
    await this._tx('kill', [
      account,
    ], {
      address: wallet.address(),
      account,
    })
  }

  async addOwner (wallet, ownerAddress) {
    await this._tx('addOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
    })
  }

  async removeOwner (wallet, ownerAddress) {
    await this._tx('removeOwner', [
      ownerAddress,
    ], {
      wallet: wallet.address(),
      ownerAddress,
    })
  }

  async transfer (wallet: MultisigEthWalletModel, token: TokenModel, amount, to, feeMultiplier: Number = 1, value) {
    await this._tx('transfer',
      [
        to,
        new BigNumber(amount),
        this.web3.utils.asciiToHex(token.symbol()),
      ],
      new BigNumber(0),
      new BigNumber(0),
      {},
      value)
  }

  async confirmPendingTx (tx) {
    await this._tx('confirm', [
      tx.id(),
    ])
  }

  async revokePendingTx (tx) {
    await this._tx('revoke', [
      tx.id(),
    ], tx.txRevokeSummary())
  }

  async changeRequirement (newRequired: Number) {
    await this._tx('changeRequirement', [
      newRequired,
    ], {
      signatureRequirements: newRequired,
    })
  }

  // helpers
  isValidId (id) {
    return id !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  }

  async _decodeArgs (func: string, args: Object) {
    switch (func) {
      case 'transfer':
        const symbol = this._c.bytesToString(args._symbol)
        return {
          symbol,
          value: new Amount(args._value, symbol),
          to: args._to,
        }
      case 'changeRequirement':
        return {
          requiredSignatures: args._newRequired.toNumber(),
        }
      case 'addOwner':
        return {
          owner: args._owner,
        }
      case 'removeOwner':
        return {
          owner: args._owner,
        }
      case 'kill':
        return {
          to: args._to,
        }
      default:
        console.warn('warn: decoder not implemented for function: ', func)
        return args
    }
  }

  use2FA () {
    return this.contract.methods.use2FA().call()
  }
}
