/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import Snackbar from 'components/common/Snackbar/Snackbar'
import SideStack from 'components/common/SideStack/SideStack'
import ModalStack from 'components/common/ModalStack/ModalStack'
import BUTTONS from 'components/common/TopButtons/buttons'
import TheCookies from 'components/common/TheCookies/TheCookies'
import menu from 'menu'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { closeNotifier } from '@chronobank/core/redux/notifier/actions'
import { DUCK_NOTIFIER } from '@chronobank/core/redux/notifier/constants'
import theme from 'styles/themes/default'
import { DUCK_SIDES } from 'redux/sides/constants'
import { DUCK_MODALS } from '@chronobank/core/redux/modals/constants'
import MuiThemeProvider from '@material-ui/core/es/styles/MuiThemeProvider'
import IconButton from '@material-ui/core/es/IconButton/IconButton'
import DrawerMainMenu from 'layouts/partials/DrawerMainMenu/DrawerMainMenu'
import HeaderPartial from 'layouts/partials/HeaderPartial/HeaderPartial'
import { selectBlockchainInMainMenu, sidesCloseAll, toggleMainMenu } from 'redux/sides/actions'
import { getSelectedBlockchain } from 'redux/sides/selectors'

import './Markup.scss'

function mapStateToProps (state) {
  return {
    notice: state.get(DUCK_NOTIFIER).notice,
    mainMenuIsOpen: state.get(DUCK_SIDES).mainMenuIsOpen,
    modalStackSize: state.get(DUCK_MODALS).stack.length,
    isSelectedBlockchain: !!getSelectedBlockchain(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleCloseNotifier: () => dispatch(closeNotifier()),
    handleCLoseAllSides: () => dispatch(sidesCloseAll()),
    handleSelectBLockchain: (selectedBlockchain) => dispatch(selectBlockchainInMainMenu(selectedBlockchain)),
    onToggleMainMenu: (mainMenuIsOpen) => dispatch(toggleMainMenu(mainMenuIsOpen)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Markup extends PureComponent {
  static propTypes = {
    modalStackSize: PropTypes.number,
    notice: PropTypes.instanceOf(Object),
    handleCloseNotifier: PropTypes.func,
    children: PropTypes.node,
    isSelectedBlockchain: PropTypes.bool,
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
    onToggleMainMenu: PropTypes.func,
    mainMenuIsOpen: PropTypes.bool,
    handleCLoseAllSides: PropTypes.func,
    handleSelectBLockchain: PropTypes.func,
  }

  handleToggleMainMenu = () => {
    this.props.onToggleMainMenu(!this.props.mainMenuIsOpen)
    if (this.props.mainMenuIsOpen) {
      this.props.handleCLoseAllSides()
      this.props.handleSelectBLockchain(null)
    }
  }

  handleToggleMainMenuAndScroll = () => {
    window.scrollTo(0, 0)
    this.contentWrapper.scrollTo(0, 0)
    this.handleToggleMainMenu()
  }

  setRef = (el) => {
    this.contentWrapper = el
  }

  renderPageTitle = () => {
    const { pathname } = this.props.location
    let currentPage = null

    const filter = (item) => {
      if (item.path === pathname) {
        currentPage = item
      }
    }
    menu.user.map(filter)
    if (!currentPage) {
      menu.cbe.map(filter)
    }

    if (!currentPage) {
      Object.keys(BUTTONS).forEach((path) => {
        if (path === pathname) {
          currentPage = BUTTONS[path]
        }
      })
    }

    if (currentPage) {
      return <Translate value={currentPage.title} />
    }
  }

  render () {
    const {
      isSelectedBlockchain,
      mainMenuIsOpen,
      modalStackSize,
      location,
      notice,
      handleCloseNotifier,
      children,
    } = this.props
    return (
      <MuiThemeProvider theme={theme}>
        <TheCookies />
        <div styleName={classnames('root', { 'noScroll': modalStackSize > 0 })}>
          <div styleName={classnames('mainMenu', { 'open': mainMenuIsOpen || isSelectedBlockchain })}>
            <DrawerMainMenu onSelectLink={this.handleToggleMainMenuAndScroll} />
          </div>
          <div styleName='middle'>
            <div styleName='middleTop'>
              <div styleName='mainMenuToggle'>
                <IconButton onClick={this.handleToggleMainMenu}>
                  <i className='material-icons'>menu</i>
                </IconButton>
              </div>
              <div styleName='pageTitle'>
                {this.renderPageTitle()}
              </div>
              <HeaderPartial location={location} />
            </div>
            <div styleName='middleSnackbar'>
              <div styleName='middleSnackbarPanel'>
                {notice
                  ? (
                    <Snackbar
                      notice={notice}
                      autoHideDuration={4000}
                      onRequestClose={handleCloseNotifier}
                    />)
                  : null
                }
              </div>
            </div>
            <div styleName='middleContent' id='contentWrapper' ref={this.setRef}>
              {children}
            </div>
          </div>
          <div styleName='middleBottom' />
          <div styleName={classnames('overlay', { 'open': mainMenuIsOpen || isSelectedBlockchain })} onClick={this.handleToggleMainMenu} />
          <SideStack />
          <ModalStack />
        </div>
      </MuiThemeProvider>
    )
  }
}
