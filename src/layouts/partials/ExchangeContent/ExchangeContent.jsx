import { ExchangesTable, ExchangeWidget } from 'components'
import { Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './ExchangeContent.scss'

export default class ExchangeContent extends Component {
  static propTypes = {
    getExchange: PropTypes.func,
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='inner'>
            <div className='ExchangeContent__grid'>
              <div className='row'>
                <div className='col-xs-6'>
                  <div styleName='exchangeBox'>
                    <Paper>
                      <ExchangeWidget />
                      <ExchangesTable />
                    </Paper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
