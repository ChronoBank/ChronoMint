import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import PlatformsList from 'components/assets/PlatformsList/PlatformsList'

import { FlatButton, RaisedButton } from 'material-ui'

import './AssetManager.scss'
import { PlatformInfo } from '../PlatformInfo/PlatformInfo'

function prefix (token) {
  return 'Assets.AssetManager.' + token
}

export class AssetManager extends Component {

  static propTypes = {}

  render () {
    return (
      <div styleName='root'>
        <div styleName='content'>
          {this.renderHead()}
          {/*{this.renderBody()}*/}
        </div>
      </div>
    )
  }

  renderHead () {
    return (
      <div styleName='head'>
        <h3><Translate value={prefix('title')} /></h3>
        <div styleName='headInner'>
          <div className='AssetManagerContent__head'>
            <div className='row'>
              <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                <div styleName='contentStats'>
                  <div styleName='contentStatsItem statsAll'>
                    <div styleName='icon'>
                      <i className='material-icons'>poll</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myPlatforms')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsCompleted'>
                    <div styleName='icon'>
                      <i className='material-icons'>check</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('myTokens')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                  <div styleName='contentStatsItem statsOutdated'>
                    <div styleName='icon'>
                      <i className='material-icons'>event_busy</i>
                    </div>
                    <div styleName='entry'>
                      <span styleName='entry1'><Translate value={prefix('managers')} />:</span><br />
                      <span styleName='entry2'>1</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                <div styleName='contentAlignRight'>
                  <div styleName='entries'>
                  </div>
                  <div>
                    <RaisedButton
                      label={<Translate value={prefix('addToken')} />}
                      styleName='action'
                      primary
                    />
                    <RaisedButton
                      label={<Translate value={prefix('addNewPlatforms')} />}
                      styleName='action'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='body'>
        <div styleName='bodyInner'>
          <div className='AssetManagerContent__body'>
            <div className='col-xs-2 col-sm-1'>
              <PlatformsList />
            </div>
            <div className='col-xs-2 col-sm-1'>
              <PlatformInfo />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (/*state*/) {
  return {}
}

function mapDispatchToProps (/*dispatch*/) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetManager)
