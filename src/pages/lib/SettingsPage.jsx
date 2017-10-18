import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Partials from 'layouts/partials'

import './SettingsPage.scss'

export default class SettingsPage extends Component {
  render() {
    return (
      <div styleName='root'>
        <Partials.BrandPartial />
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <Partials.SettingsContent />
        </CSSTransitionGroup>
        { !window.isMobile && <Partials.FooterPartial /> }
      </div>
    )
  }
}
