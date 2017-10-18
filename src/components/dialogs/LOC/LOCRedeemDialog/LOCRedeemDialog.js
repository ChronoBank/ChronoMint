import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LOCRedeemForm from './LOCRedeemForm'
import { revokeAsset } from 'redux/locs/actions'
import { Translate } from 'react-redux-i18n'
import LOCModel from 'models/LOCModel'
import TokenValue from 'components/common/TokenValue/TokenValue'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import { modalsClose } from 'redux/modals/actions'
import './LOCRedeemDialog.scss'

const mapDispatchToProps = dispatch => ({
  revokeAsset: (amount: number, loc: LOCModel) => dispatch(revokeAsset(amount, loc)),
  closeModal: () => dispatch(modalsClose()),
})

@connect(null, mapDispatchToProps)
class LOCRedeemModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    loc: PropTypes.object,
    revokeAsset: PropTypes.func,
  }

  handleSubmitSuccess = (amount: number) => {
    this.props.closeModal()
    this.props.revokeAsset(amount, this.props.loc)
  }

  render() {
    const { loc } = this.props
    return (
      <ModalDialogBase
        title={{ value: 'locs.redeemS', asset: loc.currency() }}
        subTitle={(
          <div styleName='balances'>
            <div styleName='label'><Translate value='locs.issueLimit' />:</div>
            <TokenValue
              value={loc.issueLimit()}
              symbol={loc.currency()}
              isInvert
            />
            <div styleName='label'><Translate value='locs.issued' />:</div>
            <TokenValue
              value={loc.issued()}
              symbol={loc.currency()}
              isInvert
            />
          </div>
        )}
      >
        <LOCRedeemForm
          loc={loc}
          onSubmitSuccess={this.handleSubmitSuccess}
        />
      </ModalDialogBase>
    )
  }
}

export default LOCRedeemModal
