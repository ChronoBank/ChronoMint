import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { Field, reduxForm } from 'redux-form/immutable'
import { CSSTransitionGroup } from 'react-transition-group'
import { TextField } from 'redux-form-material-ui'
import { FlatButton, RaisedButton } from 'material-ui'

import ModalDialog from 'components/dialogs/ModalDialog'
import validator from 'components/forms/validator'

import { validate } from 'models/CBEModel'
import { formCBELoadName, addCBE } from 'redux/settings/user/cbe/actions'
import { modalsClose } from 'redux/modals/actions'

import './FormDialog.scss'

export const FORM_CBE_ADDRESS = 'CBEAddressDialog'

function prefix(token) {
  return `components.dialogs.CBEAddressDialog.${token}`
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_CBE_ADDRESS, validate })
export default class CBEAddressDialog extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleAddressChange: PropTypes.func,
    // You need both handleSubmit and onSubmit
    name: PropTypes.string,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    isLoading: PropTypes.bool,
    pristine: PropTypes.bool,
    invalid: PropTypes.bool,
  }

  render() {
    const {
      isLoading,
      onClose,
      handleSubmit,
      handleAddressChange,
      initialValues,
      pristine,
      invalid,
    } = this.props

    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionAppear
        transitionAppearTimeout={250}
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <ModalDialog
          onClose={() => onClose()}
        >
          <form styleName='root' onSubmit={handleSubmit}>
            <div styleName='header'>
              <h3 styleName='title'><Translate value={prefix('addCbeAddress')} /></h3>
            </div>
            <div styleName='content'>
              <Field
                component={TextField}
                fullWidth
                name='address'
                floatingLabelText={<Translate value='common.ethAddress' />}
                onChange={(e, newValue) => handleAddressChange(e, newValue)}
                disabled={initialValues.address() !== null}
              />
              <Field
                component={TextField}
                fullWidth
                name='name'
                style={{ width: '100%' }}
                floatingLabelText={<Translate value='common.name' />}
                disabled={isLoading}
              />
            </div>
            <div styleName='footer'>
              <FlatButton
                styleName='action'
                label={<Translate value={prefix('cancel')} />}
                onTouchTap={() => onClose()}
              />
              <RaisedButton
                styleName='action'
                label={<Translate value={prefix('addAddress')} />}
                primary
                disabled={isLoading || pristine || invalid}
                type='submit'
              />
            </div>
          </form>
        </ModalDialog>
      </CSSTransitionGroup>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleAddressChange: (e, newValue) => validator.address(newValue) === null ? dispatch(formCBELoadName(newValue)) : false,
    onClose: () => dispatch(modalsClose()),
    onSubmit: values => {
      dispatch(modalsClose())
      dispatch(addCBE(values))
    },
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.get('settingsUserCBE').isLoading,
  }
}
