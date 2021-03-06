/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { btcProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { marketAddToken } from '@chronobank/market/redux/thunks'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  WALLET_HD_PATH,
} from '@chronobank/login/network/constants'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import WalletModel from '../../models/wallet/WalletModel'
import { getProviderByBlockchain, subscribeOnTokens } from '../tokens/utils'
import TokenModel from '../../models/tokens/TokenModel'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import tokenService from '../../services/TokenService'
import Amount from '../../models/Amount'
import { getMainAddresses, getMainEthWallet, getMainWalletForBlockchain, getWallet, getWallets } from './selectors/models'
import { notify, notifyError } from '../notifier/actions'
import { DUCK_SESSION } from '../session/constants'
import { AllowanceCollection } from '../../models'
import { executeDashTransaction } from '../dash/thunks'
import { executeTransaction } from '../ethereum/thunks'
import { executeLaborHourTransaction } from '../laborHour/thunks'
import { executeWavesTransaction } from '../waves/thunks'
import { executeBitcoinTransaction } from '../bitcoin/thunks'
import {
  WALLETS_LOGOUT,
  WALLETS_SET,
  WALLETS_SET_IS_TIME_REQUIRED,
  WALLETS_UNSET,
  WALLETS_SET_NAME,
  WALLETS_UPDATE_BALANCE,
  WALLETS_UPDATE_WALLET,
} from './constants'
import { executeNemTransaction } from '../nem/thunks'
import { getEthereumSigner } from '../ethereum/selectors'
import TxHistoryModel from '../../models/wallet/TxHistoryModel'
import { TXS_PER_PAGE } from '../../models/wallet/TransactionsCollection'
import {
  BCC,
  BTC,
  DASH,
  ETH,
  LHT,
  EVENT_NEW_TRANSFER,
  EVENT_UPDATE_BALANCE,
  EVENT_UPDATE_TRANSACTION,
  LTC,
  WAVES,
  XEM,
} from '../../dao/constants'

import TxDescModel from '../../models/TxDescModel'
import { getTokens } from '../tokens/selectors'
import { daoByType } from '../daos/selectors'
import TxModel from '../../models/TxModel'
import { getDeriveWalletsAddresses } from '../wallet/selectors'
import TransferNoticeModel from '../../models/notices/TransferNoticeModel'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import { DUCK_ETH_MULTISIG_WALLET, ETH_MULTISIG_BALANCE, ETH_MULTISIG_FETCHED } from '../multisigWallet/constants'
import BalanceModel from '../../models/tokens/BalanceModel'
import { getMultisigWallets } from '../wallet/selectors/models'
import { serializeToTxDescModel } from './utils'

const isOwner = (wallet, account) => {
  return wallet.owners.includes(account)
}

export const get2FAEncodedKey = (callback) => () => {
  return ethereumProvider.get2FAEncodedKey(callback)
}

export const setWalletName = (walletId, name) => (dispatch) => dispatch({ type: WALLETS_SET_NAME, walletId, name })

export const unsetWallet = (wallet) => (dispatch) => {
  const provider = getProviderByBlockchain(wallet.blockchain)
  provider.unsubscribe(wallet.address)

  dispatch({ type: WALLETS_UNSET, wallet })
}

export const setWallet = (wallet) => (dispatch) => {
  const provider = getProviderByBlockchain(wallet.blockchain)
  provider.subscribe(wallet.address)

  dispatch({ type: WALLETS_SET, wallet })
}

export const setWalletBalance = (walletId, balance) => (dispatch) => dispatch({ type: WALLETS_UPDATE_BALANCE, walletId, balance })

const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)

  const symbol = token.symbol()
  const tokenDAO = tokenService.getDAO(token.id())

  // subscribe
  tokenDAO
    .on(EVENT_NEW_TRANSFER, (tx: TxModel) => {
      const walletsAccounts = getDeriveWalletsAddresses(getState(), token.blockchain())
      const mainWalletAddresses = getMainAddresses(getState())
      const assetDonatorDAO = daoByType('AssetDonator')(getState())

      const isMainWalletFrom = tx.from().split(',').some((from) => mainWalletAddresses.includes(from))
      const isMainWalletTo = tx.to().split(',').some((to) => mainWalletAddresses.includes(to))
      const isMultiSigWalletsFrom = tx.from().split(',').some((from) => walletsAccounts.includes(from))
      const isMultiSigWalletsTo = tx.to().split(',').some((to) => walletsAccounts.includes(to))

      if (isMainWalletFrom || isMainWalletTo || isMultiSigWalletsFrom || isMultiSigWalletsTo || tx.from() === account || tx.to() === account) {
        if (mainWalletAddresses.includes(tx.from()) || mainWalletAddresses.includes(tx.to()) ||
          walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to()) ||
          tx.from() === account || tx.to() === account) {
          dispatch(notify(new TransferNoticeModel({
            amount: token.removeDecimals(tx.value()),
            symbol,
            from: tx.from(),
            to: tx.to(),
          })))
        }

        if (isMainWalletFrom || isMainWalletTo || tx.from() === account || tx.to() === account) { // for main wallet

          if (!(tx.from() === account || tx.to() === account)) {
            return
          }

          // update donator
          if (tx.from() === assetDonatorDAO.getInitAddress()) {
            dispatch(updateIsTIMERequired())
          }
        }

        if (walletsAccounts.includes(tx.from()) || walletsAccounts.includes(tx.to())) { // for derive wallets
          const setDerivedWalletBalance = async (wallet: DerivedWalletModel) => {

            dispatch({ type: ETH_MULTISIG_FETCHED, wallet: wallet.set('transactions', wallet.transactions().add(tx)) })

            const dao = tokenService.getDAO(token)
            const balance = await dao.getAccountBalance(wallet.address())
            dispatch({
              type: ETH_MULTISIG_BALANCE,
              walletId: wallet.address(),
              balance: new BalanceModel({
                id: token.id(),
                amount: new Amount(balance, token.symbol(), true),
              }),
            })
          }

          const walletFrom = getState().get(DUCK_ETH_MULTISIG_WALLET).item(tx.from())
          if (walletFrom && walletFrom.isFetched()) {
            setDerivedWalletBalance(walletFrom)
          }
          const walletTo = getMultisigWallets(getState()).item(tx.to())
          if (walletTo && walletTo.isFetched()) {
            setDerivedWalletBalance(walletTo)
          }
        }
      }
    })
    .on(EVENT_UPDATE_BALANCE, ({ account, balance }) => {

      switch (token.blockchain()) {
        case BLOCKCHAIN_ETHEREUM: {
          const wallets = getState().get(DUCK_ETH_MULTISIG_WALLET)
          if (wallets.item(account)) {
            dispatch({
              type: ETH_MULTISIG_BALANCE,
              walletId: account,
              balance: new BalanceModel({
                id: token.id(),
                amount: new Amount(balance, token.symbol(), true),
              }),
            })
          } else {
            const wallet = getWallet(token.blockchain(), account)(getState())
            dispatch({ type: WALLETS_UPDATE_BALANCE, walletId: wallet.id, balance: new Amount(balance, token.symbol()) })
          }
          break
        }
        case BLOCKCHAIN_NEM:
        case BLOCKCHAIN_BITCOIN:
        case BLOCKCHAIN_BITCOIN_CASH:
        case BLOCKCHAIN_DASH:
        case BLOCKCHAIN_LITECOIN:
        case BLOCKCHAIN_WAVES: {
          const wallet = getWallet(token.blockchain(), account)(getState())
          dispatch({ type: WALLETS_UPDATE_BALANCE, walletId: wallet.id, balance: new Amount(balance, token.symbol()) })
          break
        }
        default:
          //eslint-disable-next-line no-console
          console.warn('Update balance of unknown token blockchain: ', account, balance, token.toJSON())
          break
      }
    })
    .on(EVENT_UPDATE_TRANSACTION, ({ tx }) => {
      const wallet = getMainWalletForBlockchain(token.blockchain())(getState())
      const tdx = serializeToTxDescModel(tx)
      const blocks = { ...wallet.transactions.blocks }
      if (blocks[tx.blockNumber()]) {
        let isOut = true
        const transactions = blocks[tx.blockNumber()].transactions
        for (const i in transactions) {
          if (transactions[i].hash === tdx.hash) {
            transactions[i] = tdx
            isOut = false
            break
          }
        }
        if (isOut) {
          transactions.push(tdx)
        }
      } else {
        blocks[tx.blockNumber()] = {
          transactions: [tdx],
        }
      }

      dispatch({
        type: WALLETS_UPDATE_WALLET,
        wallet: new WalletModel({
          ...wallet,
          transactions: new TxHistoryModel(
            {
              blocks,
              isFetching: true,
            }),
        }),
      })
    })

  dispatch(marketAddToken(token.symbol()))

  if (token.symbol() === 'TIME') {
    dispatch(updateIsTIMERequired())
  }

  // loading transaction for Current transaction list
  if (token.blockchain() && !token.isERC20()) {
    const wallet = getMainWalletForBlockchain(token.blockchain())(getState())
    if (wallet && wallet.address) {
      dispatch(getTransactionsForMainWallet({
        address: wallet.address,
        blockchain: token.blockchain(),
        forcedOffset: true,
      }))
    }
  }
}

export const initTokenSubscription = () => (dispatch) => {
  dispatch(subscribeOnTokens(handleToken))
}

const updateAllowance = (allowance) => (dispatch, getState) => {
  const wallet = getMainEthWallet(getState())
  if (allowance) {
    dispatch({
      type: WALLETS_UPDATE_WALLET,
      wallet: new WalletModel({
        ...wallet,
        allowances: new AllowanceCollection({
          list: {
            ...wallet.allowances.list,
            [allowance.id()]: allowance,
          },
        }),
      }),
    })
  }
}

export const mainTransfer = (
  wallet: WalletModel,
  token: TokenModel,
  amount: Amount,
  recipient: string,
  feeMultiplier: number = 1,
  advancedParams = null,
) => async (dispatch) => {
  try {
    const tokenDAO = tokenService.getDAO(token.id())
    const tx = tokenDAO.transfer(wallet.address, recipient, amount)
    const executeMap = {
      [BLOCKCHAIN_ETHEREUM]: executeTransaction,
      [BLOCKCHAIN_NEM]: executeNemTransaction,
      [BLOCKCHAIN_BITCOIN]: executeBitcoinTransaction,
      [BLOCKCHAIN_BITCOIN_CASH]: executeBitcoinTransaction,
      [BLOCKCHAIN_LITECOIN]: executeBitcoinTransaction,
      [BLOCKCHAIN_DASH]: executeDashTransaction,
      [BLOCKCHAIN_WAVES]: executeWavesTransaction,
      [BLOCKCHAIN_LABOR_HOUR]: executeLaborHourTransaction,
    }

    // execute
    dispatch(executeMap[wallet.blockchain]({
      tx,
      options: {
        feeMultiplier,
        walletDerivedPath: wallet.derivedPath,
        symbol: token.symbol(),
        ...advancedParams,
      },
    }))

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyError(e))
  }
}

export const mainApprove = (token: TokenModel, amount: Amount, spender: string, feeMultiplier: number) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainWalletForBlockchain(token.blockchain())(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  const { account } = state.get(DUCK_SESSION)

  try {
    allowance && dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.approve(spender, amount, account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainApprove'))
    allowance && dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

export const mainRevoke = (token: TokenModel, spender: string, feeMultiplier: number = 1) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getMainWalletForBlockchain(token.blockchain())(state)
  const allowance = wallet.allowances.list[`${spender}-${token.id()}`]
  dispatch(updateAllowance(allowance.isFetching(true)))

  const { account } = state.get(DUCK_SESSION)
  try {
    dispatch(updateAllowance(allowance.isFetching(true)))
    const tokenDAO = tokenService.getDAO(token)
    const tx = tokenDAO.revoke(spender, token.symbol(), account)
    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier } }))
    }
  } catch (e) {
    dispatch(notifyError(e, 'mainRevoke'))
    dispatch(updateAllowance(allowance.isFetching(false)))
  }
}

// eslint-disable-next-line complexity
export const createNewChildAddress = ({ blockchain, tokens, name, deriveNumber }) => async (dispatch, getState) => {
  const state = getState()
  const signer = getEthereumSigner(state)
  const account = getState().get(DUCK_SESSION).account
  const wallets = getWallets(state)

  const lastDeriveNumbers = {}
  Object.values(wallets)
    .forEach((wallet) => {
      if (wallet.derivedPath && isOwner(wallet, account)) {
        if (!lastDeriveNumbers[wallet.blockchain()] || (lastDeriveNumbers[wallet.blockchain()] && lastDeriveNumbers[wallet.blockchain()] < wallet.deriveNumber)) {
          lastDeriveNumbers[wallet.blockchain()] = wallet.deriveNumber
        }
      }
    })

  let newDeriveNumber = deriveNumber
  let derivedPath
  let newWallet
  let address

  switch (blockchain) {
    case BLOCKCHAIN_ETHEREUM:
    case BLOCKCHAIN_LABOR_HOUR: {
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      const newWalletSigner = await EthereumMemoryDevice.getDerivedWallet(signer.privateKey, derivedPath)
      address = newWalletSigner.address
      break
    }
    case BLOCKCHAIN_BITCOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = btcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      btcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_LITECOIN:
      if (newDeriveNumber === undefined || newDeriveNumber === null) {
        newDeriveNumber = lastDeriveNumbers.hasOwnProperty(blockchain) ? lastDeriveNumbers[blockchain] + 1 : 0
      }
      derivedPath = `${WALLET_HD_PATH}/${newDeriveNumber}`
      newWallet = ltcProvider.createNewChildAddress(newDeriveNumber)
      address = newWallet.getAddress()
      ltcProvider.subscribeNewWallet(address)
      break

    case BLOCKCHAIN_NEM:
    case BLOCKCHAIN_WAVES:
    default:
      return null
  }

  const wallet = new WalletModel({
    name,
    address,
    owners: [account],
    isFetched: true,
    deriveNumber: newDeriveNumber,
    derivedPath,
    blockchain,
    customTokens: tokens,
    isDerived: true,
  })

  dispatch(setWallet(wallet))
  // dispatch(updateWalletBalance({ wallet })) // @todo Artem Kalashnikov.
}

export const getTransactionsForMainWallet = ({ blockchain, address, forcedOffset }) => async (dispatch, getState) => {
  const state = getState()
  const wallet = getWallet(blockchain, address)(state)
  if (!wallet) {
    return null
  }
  dispatch({
    type: WALLETS_UPDATE_WALLET,
    wallet: new WalletModel({
      ...wallet,
      transactions: new TxHistoryModel(
        {
          ...wallet.transactions,
          isFetching: true,
        }),
    }),
  })

  const tokens = getTokens(state)
  const transactions = await getTxList({ wallet, forcedOffset, tokens })

  const newWallet = getWallet(wallet.blockchain, wallet.address)(getState())
  dispatch({
    type: WALLETS_UPDATE_WALLET,
    wallet: new WalletModel({ ...newWallet, transactions }),
  })
}

export const getTxList = async ({ wallet, forcedOffset, tokens }) => {

  const transactions: TxHistoryModel = new TxHistoryModel({ ...wallet.transactions })
  const offset = forcedOffset ? 0 : (transactions.transactions.length || 0)
  const newOffset = offset + TXS_PER_PAGE

  let dao

  switch (wallet.blockchain) {
    case BLOCKCHAIN_ETHEREUM:
      dao = tokenService.getDAO(ETH)
      break
    case BLOCKCHAIN_BITCOIN:
      dao = tokenService.getDAO(BTC)
      break
    case BLOCKCHAIN_BITCOIN_CASH:
      dao = tokenService.getDAO(BCC)
      break
    case BLOCKCHAIN_DASH:
      dao = tokenService.getDAO(DASH)
      break
    case BLOCKCHAIN_LABOR_HOUR:
      dao = tokenService.getDAO(LHT)
      break
    case BLOCKCHAIN_LITECOIN:
      dao = tokenService.getDAO(LTC)
      break
    case BLOCKCHAIN_NEM:
      dao = tokenService.getDAO(XEM)
      break
    case BLOCKCHAIN_WAVES:
      dao = tokenService.getDAO(WAVES)
      break
  }

  const blocks = transactions.blocks
  let endOfList = false
  if (dao) {
    const txList = await dao.getTransfer(wallet.address, wallet.address, offset, TXS_PER_PAGE, tokens)

    txList.sort((a, b) => b.time - a.time)

    for (const tx: TxDescModel of txList) {
      if (!blocks[tx.blockNumber]) {
        blocks[tx.blockNumber] = { transactions: [] }
      }
      blocks[tx.blockNumber].transactions.push(tx)
    }

    if (transactions.transactions.length < newOffset) {
      endOfList = true
    }
  }

  return new TxHistoryModel({
    ...transactions,
    blocks,
    endOfList,
    isFetching: false,
    isFetched: true,
    isLoaded: true,
  })
}

export const cleanWalletsList = () => {
  return {
    type: WALLETS_LOGOUT,
  }
}

export const updateIsTIMERequired = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const wallet = getMainEthWallet(getState())
  try {
    const assetDonatorDAO = daoByType('AssetDonator')(getState())
    const isTIMERequired = await assetDonatorDAO.isTIMERequired(account)
    dispatch({
      type: WALLETS_SET_IS_TIME_REQUIRED,
      walletId: wallet.id,
      isTIMERequired,
    })
  } catch (e) {
    // eslint-disable-next-line
    console.error('require time error', e.message)
  }
}
