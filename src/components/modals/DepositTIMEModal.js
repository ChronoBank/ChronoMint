import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, FlatButton, RaisedButton } from 'material-ui'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import globalStyles from '../../styles'
import DepositTIMEForm from '../forms/DepositTIMEForm'
import { depositTIME, withdrawTIME, updateTIMEBalance, updateTIMEDeposit } from '../../redux/wallet/actions'

const mapStateToProps = (state) => ({
  account: state.get('session').account,
  time: state.get('wallet').time,
  isFetching: state.get('wallet').time.isFetching
})

const mapDispatchToProps = (dispatch) => ({
  depositTime: (amount, account) => dispatch(depositTIME(amount, account)),
  withdrawTime: (amount, account) => dispatch(withdrawTIME(amount, account)),
  updateBalance: (account) => dispatch(updateTIMEBalance(account)),
  updateDeposit: (account) => dispatch(updateTIMEDeposit(account))
})

@connect(mapStateToProps, mapDispatchToProps)
class DepositTIMEModal extends Component {
  componentWillMount () {
    this.props.updateBalance(this.props.account)
    this.props.updateDeposit(this.props.account)
  }

  callback = () => {
  }

  handleSubmit = (values) => {
    const jsValues = values.toJS()
    return this.callback(jsValues.amount, this.props.account)
  }

  handleDeposit = () => {
    this.callback = this.props.depositTime
    this.refs.DepositTIMEForm.getWrappedInstance().submit()
  }

  handleWithdraw = () => {
    this.callback = this.props.withdrawTime
    this.refs.DepositTIMEForm.getWrappedInstance().submit()
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open} = this.props
    const actions = [
      <FlatButton
        label='Cancel'
        style={{marginRight: 22}}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label='WITHDRAW TOKENS'
        style={{marginRight: 22}}
        primary
        onTouchTap={this.handleWithdraw}
        disabled={!!this.props.isFetching}
      />,
      <RaisedButton
        label='LOCK TOKENS'
        primary
        onTouchTap={this.handleDeposit}
        disabled={!!this.props.isFetching}
      />
    ]

    return (
      <Dialog
        actionsContainerStyle={{padding: 26}}
        title={
          <div>
            Deposit or Withdraw TIME Tokens
            <IconButton style={{float: 'right', margin: '-12px -12px 0px'}} onTouchTap={this.handleClose}>
              <NavigationClose />
            </IconButton>
          </div>
        }
        actions={actions}
        modal={false}
        iconElementRight={<IconButton><NavigationClose /></IconButton>}
        open={open}
        contentStyle={{position: 'relative'}}
      >
        <div style={globalStyles.modalGreyText}>
          TIME tokens could be purchased on exchanges, such as CatsRule or DogsAreAwesome
          <p><b>Balance: {this.props.time.balance}</b></p>
          <p><b>Deposit: {this.props.time.deposit}</b></p>
        </div>
        <DepositTIMEForm ref='DepositTIMEForm' onSubmit={this.handleSubmit} state={this.state}/>
      </Dialog>
    )
  }
}

export default DepositTIMEModal
