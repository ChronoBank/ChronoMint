import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import ChronoMintDAO from './dao/ChronoMintDAO'
import ErrorPage from './pages/ErrorPage'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'

class App {
  start () {
    injectTapEventPlugin()
    return ChronoMintDAO.getAddress().then((r) => {
      if (!r) {
        throw new Error('Couldn\'t connect. Contracts has not been deployed to detected network. Local ethereum node, mist browser or google chrome with metamask plugin should be used')
      }
      window.resolveWeb3.then(() => {
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        window.location.protocol = 'https:'
        window.location.reload()
      }
        render(
          <MuiThemeProvider muiTheme={themeDefault}>{require('./router.js')}</MuiThemeProvider>,
          document.getElementById('react-root')
        )
      })
    }).catch(e => {
      render(
        <MuiThemeProvider muiTheme={themeDefault}>
          <ErrorPage error={e} />
        </MuiThemeProvider>,
        document.getElementById('react-root')
      )
    })
  }
}

export default new App()
