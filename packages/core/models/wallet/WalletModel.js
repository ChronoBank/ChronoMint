/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'
import Amount from '../Amount'
import TxHistoryModel from './TxHistoryModel'
import AllowanceCollection from '../AllowanceCollection'

const schemaFactory = () => ({
  address: PropTypes.string.isRequired,
  blockchain: PropTypes.string.isRequired,
  name: PropTypes.string,
  balances: PropTypes.object,
  transactions: PropTypes.instanceOf(TxHistoryModel),
  owners: PropTypes.arrayOf(PropTypes.string),
  requiredSignatures: PropTypes.string,
  pendingTxList: PropTypes.object,
  releaseTime: PropTypes.instanceOf(Date),
  customTokens: PropTypes.object,
  deriveNumber: PropTypes.number,
  is2FA: PropTypes.bool,
  isMultisig: PropTypes.bool,
  amount: PropTypes.instanceOf(Amount),
  isTimeLocked: PropTypes.bool,
  isTIMERequired: PropTypes.bool,
  allowances: PropTypes.instanceOf(AllowanceCollection),
})

export default class WalletModel extends AbstractModel {
  constructor (ownProps) {
    const defaultProps = {
      balances: {},
      transactions: new TxHistoryModel(),
      owners: [],
      pendingTxList: null,
      customTokens: null,
      isTIMERequired: false,
      allowances: new AllowanceCollection({}),
    }

    const props = { ...defaultProps, ...ownProps }
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get id () {
    return `${this.blockchain}-${this.address}`
  }
}
