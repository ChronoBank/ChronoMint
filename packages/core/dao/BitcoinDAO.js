/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  bccProvider,
  btcProvider,
  btgProvider,
  dashProvider,
  ltcProvider
} from '@chronobank/login/network/BitcoinProvider'
import EventEmitter from 'events'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import { bitcoinAddress } from '../models/validator'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_DASHCOIN,
  BLOCKCHAIN_LITECOIN,
  EVENT_NEW_TRANSFER,
  EVENT_UPDATE_BALANCE,
  EVENT_UPDATE_LAST_BLOCK,
  EVENT_UPDATE_TRANSACTION,
} from './constants'

const EVENT_TX = 'tx'
const EVENT_TRANSACTION_MAINED = 'transaction'
const EVENT_BALANCE = 'balance'
const EVENT_LAST_BLOCK = 'lastBlock'

export default class BitcoinDAO extends EventEmitter {
  constructor (name, symbol, bitcoinProvider) {
    super()
    this._name = name
    this._symbol = symbol
    this._bitcoinProvider = bitcoinProvider
    this._decimals = 8
  }

  getBlockchain () {
    return this._name
  }

  getAddressValidator () {
    return bitcoinAddress(this._bitcoinProvider.isAddressValid.bind(this._bitcoinProvider), this._name)
  }

  getAccount () {
    return this._bitcoinProvider.getAddress()
  }

  getInitAddress () {
    // BitcoinDAO is not a cntract DAO, bitcoin have no initial address, but it have a token name.
    return `Bitcoin/${this._symbol}`
  }

  getCurrentBlockHeight () {
    return this._bitcoinProvider.getCurrentBlockHeight()
  }

  isInitialized () {
    return this._bitcoinProvider.isInitialized()
  }

  hasBalancesStream () {
    // Balance should not be fetched after transfer notification,
    // it will be updated from the balances event stream
    return true
  }

  async getFeeRate () {
    return this._bitcoinProvider.getFeeRate()
  }

  getAccountBalances (address) {
    return this._bitcoinProvider.getAccountBalances(address)
  }

  getAccountBalance (address) {
    return this.getAccountBalances(address)
  }

  transfer (from: string, to: string, amount: BigNumber) {
    return {
      from,
      to,
      value: new BigNumber(amount),
    }
  }

  async getTransfer (id, account, skip, offset): Array<TxModel> {
    const txs = []
    try {
      const txsResult = await this._bitcoinProvider.getTransactionsList(account, skip, offset)
      for (const tx of txsResult) {
        txs.push(new TxModel({
          txHash: tx.txHash,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          confirmations: tx.confirmations,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          symbol: this._symbol,
          value: new Amount(tx.value, this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          blockchain: this._name,
        }))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('BitcoinDAO getTransfer', e)
    }

    return txs
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
      this.watchTransaction(),
    ])
  }

  async watchTransaction () {
    this._bitcoinProvider.addListener(EVENT_TRANSACTION_MAINED, async ({ tx, address, bitcoin, symbol }) => {
      this.emit(
        EVENT_UPDATE_TRANSACTION,
        {
          tx,
          address,
          bitcoin,
          symbol,
        },
      )
    })
  }

  async watchTransfer () {
    this._bitcoinProvider.addListener(EVENT_TX, async ({ tx }) => {
      this.emit(
        EVENT_NEW_TRANSFER,
        new TxModel({
          txHash: tx.txHash,
          // blockHash: tx.blockhash,
          // blockNumber: tx.blockheight,
          blockNumber: null,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          symbol: this._symbol,
          value: new Amount(tx.value, this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          blockchain: this._name,
        }),
      )
    })
  }

  async watchBalance () {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, { account, time, balance: balance.balance0 })
    })
  }

  async watchLastBlock () {
    this._bitcoinProvider.addListener(EVENT_LAST_BLOCK, async ({ block }) => {
      this.emit(EVENT_UPDATE_LAST_BLOCK, {
        blockchain: this._name,
        block: { blockNumber: block },
      })
    })
  }

  async stopWatching () {
    // Ignore
  }

  resetFilterCache () {
    // do nothing
  }

  async fetchToken () {
    if (!this.isInitialized()) {
      const message = `${this._symbol} support is not available`
      // eslint-disable-next-line
      console.warn(message)
      throw new Error(message)
    }
    // const feeRate = await this.getFeeRate()

    return new TokenModel({
      name: this._name,
      decimals: this._decimals,
      symbol: this._symbol,
      isFetched: true,
      blockchain: this._name,
      feeRate: 200,
    })
  }

  subscribeNewWallet (address) {
    this._bitcoinProvider.subscribeNewWallet(address)
  }
}

export const btcDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN, 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_CASH, 'BCC', bccProvider)
export const btgDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_GOLD, 'BTG', btgProvider)
export const dashDAO = new BitcoinDAO(BLOCKCHAIN_DASHCOIN, 'DASH', dashProvider)
export const ltcDAO = new BitcoinDAO(BLOCKCHAIN_LITECOIN, 'LTC', ltcProvider)
