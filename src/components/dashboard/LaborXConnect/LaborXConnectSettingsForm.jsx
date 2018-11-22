/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { Switch, TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import Amount from '@chronobank/core/models/Amount'
import AssetsCollection from '@chronobank/core/models/assetHolder/AssetsCollection'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { TIME } from '@chronobank/core/dao/constants'
import {
  TX_LOCK,
  TX_UNLOCK,
} from '@chronobank/core/dao/constants/AssetHolderDAO'
import {
  TX_DEPOSIT,
  TX_START_MINING_IN_CUSTOM_NODE,
} from '@chronobank/core/redux/laborHour/dao/TimeHolderDAO'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import { FORM_LABOR_X_CONNECT_SETTINGS } from 'components/constants'
import TokenValueSimple from 'components/common/TokenValueSimple/TokenValueSimple'
import Preloader from 'components/common/Preloader/Preloader'
import { CHRONOBANK_NODE_FEE_COEFFICIENT } from '@chronobank/core/redux/laborHour/constants'
import classnames from 'classnames'
import validate from './validate'
import { prefix } from './lang'
import LaborXConnectSlider from './LaborXConnectSlider/LaborXConnectSlider'
import './LaborXConnect.scss'

@reduxForm({ form: FORM_LABOR_X_CONNECT_SETTINGS, validate })
export default class LaborXConnectSettingsForm extends PureComponent {
  static propTypes = {
    feeLoading: PropTypes.bool,
    gasFee: PropTypes.instanceOf(Amount),
    onChangeField: PropTypes.func,
    deposit: PropTypes.instanceOf(Amount),
    balanceEth: PropTypes.instanceOf(Amount),
    token: PropTypes.instanceOf(TokenModel),
    assets: PropTypes.instanceOf(AssetsCollection),
    amount: PropTypes.number,
    lhtWallet: PropTypes.instanceOf(WalletModel),
    timeTokenLX: PropTypes.instanceOf(TokenModel),
    miningParams: PropTypes.shape({
      minDepositLimit: PropTypes.string,
      rewardsCoefficient: PropTypes.string,
      isCustomNode: PropTypes.bool,
    }),
    isCustomNode: PropTypes.bool,
    miningBalance: PropTypes.instanceOf(Amount),
    ...formPropTypes,
  }

  handleProceed = (values) => {
    const { miningBalance } = this.props

    const realValue = new BigNumber(values.get('amount')).minus(miningBalance)
    const isCustomNode = values.get('isCustomNode')
    let resultValues

    if (realValue.eq(0)) {
      // change node
      if (isCustomNode) {
        // use custom node
        resultValues = values.set('action', TX_START_MINING_IN_CUSTOM_NODE)
      } else {
        // use chronobank pull
        resultValues = values
          .set('action', TX_DEPOSIT)
          .set('token', this.props.timeTokenLX)
      }
    }

    if (realValue.gt(0)) {
      // increase deposit
      resultValues = values
        .set('amount', realValue)
        .set('action', TX_LOCK)
        .set('token', this.props.token)

    }

    if (realValue.lt(0)) {
      // withdraw tokens to mainnet
      resultValues = values
        .set('amount', realValue.abs())
        .set('action', TX_UNLOCK)
        .set('token', this.props.timeTokenLX)

    }

    this.props.onSubmit(resultValues)
  }

  renderHead () {
    return (
      <div styleName='head'>
        <div styleName='mainTitle'>
          <Translate value={`${prefix}.settingsForm.title`} />
        </div>
        <div styleName='headContent'>
          <Translate value={`${prefix}.settingsForm.message`} />
        </div>
      </div>
    )
  }

  renderBody () {
    const {
      deposit,
      token,
      miningParams,
      amount,
      isCustomNode,
      miningBalance,
    } = this.props
    const { rewardsCoefficient, minDepositLimit } = miningParams
    const amountBN = new BigNumber(amount)
    const max = miningBalance.plus(deposit)

    const rewardPerBlock = new Amount(
      amountBN.mul(rewardsCoefficient),
      'LHT',
    ).mul(isCustomNode ? 1 : CHRONOBANK_NODE_FEE_COEFFICIENT) // chronobank fee
    return (
      <div styleName='body'>
        <div styleName='fieldWrapper'>
          {deposit.gt(0) && token.decimals() > 0 ? (
            <Field
              component={LaborXConnectSlider}
              name='amount'
              toFixed={1}
              min={0}
              step={token.addDecimals(new BigNumber(1)).toNumber()}
              max={max.toNumber()}
              token={token}
            />
          ) : (
            <Preloader />
          )}
        </div>
        <div styleName={classnames('fieldWrapper', 'customNodeWrapper')}>
          <div styleName='title'>
            <Translate value={`${prefix}.settingsForm.customNode`} />(
            <Translate value={`${prefix}.settingsForm.minDeposit`} />{' '}
            <TokenValueSimple value={new Amount(minDepositLimit, TIME)} />)
          </div>
          <div styleName='switcher'>
            <Field
              styleName='customNodeSwitcher'
              component={Switch}
              name='isCustomNode'
              color='primary'
            />
          </div>
        </div>
        {isCustomNode && (
          <div styleName='delegateAddressWrapper'>
            <Field
              component={TextField}
              name='delegateAddress'
              type='text'
              label={<Translate value={`${prefix}.settingsForm.enterDelegateAddress`} />}
              fullWidth
            />
          </div>
        )}
        <div styleName={classnames('fieldWrapper', 'reward')}>
          <Translate value={`${prefix}.settingsForm.reward`} />
          <TokenValueSimple value={rewardPerBlock} withFraction />
          {' / '}
          <Translate value={`${prefix}.settingsForm.block`} />
        </div>
        <div styleName={classnames('fieldWrapper', 'nodes')}>
          <div>
            <Translate value={`${prefix}.nodes.winNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
          <div>
            <Translate value={`${prefix}.nodes.macNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
          <div>
            <Translate value={`${prefix}.nodes.linuxNode`} />
            :&nbsp;
            <span>
              <Translate value={`${prefix}.settingsForm.download`} />
            </span>
          </div>
        </div>
      </div>
    )
  }

  renderFooter () {
    const { pristine, invalid } = this.props
    return (
      <div styleName='footer'>
        <Button
          onClick={this.props.handleSubmit(this.handleProceed)}
          disabled={pristine || invalid}
        >
          <Translate value={`${prefix}.accept`} />
        </Button>
      </div>
    )
  }

  render () {
    return (
      <div styleName='root'>
        <form onSubmit={this.props.handleSubmit}>
          {this.renderHead()}
          {this.renderBody()}
          {this.renderFooter()}
        </form>
      </div>
    )
  }
}