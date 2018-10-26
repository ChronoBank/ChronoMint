/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React from 'react'
import { connect } from 'react-redux'

import Form from './Form'
import FormContainer, { mapStateToProps, mapDispatchToProps } from '../BitcoinLikeBockchain/FormContainer'

const FormReduxContainer = connect(mapStateToProps, mapDispatchToProps)(FormContainer)

const BitcoinFormContainer = (props) => (
  <FormReduxContainer {...props} form={Form} />
)

export default BitcoinFormContainer
