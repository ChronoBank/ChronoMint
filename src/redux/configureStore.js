import Immutable from 'immutable'
import { browserHistory, createMemoryHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form/immutable'
import { loadTranslations, setLocale, i18nReducer, I18n } from 'react-redux-i18n'
import moment from 'moment'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import ls from 'utils/LocalStorage'

import * as ducks from './ducks'
import { globalWatcher } from './watcher/actions'
import routingReducer from './routing'
import { SESSION_DESTROY } from './session/actions'

const historyEngine = process.env.NODE_ENV === 'standalone' ? createMemoryHistory() : browserHistory

const getNestedReducers = ducks => {
  let reducers = {}
  Object.keys(ducks).forEach(r => {
    reducers = { ...reducers, ...(typeof (ducks[r]) === 'function' ? { [r]: ducks[r] } : getNestedReducers(ducks[r])) }
  })
  return reducers
}

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState,
    prevRoutingStateJS
  return state => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    form: formReducer,
    i18n: i18nReducer,
    routing: routingReducer,
    ...getNestedReducers(ducks),
  })

  const rootReducer = (state, action) => {
    // workaround until fix redux devtool
    // eslint-disable-next-line
    // console.log(`%c ${action.type} `, 'color: #999; background: #333', ...action)

    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      state = new Immutable.Map()
      state = state.set('i18n', i18nState)
    }
    return appReducer(state, action)
  }

  // noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(historyEngine)
    ),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
      : f => f
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState
  )
}

export const store = configureStore()
store.dispatch(globalWatcher())

export const history = syncHistoryWithStore(historyEngine, store, {
  selectLocationState: createSelectLocationState(),
})

// syncTranslationWithStore(store) relaced with manual connfiguration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get('i18n').translations)
I18n.setLocaleGetter(() => store.getState().get('i18n').locale)

const locale = ls.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(require('../i18n/')))

store.dispatch(setLocale(locale))
/** <<< i18n END */
