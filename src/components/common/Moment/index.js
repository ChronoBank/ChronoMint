import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

export const FULL_DATE = 'HH:mm, MMMM Do, YYYY'
export const SHORT_DATE = 'MMM Do, YYYY'

const mapStateToProps = (state) => {
  return {
    locale: state.get('i18n').locale,
  }
}

@connect(mapStateToProps)
class Moment extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    format: PropTypes.string,
    action: PropTypes.func
  }

  render () {
    const {locale, date, format, action} = this.props
    let view
    if (action) {
      view = moment(date).locale(locale)[action]()
    } else {
      view = moment(date).locale(locale).format(format)
    }

    return <span>{view}</span>
  }
}

export default Moment
