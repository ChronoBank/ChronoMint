import { Paper, CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { SendTokens, DepositTokens, Rewards, Voting } from 'components'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import styles from 'layouts/partials/styles'

import { getRewardsData, watchInitRewards } from 'redux/rewards/rewards'

import './DashboardContent.scss'

function prefix(token) {
  return `layouts.partials.DashboardContent.${token}`
}

export class DashboardContent extends Component {
  static propTypes = {
    ready: PropTypes.bool,
    rewardsData: PropTypes.object,
    isRewardsFetched: PropTypes.bool,
    isVotingFetched: PropTypes.bool,
    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
  }

  componentWillMount() {
    if (!this.props.isRewardsFetched) {
      this.props.watchInitRewards()
      this.props.getRewardsData()
    }
  }

  render() {
    return !this.props.ready
      ? (
        <div styleName='progress'>
          <CircularProgress size={24} thickness={1.5} />
        </div>
      )
      : (
        <div styleName='root'>
          <div styleName='content'>
            <div styleName='inner'>
              <div className='DashboardContent__grid'>
                <div className='row'>
                  <div className='col-md-3 col-lg-2' styleName='headLight'>
                    <Paper style={styles.content.paper.style}>
                      <SendTokens title={<Translate value={prefix('sendTokens')} />} />
                    </Paper>
                  </div>
                  <div className='col-md-3 col-lg-2' styleName='headDark'>
                    <Paper style={styles.content.paper.style}>
                      <DepositTokens title={<Translate value={prefix('depositTime')} />} />
                    </Paper>
                  </div>
                </div>
                {!this.props.isVotingFetched
                  ? null
                  : (
                    <div className='row'>
                      <div className='col-xs-6'>
                        <Paper style={styles.content.paper.style}>
                          <Voting />
                        </Paper>
                      </div>
                    </div>
                  )
                }
                {!this.props.isRewardsFetched
                  ? null
                  : (
                    <div className='row'>
                      {this.props.rewardsData.periods().valueSeq().map(item => (
                        <div className='col-xs-6' key={item.index()}>
                          <Paper style={styles.content.paper.style}>
                            <Rewards period={item} rewardsData={this.props.rewardsData} />
                          </Paper>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      )
  }
}

function mapStateToProps(state) {
  const wallet = state.get('wallet')
  const rewards = state.get('rewards')
  const voting = state.get('voting')

  return {
    ready: !wallet.tokensFetching,
    rewardsData: rewards.data,
    isRewardsFetched: rewards.isFetched,
    isVotingFetched: voting.isFetched && wallet.tokensFetched,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    watchInitRewards: () => dispatch(watchInitRewards()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent)
