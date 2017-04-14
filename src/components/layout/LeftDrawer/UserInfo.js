import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Avatar, CircularProgress } from 'material-ui'
import PersonIcon from 'material-ui/svg-icons/social/person'
import { white, darkWhite } from 'material-ui/styles/colors'

const style = {
  div: {
    padding: '24px 24px 8px 24px',
    backgroundImage: 'url(' + require('../../../assets/drawer_bg.svg') + ')',
    backgroundColor: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.5) 0 0 10px inset',
    height: 112,
    cursor: 'pointer'
  },
  icon: {
    display: 'block'
  },
  username: {
    marginTop: 8,
    display: 'block',
    fontWeight: 500,
    fontSize: 14,
    color: white,
    lineHeight: '20px'
  },
  email: {
    display: 'block',
    fontWeight: 400,
    fontSize: 14,
    color: darkWhite,
    lineHeight: '20px'
  }
}

const mapStateToProps = (state) => ({
  user: state.get('session'),
  isFetching: state.get('session').profileFetching
})

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => dispatch(push('/profile'))
})

@connect(mapStateToProps, mapDispatchToProps)
class UserInfo extends Component {
  render () {
    const profile = this.props.user.profile
    return (
      <div style={style.div} onClick={this.props.handleClick}>
        <Avatar size={56} icon={<PersonIcon />} />
        {this.props.isFetching
          ? <CircularProgress size={24} thickness={1.5} color={'fff'} style={{marginLeft: '20px'}} /> : ''}
        <span style={style.username}>{!profile.isEmpty() ? profile.name() : this.props.user.account}</span>
        <span style={style.email}>{profile.email() }</span>
      </div>
    )
  }
}

export default UserInfo
