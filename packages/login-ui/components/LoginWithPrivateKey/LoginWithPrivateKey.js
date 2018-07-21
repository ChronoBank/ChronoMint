/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm, Field } from 'redux-form/immutable'
import { Translate } from 'react-redux-i18n'
import { TextField } from 'redux-form-material-ui'
import styles from 'layouts/Splash/styles'
import Button from 'components/common/ui/Button/Button'
import {
  onSubmitPrivateKeyLoginForm,
  onSubmitPrivateKeyLoginFormSuccess,
  onSubmitPrivateKeyLoginFormFail,
  FORM_PRIVATE_KEY_LOGIN_PAGE,
} from '@chronobank/login/redux/network/actions'

import validate from './validate'
import './LoginWithPrivateKey.scss'

const multiRowTextFieldStyle = {
  textareaStyle: {
    background: 'transparent',
    borderRadius: 3,
    color: '#FFB54E',
    padding: 8,
    fontWeight: 700,
    minHeight: 62,
    margin: 0,
  },
  underlineFocusStyle:{
    border: 'none',
  },
  underlineStyle: {
    border: 'none',
  },
  hintStyle: {
    margin: 'auto',
    textAlign: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#A3A3CC',
  },
  inputStyle: {
    height: 'auto',
  },
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: async (values) => {
      const privateKey = values.get('pk')
      await dispatch(onSubmitPrivateKeyLoginForm(privateKey))
    },
    onSubmitSuccess: () => dispatch(onSubmitPrivateKeyLoginFormSuccess()),
    onSubmitFail: (errors, dispatch, submitErrors) => dispatch(onSubmitPrivateKeyLoginFormFail(errors, dispatch, submitErrors)),
  }
}

class MnemonicLoginPage extends PureComponent {
  render () {
    const { handleSubmit, error } = this.props

    return (
      <MuiThemeProvider>
        <form styleName='form' name={FORM_PRIVATE_KEY_LOGIN_PAGE} onSubmit={handleSubmit}>

          <div styleName='page-title'>
            <Translate value='LoginWithPrivateKey.title' />
          </div>

          <div styleName='field'>
            <Field
              styleName='pkField'
              component={TextField}
              name='pk'
              type='text'
              fullWidth
              multiLine
              rows={2}
              rowsMax={2}
              {...styles.textField}
              {...multiRowTextFieldStyle}
            />
          </div>

          <div styleName='actions'>
            <Button
              styleName='button'
              buttonType='login'
              type='submit'
            >
              <Translate value='LoginWithPrivateKey.submit' />
            </Button>

            { error ? (<div styleName='form-error'>{error}</div>) : null }

            <Translate value='LoginWithPrivateKey.or' />
            <br />
            <Link to='/login/import-methods' href styleName='link'>
              <Translate value='LoginWithPrivateKey.back' />
            </Link>
          </div>

        </form>
      </MuiThemeProvider>
    )
  }
}

const form = reduxForm({ form: FORM_PRIVATE_KEY_LOGIN_PAGE, validate })(MnemonicLoginPage)
export default connect(null, mapDispatchToProps)(form)
