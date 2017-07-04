import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, ListItem } from 'material-ui'
import { connect } from 'react-redux'
import LoginMetamask from '../../components/pages/LoginPage/LoginMetamask'
import LoginLocal from '../../components/pages/LoginPage/LoginLocal'
import WarningIcon from 'material-ui/svg-icons/alert/warning'
import { yellow800 } from 'material-ui/styles/colors'
import { checkNetwork, clearErrors, createNetworkSession } from '../../redux/network/actions'
import ProviderSelector from '../../components/pages/LoginPage/ProviderSelector'
import { providerMap } from '../../network/settings'
import LoginInfura from '../../components/pages/LoginPage/LoginInfura/LoginInfura'
import LoginUPort from '../../components/pages/LoginPage/LoginUPort'
import { login } from '../../redux/session/actions'
import { MuiThemeProvider } from 'material-ui'
import inverted from '../../styles/themes/inversed'
import './LoginPage.scss'

const mapStateToProps = (state) => ({
  errors: state.get('network').errors,
  selectedAccount: state.get('network').selectedAccount,
  selectedProviderId: state.get('network').selectedProviderId,
  selectedNetworkId: state.get('network').selectedNetworkId
})

const mapDispatchToProps = (dispatch) => ({
  checkNetwork: () => dispatch(checkNetwork()),
  createNetworkSession: (account, provider, network) => dispatch(createNetworkSession(account, provider, network)),
  login: (account) => dispatch(login(account)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
class LoginPage extends Component {
  constructor () {
    super()
    this.state = {
      isShowProvider: true
    }
  }

  handleLogin = () => {
    this.props.clearErrors()
    this.props.checkNetwork(
      this.props.selectedAccount,
      this.props.selectedProviderId,
      this.props.selectedNetworkId
    ).then((isPassed) => {
      if (isPassed) {
        this.props.createNetworkSession(
          this.props.selectedAccount,
          this.props.selectedProviderId,
          this.props.selectedNetworkId
        )
        this.props.login(this.props.selectedAccount)
      }
    })
  }

  handleToggleProvider = (isShowProvider) => {
    this.setState({isShowProvider})
  }

  render () {
    const {errors, selectedProviderId} = this.props
    return (
      <div styleName='wrapper'>
        <div styleName='content'>
          <a href='https://chronobank.io' styleName='logo'>
            <div styleName='logoImg' />
            <div styleName='logoText'>Chrono<span styleName='logoBank'>bank.io</span></div>
          </a>
          <MuiThemeProvider muiTheme={inverted}>
            <div styleName='form'>
              <div styleName='title'>Login</div>
              <div styleName='subtitle'>Welcome back!</div>
              {this.state.isShowProvider && <ProviderSelector />}
              {selectedProviderId === providerMap.metamask.id && <LoginMetamask onLogin={this.handleLogin} />}
              {selectedProviderId === providerMap.local.id && <LoginLocal onLogin={this.handleLogin} />}
              {selectedProviderId === providerMap.infura.id && (
                <LoginInfura
                  onLogin={this.handleLogin}
                  onToggleProvider={this.handleToggleProvider} />
              )}
              {selectedProviderId === providerMap.uport.id && <LoginUPort onLogin={this.handleLogin} />}

              {errors && (
                <div styleName='errors'>
                  <List>
                    {errors.map((error, index) => (
                      <ListItem
                        key={index}
                        leftIcon={<WarningIcon color={yellow800} />}
                        primaryText={error} />
                    ))}
                  </List>
                </div>
              )}
            </div>
          </MuiThemeProvider>
        </div>
        <div styleName='footer'>
          <div styleName='copyright'>Copyright ©2017 Edway Group Pty. Ltd. All Rights Reserved.</div>
          <div styleName='links'>
            <a styleName='link' href='https://chronobank.io'>Chronobank.io</a>
            <a styleName='link' href='https://chronobank.io/faq'>Q&A</a>
            <a styleName='link' href='https://chronobank.io/#contactus'>Contact Us</a>
          </div>
        </div>
      </div>
    )
  }
}

LoginPage.propTypes = {
  clearErrors: PropTypes.func,
  checkNetwork: PropTypes.func,
  createNetworkSession: PropTypes.func,
  login: PropTypes.func,
  selectedAccount: PropTypes.string,
  selectedProviderId: PropTypes.number,
  selectedNetworkId: PropTypes.number,
  errors: PropTypes.array
}

export default LoginPage
