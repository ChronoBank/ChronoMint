/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'

export default class AbstractModel {
  constructor (props, schema) {
    PropTypes.checkPropTypes()
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }

  transform () {
    return { ...this }
  }

  mutate (values: Object) {
    return new this.constructor({ ...this, ...values })
  }
}
