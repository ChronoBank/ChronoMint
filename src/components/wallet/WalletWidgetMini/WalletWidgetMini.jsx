/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TokenModel from 'models/tokens/TokenModel'
import { Link } from 'react-router'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectWallet } from 'redux/wallet/actions'
import { modalsOpen } from 'redux/modals/actions'
import { Translate } from 'react-redux-i18n'
import { TOKEN_ICONS } from 'assets'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { getMainSymbolForBlockchain, getTokens } from 'redux/tokens/selectors'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import SendTokens from 'components/dashboard/SendTokens/SendTokens'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import './WalletWidgetMini.scss'
import { prefix } from './lang'
import SubIconForWallet from '../SubIconForWallet/SubIconForWallet'
import { getWalletInfo } from './selectors'
import WalletWidgetMiniUsdAmount from './WalletWidgetMiniUsdAmount'
import WalletTokensCount from './WalletTokensCount'

function makeMapStateToProps (state, ownProps) {
  const getWallet = getWalletInfo(ownProps.blockchain, ownProps.address)
  const mapStateToProps = (ownState) => {
    const tokens = getTokens(ownState)
    return {
      wallet: getWallet(ownState),
      token: tokens.item(getMainSymbolForBlockchain(ownProps.blockchain)),
    }
  }
  return mapStateToProps
}

function mapDispatchToProps (dispatch) {
  return {
    send: (tokenId, blockchain, address, wallet) => {
      dispatch(modalsOpen({
        component: SendTokens,
        props: {
          wallet,
          isModal: true,
          token: tokenId,
          blockchain,
          address,
        },
      }))
    },
    selectWallet: (blockchain, address) => dispatch(selectWallet(blockchain, address)),
  }
}

@connect(makeMapStateToProps, mapDispatchToProps)
export default class WalletWidgetMini extends PureComponent {
  static propTypes = {
    blockchain: PropTypes.string,
    wallet: PropTypes.shape({
      address: PropTypes.string,
      blockchain: PropTypes.string,
      name: PropTypes.string,
      requiredSignatures: PropTypes.number,
      pendingCount: PropTypes.number,
      isMultisig: PropTypes.bool,
      isTimeLocked: PropTypes.bool,
      is2FA: PropTypes.bool,
      isDerived: PropTypes.bool,
      customTokens: PropTypes.arrayOf(),
    }),
    address: PropTypes.string,
    token: PropTypes.instanceOf(TokenModel),
    send: PropTypes.func,
    selectWallet: PropTypes.func,
    showGroupTitle: PropTypes.bool,
  }

  handleSelectWallet = () => {
    const { address, blockchain } = this.props
    this.props.selectWallet(blockchain, address)
  }

  getWalletName = () => {
    const { wallet } = this.props
    const name = wallet.name
    if (name) {
      return name
    }

    let key = null
    if (this.isMy2FAWallet()) {
      key = 'twoFAWallet'
    } else if (this.isMySharedWallet()) {
      key = 'sharedWallet'
    } else if (this.isLockedWallet()) {
      key = 'lockedWallet'
    } else if (wallet.isDerived) {
      if (wallet.customTokens) {
        key = 'customWallet'
      } else {
        key = 'additionalStandardWallet'
      }
    } else {
      key = 'standardWallet'
    }

    return <Translate value={`${prefix}.${key}`} />
  }

  isMySharedWallet = () => {
    return this.props.wallet.isMultisig && !this.props.wallet.isTimeLocked && !this.props.wallet.is2FA
  }

  isMy2FAWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.is2FA
  }

  isLockedWallet = () => {
    return this.props.wallet.isMultisig && this.props.wallet.isTimeLocked
  }

  render () {
    const { address, token, blockchain, wallet, showGroupTitle} = this.props

    return (
      <div styleName='container'>
        {showGroupTitle && <h1 styleName='header-text' id={blockchain}><Translate value={`${prefix}.walletTitle`} title={blockchain} /></h1>}
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='main-info'>
              <div styleName='token-container'>
                {blockchain === BLOCKCHAIN_ETHEREUM && <SubIconForWallet wallet={wallet} />}
                <div styleName='token-icon'>
                  <IPFSImage styleName='image' multihash={token.icon()} fallback={TOKEN_ICONS[token.symbol()] || TOKEN_ICONS.DEFAULT} />
                </div>
              </div>
              <div styleName='content-container'>
                <Link styleName='addressWrapper' href='' to='/wallet' onTouchTap={this.handleSelectWallet}>
                  <div styleName='address-title'>
                    <div>{this.getWalletName()}</div>
                    <span styleName='address-address'>{address}</span>
                  </div>
                </Link>
                <div styleName='amount'>
                  <div styleName='amount-crypto'> {token.symbol()}&nbsp;<TokenValueSimple value={wallet.amount} withFraction /></div>
                  <div styleName='amount-fiat'><WalletWidgetMiniUsdAmount wallet={wallet} /></div>
                  <div styleName='amount-fiat'><WalletTokensCount wallet={wallet} /></div>
                </div>
              </div>
            </div>
            {wallet.pendingCount > 0 && (
              <div styleName='additional-info'>
                <div styleName='pendings-container'>
                  <div styleName='pendings-icon'><Translate value={`${prefix}.pending`} count={wallet.pendingCount} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}