/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import resultCodes from 'chronobank-smart-contracts/common/errors'
import EventEmitter from 'events'
import OwnerModel from '../models/wallet/OwnerModel'
import MultisigWalletDAO from '../dao/MultisigWalletDAO'
import type MultisigTransactionModel from '../models/wallet/MultisigTransactionModel'
import type MultisigWalletModel from '../models/wallet/MultisigWalletModel'
import MultisigWalletPendingTxModel from '../models/wallet/MultisigWalletPendingTxModel'
import {
  EE_CONFIRMATION,
  EE_CONFIRMATION_NEEDED,
  EE_DEPOSIT,
  EE_MULTI_TRANSACTION,
  EE_OWNER_ADDED,
  EE_OWNER_REMOVED,
  EE_REQUIREMENT_CHANGED,
  EE_REVOKE,
  EE_SINGLE_TRANSACTION,
} from './constants'

class MultisigWalletService extends EventEmitter {

  constructor () {
    super(...arguments)
    this._cache = {}
  }

  getWalletDAO (address) {
    return this._cache[address]
  }

  async createWalletDAO (address, web3, history) {
    const oldDAO = this._cache[address]
    if (oldDAO) {
      return this._cache[address]
    }
    const newDAO = new MultisigWalletDAO(address, history)
    newDAO.connect(web3)
    this._cache[address] = newDAO
    return newDAO
  }

  subscribeToWalletDAO (wallet: MultisigWalletModel): Promise {
    const address = wallet.address
    const dao = this.getWalletDAO(address)

    // TODO @abdulov remove console.log
    console.log('%c subscribeToWalletDAO', 'background: #222; color: #fff', address, dao)

    if (!dao) {
      // eslint-disable-next-line
      throw new Error('wallet not found with address:', address)
    }

    return Promise.all([
      dao.watchOwnerAdded((owner: OwnerModel) => {
        // TODO @abdulov remove console.log
        console.log('%c watchOwnerAdded', 'background: #222; color: #fff')
        this.emit(EE_OWNER_ADDED, wallet.id, owner)
      }),
      dao.watchOwnerRemoved((owner: OwnerModel) => {
        // TODO @abdulov remove console.log
        console.log('%c watchOwnerRemoved', 'background: #222; color: #fff')
        this.emit(EE_OWNER_REMOVED, wallet.id, owner)
      }),
      dao.watchMultiTransact((multisigTransactionModel: MultisigTransactionModel) => {
        // TODO @abdulov remove console.log
        console.log('%c watchMultiTransact', 'background: #222; color: #fff')
        this.emit(EE_MULTI_TRANSACTION, wallet.id, multisigTransactionModel)
      }),
      dao.watchSingleTransact((result) => {
        // TODO @abdulov remove console.log
        console.log('%c watchSingleTransact', 'background: #222; color: #fff')
        this.emit(EE_SINGLE_TRANSACTION, result)
      }),
      dao.watchConfirmationNeeded((pendingTxModel) => {
        // TODO @abdulov remove console.log
        console.log('%c watchConfirmationNeeded', 'background: #222; color: #fff')
        this.emit(EE_CONFIRMATION_NEEDED, wallet.id, pendingTxModel)
      }),
      dao.watchDeposit(() => {
        // TODO @abdulov remove console.log
        console.log('%c watchDeposit', 'background: #222; color: #fff')
        this.emit(EE_DEPOSIT, wallet.id, 'ETH')
      }),
      dao.watchRevoke((id) => {
        // TODO @abdulov remove console.log
        console.log('%c watchRevoke', 'background: #222; color: #fff')
        this.emit(EE_REVOKE, wallet.id, id)
      }),
      dao.watchConfirmation((id, owner) => {
        // TODO @abdulov remove console.log
        console.log('%c watchConfirmation', 'background: #222; color: #fff')
        this.emit(EE_CONFIRMATION, wallet.id, id, owner)
      }),
      dao.watchError((errorCode) => {
        if (errorCode === resultCodes.WALLET_CONFIRMATION_NEEDED) {
          this.emit(EE_CONFIRMATION_NEEDED, wallet.id, new MultisigWalletPendingTxModel({
            // TODO @dkchv: no id (operation here) :(
          }))
        }
      }),
      dao.watchRequirementChanged((required) => {
        this.emit(EE_REQUIREMENT_CHANGED, wallet.id, required)
      }),
    ])
  }

  async unsubscribe (address) {
    const dao = this.getWalletDAO(address)
    if (!dao) {
      return
    }
    await dao.stopWatching()
  }

  async unsubscribeAll () {
    const promises = []
    for (let walletDAO in this._cache) {
      promises.push(walletDAO.stopWatching())
    }
    await Promise.all(promises)
    this._cache = {}
  }
}

export default new MultisigWalletService()
