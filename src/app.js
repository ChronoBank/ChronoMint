import React from 'react'
import {render} from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import themeDefault from './themeDefault'
import injectTapEventPlugin from 'react-tap-event-plugin'
import IPFSDAO from './dao/IPFSDAO'
import OrbitDAO from './dao/OrbitDAO'
import './styles.scss'
import 'font-awesome/css/font-awesome.css'
import 'flexboxgrid/css/flexboxgrid.css'
import ErrorPage from './pages/ErrorPage'

class App {
  start () {
    window.resolveWeb3 = new Promise(resolve => {
      window.addEventListener('load', function () {
        resolve(window.hasOwnProperty('web3') ? window.web3 : null)
      })
    })

    IPFSDAO.init().then(ipfsNode => {
      OrbitDAO.init(ipfsNode)
      injectTapEventPlugin()
      return require('./dao/ChronoMintDAO').checkDeployed().then(() => {
        window.resolveWeb3.then(() => {
          render(
            <MuiThemeProvider muiTheme={themeDefault}>{require('./router.js')}</MuiThemeProvider>,
            document.getElementById('react-root')
          )
        })
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
