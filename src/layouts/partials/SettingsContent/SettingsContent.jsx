/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Paper } from '@material-ui/core'
import React, { Component } from 'react'
import Tokens from 'components/settings/Tokens'
import CBEAddresses from 'components/settings/CBEAddresses'
import './SettingsContent.scss'

export default class SettingsContent extends Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          <div styleName='column'>
            <Paper>
              <Tokens />
            </Paper>
          </div>
          <div styleName='column'>
            <Paper>
              <CBEAddresses />
            </Paper>
          </div>
        </div>
      </div>
    )
  }
}
