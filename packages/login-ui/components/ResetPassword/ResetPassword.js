/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import {
  AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  getAccountName,
  getAccountAddress,
  getAccountAvatar,
} from '@chronobank/core/redux/persistAccount/utils'
import { reduxForm, Field, formPropTypes } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import Button from 'components/common/ui/Button/Button'
import styles from 'layouts/Splash/styles'
import UserRow from '../UserRow/UserRow'
import {
  FORM_RESET_PASSWORD,
} from '../../redux/constants'
import validate from './validate'
import './ResetPassword.scss'

class ResetPassword extends PureComponent {
  static propTypes = {
    selectedWallet: PropTypes.instanceOf(AccountEntryModel),
    submitting: PropTypes.bool,
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, selectedWallet, submitting } = this.props

    return (
      <form styleName='form' name={FORM_RESET_PASSWORD} onSubmit={handleSubmit}>

        <div styleName='page-title'>
          <Translate value='ResetPassword.title' />
        </div>

        <div styleName='user-row'>
          <UserRow
            title={getAccountName(selectedWallet)}
            avatar={getAccountAvatar(selectedWallet)}
            subtitle={getAccountAddress(selectedWallet, true)}
          />
        </div>

        <div styleName='field'>
          <Field
            component={TextField}
            name='password'
            type='password'
            label={<Translate value='ResetPassword.password' />}
            fullWidth
            {...styles.textField}
          />
          <Field
            component={TextField}
            name='confirmPassword'
            type='password'
            label={<Translate value='ResetPassword.confirmPassword' />}
            fullWidth
            {...styles.textField}
          />
        </div>

        <div styleName='actions'>
          <Button
            styleName='button'
            buttonType='login'
            type='submit'
            isLoading={submitting}
          >
            <Translate value='ResetPassword.reset' />
          </Button>
        </div>

      </form>
    )
  }
}

export default reduxForm({ form: FORM_RESET_PASSWORD, validate })(ResetPassword)
