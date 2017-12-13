import Immutable from 'immutable'
import contractManager from 'dao/ContractsManagerDAO'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'
import Web3Converter from 'utils/Web3Converter'
import { DUCK_TOKENS, TOKENS_FETCHED, TOKENS_UPDATE } from 'redux/tokens/actions'
import ManagersCollection from 'models/tokens/ManagersCollection'
import ReissuableModel from 'models/tokens/ReissuableModel'
import FeeModel from 'models/tokens/FeeModel'

export const DUCK_ASSETS_MANAGER = 'assetsManager'

export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const GET_TOKENS = 'AssetsManager/GET_TOKENS'
export const SET_TOKEN = 'AssetsManager/SET_TOKEN'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'
export const GET_ASSETS_MANAGER_COUNTS_START = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS_START'
export const GET_MANAGERS_FOR_TOKEN = 'AssetsManager/GET_MANAGERS_FOR_TOKEN'
export const SELECT_TOKEN = 'AssetsManager/SELECT_TOKEN'
export const SELECT_PLATFORM = 'AssetsManager/SELECT_PLATFORM'
export const GET_MANAGERS_FOR_TOKEN_LOADING = 'AssetsManager/GET_MANAGERS_FOR_TOKEN_LOADING'
export const SET_TOTAL_SUPPLY = 'AssetsManager/SET_TOTAL_SUPPLY'
export const GET_TRANSACTIONS_START = 'AssetsManager/GET_TRANSACTIONS_START'
export const GET_TRANSACTIONS_DONE = 'AssetsManager/GET_TRANSACTIONS_DONE'
export const SET_IS_REISSUABLE = 'AssetsManager/SET_IS_REISSUABLE'
export const SET_NEW_MANAGERS_LIST = 'AssetsManager/SET_NEW_MANAGERS_LIST'
export const SET_FEE = 'AssetsManager/SET_FEE'
export const GET_USER_PLATFORMS = 'AssetsManager/GET_USER_PLATFORMS'

export const getUsersPlatforms = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  const usersPlatforms = await platformManagerDao.getPlatformsMetadataForUser(account, dispatch, getState().get(DUCK_ASSETS_MANAGER))
  dispatch({ type: GET_USER_PLATFORMS, payload: { usersPlatforms } })
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getParticipatingPlatformsForUser(account)
  const assets = await assetsManagerDao.getSystemAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(account)
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS, payload: { platforms, assets, managers } })
}

export const getPlatforms = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getParticipatingPlatformsForUser(account)
  dispatch({ type: GET_PLATFORMS, payload: { platforms } })
}

export const getTokens = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()

  const [ ERC20ManagerDAO, assets ] = await Promise.all([
    contractManager.getERC20ManagerDAO(),
    assetsManagerDao.getSystemAssetsForOwner(account),
  ])

  let tokensMap = new Immutable.Map()
  if (Object.keys(assets).length) {
    tokensMap = await ERC20ManagerDAO.getTokensByAddresses(Object.keys(assets), false, account, assets)
  }
  dispatch({ type: GET_TOKENS, payload: { tokensMap, assets } })
  return { tokensMap, assets }
}

export const createPlatform = (values) => async () => {
  try {
    const dao = await contractManager.getPlatformManagerDAO()
    if (values.get('alreadyHave')) {
      await dao.attachPlatform(values.get('platformAddress'))
    } else {
      await dao.createPlatform()
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const detachPlatform = (platform) => async (dispatch) => {
  const dao = await contractManager.getPlatformManagerDAO()
  const result = await dao.detachPlatform(platform)

  if (result) {
    dispatch(getPlatforms())
  }
}

export const watchPlatformManager = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const platformManagerDAO = await contractManager.getPlatformManagerDAO()
  const callback = (tx) => {
    dispatch(setTx(tx))
    dispatch(getUsersPlatforms())
    dispatch(getPlatforms())
  }
  platformManagerDAO.watchCreatePlatform(callback, account)
}

export const createAsset = (token: TokenModel) => async (dispatch) => {
  try {
    let txHash
    const tokenManagementExtension = await contractManager.getTokenManagementExtensionDAO(token.platform().address)
    if (token.withFee()) {
      txHash = await tokenManagementExtension.createAssetWithFee(token)
    } else {
      txHash = await tokenManagementExtension.createAssetWithoutFee(token)
    }
    dispatch({
      type: TOKENS_UPDATE,
      token: token.isPending(true).transactionHash(txHash),
    })
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const getManagersForAssetSymbol = (token: TokenModel) => async (dispatch) => {
  dispatch({ type: TOKENS_FETCHED, token: token.managersList(new ManagersCollection().isFetching(true)) })
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const managersList = await assetsManagerDAO.getManagersForAssetSymbol(token.symbol())
  dispatch({
    type: TOKENS_FETCHED,
    token: token.managersList(managersList.isFetched(true)),
  })
}

export const removeManager = (token: TokenModel, manager: String) => async () => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    const txHash = await chronoBankPlatformDAO.removeAssetPartOwner(token.symbol(), manager)
    return txHash
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const addManager = (token: TokenModel, manager: String) => async () => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.addAssetPartOwner(token.symbol(), manager)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const reissueAsset = (token: TokenModel, amount: number) => async () => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.reissueAsset(token, amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const revokeAsset = (token: TokenModel, amount: number) => async () => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.revokeAsset(token, amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const isReissuable = (token: TokenModel) => async (dispatch) => {
  dispatch({ type: TOKENS_FETCHED, token: token.isReissuable(new ReissuableModel().isFetching(true)) })
  let isReissuable = false
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    isReissuable = await chronoBankPlatformDAO.isReissuable(token.symbol())
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
  dispatch({ type: TOKENS_FETCHED, token: token.isReissuable(new ReissuableModel({ isReissuable }).isFetched(true)) })
}

export const setTotalSupply = (token, value, isIssue) => (dispatch, getState) => {
  const amount = token.dao().removeDecimals(value)
  const totalSupply = getState().get(DUCK_ASSETS_MANAGER).tokensMap.getIn([ token.symbol(), 'totalSupply' ])
  if (!totalSupply) {
    return
  }
  return dispatch({
    type: SET_TOTAL_SUPPLY,
    payload: {
      token: isIssue
        ? token.totalSupply(totalSupply.plus(amount))
        : token.totalSupply(totalSupply.minus(amount)),
    },
  })
}

export const getTransactions = () => async (dispatch, getState) => {
  dispatch({ type: GET_TRANSACTIONS_START })
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const transactionsList = await assetsManagerDAO.getTransactions(account)

  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

export const setTx = (tx) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const txModel = await assetsManagerDAO.getTxModel(tx, account)
  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList: [ txModel ] } })
}

export const setManagers = (tx) => async (dispatch, getState) => {
  try {
    const symbol = Web3Converter.bytesToString(tx.args.symbol)
    const { account } = getState().get(DUCK_SESSION)
    let { tokensMap, selectedToken } = getState().get(DUCK_ASSETS_MANAGER)
    if (!tokensMap.get(symbol) || tx.args.from === account) {
      if (selectedToken === symbol) {
        dispatch({ type: SELECT_TOKEN, payload: { selectedToken: null } })
      }
      dispatch(getAssetsManagerData())
      dispatch(getTokens())
    } else {
      const { from, to } = tx.args
      const assetsManagerDao = await contractManager.getAssetsManagerDAO()
      const managers = await assetsManagerDao.getManagers(account)
      let managersList = [ ...(tokensMap.getIn([ symbol, 'managersList' ]) || []) ]
      if (assetsManagerDao.isEmptyAddress(from)) {
        if (managersList.indexOf(to) < 0) {
          managersList.push(to)
        }
      } else {
        managersList = managersList.filter((manager) => manager !== from)
      }
      dispatch({ type: SET_NEW_MANAGERS_LIST, payload: { managers, symbol, managersList } })
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

export const watchInitTokens = () => async (dispatch, getState) => {
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS_START })
  dispatch(getUsersPlatforms())
  dispatch(getTransactions())
  const { account } = getState().get(DUCK_SESSION)
  const [ ERC20ManagerDAO, assetsManagerDao, chronoBankPlatformDAO, platformTokenExtensionGatewayManagerEmitterDAO ] = await Promise.all([
    contractManager.getERC20ManagerDAO(),
    contractManager.getAssetsManagerDAO(),
    contractManager.getChronoBankPlatformDAO(),
    contractManager.getPlatformTokenExtensionGatewayManagerEmitterDAO(),
  ])
  const issueCallback = (symbol, value, isIssue, tx) => {
    const { tokensMap } = getState().get(DUCK_ASSETS_MANAGER)
    const token = tokensMap.get(symbol)
    if (token) {
      dispatch(setTotalSupply(token, value, isIssue))
    }
    dispatch(setTx(tx))
  }
  const managersCallback = (tx) => {
    dispatch(setManagers(tx))
    if (tx.args.from !== account && tx.args.to !== account) {
      return
    }
    dispatch(setTx(tx))
  }
  const assetCallback = async (tx) => {
    const assets = await assetsManagerDao.getSystemAssetsForOwner(account)
    let tokensMap = new Immutable.Map()
    if (Object.keys(assets).length) {
      tokensMap = await ERC20ManagerDAO.getTokensByAddresses([ tx.args.token ], false, account, assets)
    }
    dispatch({ type: SET_TOKEN, payload: { tokensMap, assets } })
    dispatch(setTx(tx))
  }

  return Promise.all([
    chronoBankPlatformDAO.watchIssue(issueCallback),
    chronoBankPlatformDAO.watchRevoke(issueCallback),
    chronoBankPlatformDAO.watchManagers(managersCallback),
    platformTokenExtensionGatewayManagerEmitterDAO.watchAssetCreate(assetCallback, account),
  ])
}

export const getFee = (token: TokenModel) => async (dispatch) => {
  dispatch({ type: TOKENS_FETCHED, token: token.fee(token.fee().isFetching(true)) })
  let tokenFee = token.fee()
    .withFee(false)
    .isFetching(false)
    .isFetched(true)
  try {
    const feeInterfaceDAO = await contractManager.getFeeInterfaceDAO(token.address())
    const res = await feeInterfaceDAO.getFeePercent()
    tokenFee = tokenFee
      .fee(res)
      .withFee(true)

    dispatch({ type: TOKENS_FETCHED, token: token.fee(tokenFee) })
  } catch (e) {
    dispatch({ type: TOKENS_FETCHED, token: token.fee(tokenFee) })
  }
}
export const selectToken = (token: TokenModel) => async (dispatch) => {
  dispatch({
    type: SELECT_TOKEN,
    payload: { symbol: token.id() },
  })
  dispatch({
    type: TOKENS_FETCHED,
    token: token
      .managersList(new ManagersCollection().isFetching(true))
      .fee(token.fee().isFetching(true))
      .isReissuable(token.isReissuable().isFetching(true)),
  })

  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
  const feeInterfaceDAO = await contractManager.getFeeInterfaceDAO(token.address())
  const [ managersList, isReissuable, fee ] = await Promise.all([
    assetsManagerDAO.getManagersForAssetSymbol(token.symbol()),
    chronoBankPlatformDAO.isReissuable(token.symbol()),
    feeInterfaceDAO.getFeePercent(),
  ])

  dispatch({
    type: TOKENS_FETCHED,
    token: token
      .managersList(managersList.isFetched(true))
      .isReissuable(new ReissuableModel({ isReissuable }).isFetched(true))
      .fee(new FeeModel({ fee, withFee: !!fee }).isFetched(true).isFetching(false)),
  })

}
