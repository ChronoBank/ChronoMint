import { Link } from 'react-router'
import React from 'react'
import { Translate } from 'react-redux-i18n'

import './NotFound.scss'

class NotFoundPage extends React.Component {
  render() {
    return (
      <div styleName='root'>
        <div styleName='title'>404</div>
        <div styleName='subtitle'><Translate value='nav.pageNotFound' /></div>
        <Link styleName='link' to='/'><Translate value='backToMain' /></Link>
      </div>
    )
  }
}

export default NotFoundPage
