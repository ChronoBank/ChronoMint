import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import LOCModel from '../../models/LOCModel'
import LOCNoticeModel from '../../models/notices/LOCNoticeModel'
import { notify } from '../notifier/notifier'
import LOCManagerDAO from '../../dao/LOCManagerDAO'
import { showAlertModal } from '../ui/modal'

export const LOCS_LIST_FETCH = 'locs/LIST_FETCH'
export const LOCS_LIST = 'locs/LIST'
export const LOCS_UPDATE_FILTER = 'locs/UPDATE_FILTER'
export const LOCS_COUNTER = 'locs/COUNTER'

export const LOC_CREATE = 'loc/CREATE'
export const LOC_UPDATE = 'loc/UPDATE'
export const LOC_REMOVE = 'loc/REMOVE'

const removeOldLOC = (loc) => (dispatch) => {
  if (loc.name() !== '' && loc.name() !== loc.oldName()) {
    dispatch({type: LOC_REMOVE, name: loc.oldName()})
  }
}

const handleLOCUpdate = (loc: LOCModel, notice: LOCNoticeModel, isOld: boolean) => (dispatch) => {
  dispatch(removeOldLOC(loc))
  dispatch({type: LOC_UPDATE, loc})
  dispatch(notify(notice, isOld))
}

const handleLOCRemove = (name: string, notice: LOCNoticeModel, isOld: boolean) => (dispatch) => {
  dispatch({type: LOC_REMOVE, name})
  dispatch(notify(notice, isOld))
}

export const watchInitLOC = () => async (dispatch) => {
  const updateCallback = (loc, notice, isOld) => dispatch(handleLOCUpdate(loc, notice, isOld))
  const removeCallback = (name, notice, isOld) => dispatch(handleLOCRemove(name, notice, isOld))

  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  await locManagerDAO.watchNewLOC(updateCallback)
  await locManagerDAO.watchUpdateLOC(updateCallback)
  await locManagerDAO.watchUpdateLOCStatus(updateCallback)
  await locManagerDAO.watchRemoveLOC(removeCallback)
  await locManagerDAO.watchReissue(updateCallback)
}

export const getLOCs = () => async (dispatch) => {
  dispatch({type: LOCS_LIST_FETCH})
  const locManagerDAO: LOCManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  const locs = await locManagerDAO.getLOCs()
  dispatch({type: LOCS_LIST, locs})
}

export const addLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_CREATE, loc})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.addLOC(loc)
}

export const updateLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch(removeOldLOC(loc))
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.updateLOC(loc)
}

export const removeLOC = (loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.removeLOC(loc.name())
}

export const issueAsset = (amount: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.issueAsset(amount, loc.name())
}

export const updateStatus = (status: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.updateStatus(status, loc.name())
}

export const revokeAsset = (amount: number, loc: LOCModel) => async (dispatch) => {
  dispatch({type: LOC_UPDATE, loc: loc.isPending(true)})
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  return locManagerDAO.revokeAsset(amount, loc.name())
}

export const getLOCsCounter = () => async (dispatch) => {
  const locManagerDAO = await ContractsManagerDAO.getLOCManagerDAO()
  const counter = locManagerDAO.getLOCCount()
  dispatch({type: LOCS_COUNTER, counter})
}

export const updateLOCFilter = (filter) => (dispatch) => {
  dispatch({type: LOCS_UPDATE_FILTER, filter})
}
