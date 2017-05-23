import {
  NETWORK_SET_ACCOUNTS,
  NETWORK_CLEAR_ERRORS,
  NETWORK_ADD_ERROR,
  NETWORK_SELECT_ACCOUNT,
  NETWORK_SET_TEST_RPC,
  NETWORK_SET_TEST_METAMASK,
  NETWORK_SET_NETWORK,
  NETWORK_SET_PROVIDER
} from './reducer'
import web3Provider from '../../network/Web3Provider'
import Web3 from 'web3'
import LS from '../../utils/LocalStorage'
import metaMaskResolver from '../../network/metaMaskResolver'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import { login } from '../session/actions'
import uportProvider, { decodeMNIDaddress } from '../../network/uportProvider'
import { LOCAL_ID } from '../../network/settings'

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

export const checkNetworkAndLogin = (account) => (dispatch) => {
  ChronoMintDAO.isDeployed().then(isContractDeployed => {
    if (isContractDeployed) {
      web3Provider.resolve()
      dispatch(login(account, true))
    } else {
      dispatch({
        type: NETWORK_ADD_ERROR,
        error: 'ChronoMint contracts has not been deployed to this network.'
      })
    }
  })
}

export const checkTestRPC = (providerUrl) => (dispatch) => {
  const web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider(providerUrl || '//localhost:8545'))

  return new Promise(resolve => {
    return web3.eth.getBlock(0, (err, result) => {
      const hasHash = !err && result && !!result.hash
      if (hasHash) {
        dispatch({type: NETWORK_SET_TEST_RPC})
        return resolve(true)
      }
      resolve(false)
    })
  })
}

export const checkMetaMask = () => (dispatch) => {
  return metaMaskResolver().then((isMetaMask) => {
    isMetaMask && dispatch({type: NETWORK_SET_TEST_METAMASK})
  })
}

export const selectNetwork = (selectedNetworkId) => (dispatch) => {
  LS.setNetworkId(selectedNetworkId)
  dispatch({type: NETWORK_SET_NETWORK, selectedNetworkId})
}

export const selectProvider = (selectedProviderId) => (dispatch) => {
  LS.removeNetworkId()
  dispatch({type: NETWORK_SET_NETWORK, networkId: null})
  LS.setWeb3Provider(selectedProviderId)
  dispatch({type: NETWORK_SET_PROVIDER, selectedProviderId})
}

export const addError = (error) => (dispatch) => {
  dispatch({type: NETWORK_ADD_ERROR, error})
}

export const clearErrors = () => (dispatch) => {
  dispatch({type: NETWORK_CLEAR_ERRORS})
}

export const selectAccount = (selectedAccount) => (dispatch) => {
  LS.setAccount(selectedAccount)
  dispatch({type: NETWORK_SELECT_ACCOUNT, selectedAccount})
}

export const loadAccounts = () => (dispatch) => {
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  return web3Provider.getAccounts().then(accounts => {
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts})
    return accounts
  }).catch(e => dispatch(addError(e.message)))
}

export const loginUport = () => dispatch => {
  dispatch(clearErrors())
  web3Provider.setWeb3(uportProvider.getWeb3())
  web3Provider.setProvider(uportProvider.getProvider())
  // do not use loadAccounts, fetched accounts are encoded
  return web3Provider.getAccounts().then(accounts => {
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    // decode first
    const decodedAccounts = accounts.map(item => decodeMNIDaddress(item).address)
    dispatch({type: NETWORK_SET_ACCOUNTS, accounts: decodedAccounts})
    dispatch(selectAccount(decodedAccounts[0]))
  }).catch(e => dispatch(addError(e.message)))
}

export const clearTestRPCState = () => (dispatch) => {
  dispatch(selectProvider(null))
  dispatch({type: NETWORK_SET_ACCOUNTS, accounts: []})
  dispatch(selectAccount(null))
  web3Provider.reset()
  LS.removeWeb3Provider()
  LS.removeNetworkId()
  LS.removeAccount()
}

export const restoreTestRPCState = (account) => dispatch => {
  const web3 = new Web3()
  web3Provider.setWeb3(web3)
  web3Provider.setProvider(new web3.providers.HttpProvider('//localhost:8545'))
  web3Provider.resolve()

  dispatch(selectProvider(LOCAL_ID))
  return dispatch(loadAccounts())
    .then(() => dispatch(selectAccount(account)))
    .catch(() => dispatch(clearTestRPCState()))
}
