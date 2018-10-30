/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TIME } from '@chronobank/core/dao/constants'
import { initAssetsHolder } from '@chronobank/core/redux/assetsHolder/actions'
import { getDeposit } from '@chronobank/core/redux/assetsHolder/selectors'
import Amount from '@chronobank/core/models/Amount'
import Button from 'components/common/ui/Button/Button'
import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import LaborXConnectWidget from 'components/Deposits/LaborXConnectWidget/LaborXConnectWidget'
import './MiningContent.scss'

function mapStateToProps (state) {
  return {
    deposit: getDeposit(TIME)(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initAssetsHolder: () => dispatch(initAssetsHolder()),
    addDeposit: (props) => dispatch(modalsOpen({
      componentName: 'DepositTokensModal',
      props,
    })),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MiningContent extends Component {
  static propTypes = {
    deposit: PropTypes.instanceOf(Amount),
    initAssetsHolder: PropTypes.func,
    addDeposit: PropTypes.func,
  }

  componentDidMount () {
    this.props.initAssetsHolder()
  }

  handleAddDeposit = () => {
    this.props.addDeposit()
  }

  handleWithdrawDeposit = () => {
    this.props.addDeposit({ isWithdraw: true })
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <LaborXConnectWidget />
          </div>
          <Button styleName='addDeposit' onClick={this.handleAddDeposit}>
            <i className='chronobank-icon'>add</i>
          </Button>
        </div>
      </div>
    )
  }
}
