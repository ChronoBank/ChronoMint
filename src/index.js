/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import 'regenerator-runtime/runtime'
import 'flexboxgrid/css/flexboxgrid.css'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import { render } from 'react-dom'
import { bootstrap } from '@chronobank/core/redux/session/thunks'
import { store } from './redux/configureStore'
import router from './router'
import themeDefault from './themeDefault'

require('events').EventEmitter.defaultMaxListeners = 0

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

store
  .dispatch(bootstrap())
  .then(() => {
    render(
      <MuiThemeProvider theme={themeDefault}>
        {router}
      </MuiThemeProvider>,
      document.getElementById('react-root'),
    )
  })
