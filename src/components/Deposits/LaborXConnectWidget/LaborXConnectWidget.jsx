/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import Button from 'components/common/ui/Button/Button'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { ETH, TIME } from '@chronobank/core/dao/constants'
import { getDeposit } from '@chronobank/core/redux/assetsHolder/selectors'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { getMainEthWallet } from '@chronobank/core/redux/wallets/selectors/models'
import { integerWithDelimiter } from '@chronobank/core/utils/formatter'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import PropTypes from 'prop-types'
import LABOR_X_LOGO_SVG from 'assets/img/laborx-icon.svg'
import './LaborXConnectWidget.scss'
import { prefix } from './lang'

function mapStateToProps (state) {
  const wallet = getMainEthWallet(state)
  return {
    deposit: getDeposit(TIME)(state),
    wallet,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onOpenReceiveForm: (wallet) => dispatch(modalsOpen({
      componentName: 'ReceiveTokenModal',
      props: {
        wallet,
        tokenId: ETH,
      },
    })),
    handleOpenDepositForm: () => dispatch(modalsOpen({ componentName: 'DepositTokensModal' })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LaborXConnectWidget extends PureComponent {
  static propTypes = {
    onOpenReceiveForm: PropTypes.func,
    handleOpenDepositForm: PropTypes.func,
    handleOpenLockForm: PropTypes.func,
    handleOpenUnlockForm: PropTypes.func,
    wallet: PropTypes.instanceOf(WalletModel),
  }

  handleOpenReceiveForm = () => {
    this.props.onOpenReceiveForm(this.props.wallet)
  }

  handleOpenSettings = () => {

  }

  render () {
    return (
      <div styleName='header-container'>
        <div styleName='wallet-list-container'>
          <div styleName='wallet-container'>
            <div styleName='settingsIcon'>
              <button className='chronobank-icon' onClick={this.handleOpenSettings}>settings</button>
            </div>
            <div styleName='token-container'>
              <div styleName='token-icon'>
                <IPFSImage styleName='imageIcon' fallback={LABOR_X_LOGO_SVG} />
              </div>
            </div>
            <div styleName='content-container'>
              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='text'><Translate value={`${prefix}.message`} /></div>
              <div styleName='text'><Translate value={`${prefix}.messageSubTitle`} /></div>

              <div styleName='title'><Translate value={`${prefix}.title`} /></div>
              <div styleName='text'><Translate value={`${prefix}.message2`} /></div>

              <div styleName='title addressTittle'><Translate value={`${prefix}.title`} /></div>
              <div styleName='address'>{this.props.wallet.address}</div>

              <div styleName='balance'>{TIME}&nbsp;{integerWithDelimiter('10.00', true)}</div>

              <div styleName='infoList'>
                <div styleName='infoItem'>
                  <div styleName='icon'>
                    <div className='chronobank-icon' styleName='active'>check-circle</div>
                  </div>
                  <div styleName='title'>Mining is ON (ChronoBank)</div>
                </div>
                <div styleName='infoItem'>
                  <div styleName='title'>Reward: LHT 0.02 / block</div>
                </div>
                <div styleName='infoItem'>
                  <div styleName='title'>Total rewards: LHT 0.04</div>
                </div>
              </div>
              <div styleName='actions-container'>
                <div styleName='action'>
                  <Button
                    type='submit'
                    label={<Translate value={`${prefix}.getStarted`} />}
                    onClick={this.handleOpenReceiveForm}
                  />
                  <Button
                    disabled={false}
                    type='submit'
                    label={<Translate value={`${prefix}.continue`} />}
                    onClick={this.props.handleOpenDepositForm}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
