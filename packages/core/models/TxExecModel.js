/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import uuid from 'uuid/v1'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  contract: PropTypes.string,
  func: PropTypes.string,
  blockchain: PropTypes.string,
  symbol: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
  hash: PropTypes.string,
  data: PropTypes.string,
})

export default class TxExecModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    this._id = props._id || uuid()
    this.time = new Date().getTime()
    Object.assign(this, props)
    Object.freeze(this)
  }

  id () {
    return this._id
  }

  get args () {
    return Object.values(this.fields).map((field) => field.value)
  }

  get langPrefix () {
    return this.i18nFunc()
  }

  /**
   * @returns {string}
   * @private
   */
  funcName () {
    return this.func
  }

  _i18n () {
    return `tx.${this.contract}.`
  }

  i18nFunc () {
    return `${this._i18n() + this.func}.`
  }

  funcTitle () {
    return `${this.i18nFunc()}title`
  }

  title () {
    return this.func
  }

  details () {
    const details = []
    Object.entries(this.fields).forEach(([, field]) => {
      details.push({
        label: `${this.i18nFunc()}${field.description}`,
        value: field.value,
      })
    })
    return details
  }
}
