import BigNumber from 'bignumber.js'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import type MultisigWalletDAO from 'dao/MultisigWalletDAO'
import Immutable from 'immutable'
import WalletNoticeModel, { statuses } from 'models/notices/WalletNoticeModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import multisigWalletService from 'services/MultisigWalletService'
import { MultiEventsHistoryABI, WalletsManagerABI } from './abi'

const functions = {
  GET_WALLETS: 'getWallets',
  CREATE_WALLET: 'createWallet',
}

const events = {
  ERROR: 'Error',
  WALLET_ADDED: 'WalletAdded',
  WALLET_CREATED: 'WalletCreated',
}

export const EVENT_NEW_MS_WALLET = 'newMSWallet'
export const EVENT_MS_WALLETS_COUNT = 'msWalletCount'

export default class WalletsManagerDAO extends AbstractContractDAO {

  constructor (at) {
    super(WalletsManagerABI, at, MultiEventsHistoryABI)
  }

  // ---------- watchers ---------

  watchWalletCreate (callback) {
    return this._watch(events.WALLET_CREATED, async (result) => {
      const wallet = await this._createWalletModel(result.args.wallet, false, result.transactionHash)
      callback(wallet, new WalletNoticeModel({
        address: wallet.address(),
        action: statuses.CREATED,
      }))
    }, { by: this.getAccount() })
  }

  // --------- actions ----------

  async fetchWallets () {
    const [addresses, is2FA] = await this._call(functions.GET_WALLETS)
    this.emit(EVENT_MS_WALLETS_COUNT, addresses.length)

    addresses.forEach((address, i) => {
      this._createWalletModel(address, is2FA[i])
    })
  }

  async _createWalletModel (address, is2FA, transactionHash) {
    const walletDAO: MultisigWalletDAO = await multisigWalletService.createWalletDAO(address)
    const [owners, requiredSignatures, tokens] = await Promise.all([
      walletDAO.getOwners(),
      walletDAO.getRequired(),
      walletDAO.getTokens(),
    ])

    const pendingTxList = await walletDAO.getPendings(tokens)

    const multisigWalletModel =  new MultisigWalletModel({
      owners: new Immutable.List(owners),
      address,
      transactionHash,
      requiredSignatures,
      tokens,
      is2FA,
      isFetched: true,
      pendingTxList,
    })
    this.emit(EVENT_NEW_MS_WALLET, multisigWalletModel)

    return multisigWalletModel
  }

  async createWallet (wallet: MultisigWalletModel) {
    const result = await this._tx(functions.CREATE_WALLET, [
      wallet.ownersArray(),
      wallet.requiredSignatures(),
      new BigNumber(0),
    ], wallet.toCreateWalletTx())
    return result.tx
  }

  async removeWallet (wallet) {
    const result = await this._tx('removeWallet', [], {
      address: wallet.address(),
    })
    return result.tx
  }
}
