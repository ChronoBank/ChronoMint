/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Translate } from 'react-redux-i18n'
import { Button, TokenValue } from 'components'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokensCollection from 'models/tokens/TokensCollection'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import Preloader from 'components/common/Preloader/Preloader'
import MultisigWalletPendingTxModel from 'models/wallet/MultisigWalletPendingTxModel'
import Amount from 'models/Amount'
import { confirmMultisigTx, getPendingData, revokeMultisigTx } from 'redux/multisigWallet/actions'
import { DUCK_I18N } from 'redux/configureStore'

import { prefix } from './lang'
import './PendingTxWidget.scss'

function mapStateToProps (state) {
  return {
    tokens: state.get(DUCK_TOKENS),
    locale: state.get(DUCK_I18N).locale,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    revoke: (wallet, tx) => dispatch(revokeMultisigTx(wallet, tx)),
    confirm: (wallet, tx) => dispatch(confirmMultisigTx(wallet, tx)),
    getPendingData: (wallet, pending) => dispatch(getPendingData(wallet, pending)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PendingTxWidget extends PureComponent {
  static propTypes = {
    wallet: PropTypes.instanceOf(MultisigWalletModel),
    revoke: PropTypes.func,
    confirm: PropTypes.func,
    getPendingData: PropTypes.func,
    tokens: PropTypes.instanceOf(TokensCollection),
    locale: PropTypes.string,
  }

  componentWillMount () {
    this.checkAndFetchPendings(this.props.wallet)
  }

  componentWillReceiveProps ({ wallet }) {
    this.checkAndFetchPendings(wallet)
  }

  handleRevoke = (wallet, item) => () => {
    this.props.revoke(wallet, item)
  }

  handleConfirm = (wallet, item) => () => {
    this.props.confirm(wallet, item)
  }

  checkAndFetchPendings (wallet) {
    if (wallet.pendingTxList().isFetched() || wallet.pendingTxList().isFetching()) {
      return
    }

    wallet.pendingTxList().items().forEach((item) => {
      if (item.isFetched() || item.isFetching()) {
        return
      }
      this.props.getPendingData(wallet, item)
    })
  }

  renderIcon (tx: MultisigWalletPendingTxModel) {
    const func = tx.decodedTx().funcName()
    let icon = null
    let styleName = ''
    switch (func) {
      case'transfer':
        icon = 'send'
        break
      case'addOwner':
        icon = 'profile'
        break
      case'removeOwner':
        icon = 'profile'
        styleName = 'redColor'
        break
      case'kill':
        icon = 'delete'
        break
      case'changeRequirement':
        icon = 'lock'
        break
    }
    return (
      <div styleName={classnames('iconWrapper', { [ styleName ]: styleName })}>
        <i className='chronobank-icon'>{icon}</i>
      </div>
    )
  }

  renderRow (wallet, item: MultisigWalletPendingTxModel) {
    const isConfirmed = item.isConfirmed()

    return (
      <div styleName='row' key={item.id()}>
        {item.isPending()
          ? <Preloader />
          : (
            <div styleName='rowTable'>
              {this.renderIcon(item)}
              <div styleName='values'>
                <div styleName='title'>{item.title()}</div>
                {item.details().map((item, index) => {
                  const value = item.value instanceof Amount
                    ? <TokenValue value={item.value} />
                    : item.value
                  return (
                    <div key={index}>
                      <span>{item.label}:&nbsp;</span>
                      <span>{value}</span>
                    </div>
                  )
                })}
              </div>
              <div styleName='actions'>
                <Button
                  flat
                  label={<Translate value='wallet.revoke' />}
                  disabled={!isConfirmed}
                  onTouchTap={isConfirmed
                    ? this.handleRevoke(wallet, item)
                    : undefined
                  }
                />
                <Button
                  label={<Translate value='wallet.sign' />}
                  disabled={isConfirmed}
                  onTouchTap={!isConfirmed
                    ? this.handleConfirm(wallet, item)
                    : undefined
                  }
                />
              </div>
            </div>
          )
        }
      </div>
    )
  }

  render () {
    const { wallet } = this.props

    return (
      <div styleName='root' className='PendingTxWidget__root'>
        <div styleName='header'>
          <Translate value={`${prefix}.title`} />
        </div>
        <div styleName='body'>
          {!wallet
            ? <Preloader />
            : wallet.pendingTxList().size() > 0
              ? wallet.pendingTxList().items().map((item) => this.renderRow(wallet, item))
              : <Translate value={`${prefix}.noTransfers`} />
          }
        </div>
      </div>
    )
  }
}
