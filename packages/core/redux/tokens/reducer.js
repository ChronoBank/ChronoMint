/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokensCollection from '../../models/tokens/TokensCollection'
import * as a from './constants'

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
  case a.TOKENS_INIT:
    return state.isInited(true)
  case a.TOKENS_FETCHING:
    return state.leftToFetch(action.count)
  case a.TOKENS_FAILED:
    return state.leftToFetch(state.leftToFetch() - 1)
  case a.TOKENS_FETCHED:
    return state.itemFetched(action.token)
  case a.TOKENS_REMOVE:
    return state.remove(action.token)
    // TODO @dkchv: useless?
  case a.TOKENS_UPDATE:
    return state.update(action.token)
  case a.TOKENS_UPDATE_LATEST_BLOCK:
    return state.latestBlocks({ ...state.latestBlocks(), [action.blockchain]: action.block })
  default:
    return state
  }
}
