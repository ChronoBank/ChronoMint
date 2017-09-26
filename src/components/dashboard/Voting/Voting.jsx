import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initTIMEDeposit } from 'redux/wallet/actions'
import { listPolls } from 'redux/voting/actions'
import { modalsOpen } from 'redux/modals/actions'
import DoughnutChart from 'components/common/DoughnutChart/DoughnutChart'
import { Translate } from 'react-redux-i18n'
import PollDetailsDialog from 'components/dialogs/PollDetailsDialog'
import { Paper, CircularProgress } from 'material-ui'
import styles from 'layouts/partials/styles'
import { Link } from 'react-router'
import { RaisedButton } from 'material-ui'
import SplitSection from 'components/dashboard/SplitSection/SplitSection'
import './Voting.scss'
import Moment from 'components/common/Moment'

function prefix (token) {
  return 'Dashboard.Voting.' + token
}

class Voting extends React.Component {
  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    list: PropTypes.object,
    handlePollDetails: PropTypes.func,
    timeDeposit: PropTypes.object,
    initTIMEDeposit: PropTypes.func,
    getList: PropTypes.func,
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.initTIMEDeposit()

    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    const {list, handlePollDetails} = this.props

    const polls = this.props.isFetched
      ? list.reverse().toArray().filter((item) => {
        return item.poll().active()
      })
      : []

    return (
      <div styleName='root'>
        <SplitSection
          title='Voting'
          head={(
            <div styleName='title'>
              <h3><Translate value={prefix('votingOngoing')}/></h3>
            </div>
          )}
          foot={(
            <div styleName='buttons'>
              <RaisedButton
                containerElement={
                  <Link activeClassName={'active'} to={{pathname: '/voting'}}/>
                }
                label={<Translate value={prefix('allPolls')}/>}
                primary
              />
            </div>
          )}
        >
          <div styleName='content'>
            {
              !this.props.isFetched
                ? (
                  <div styleName='progress'>
                    <CircularProgress size={24} thickness={1.5}/>
                  </div>
                )
                : null
            }
            {
              polls.map((item) => {
                const details = item.details()
                const poll = item.poll()

                return <div styleName='votingWrapper' key={item.poll().id()}>
                  <Paper style={styles.content.paper.style}>
                    <div styleName='votingInner'>
                      <div styleName='pollTitle'>{poll.title()}</div>
                      <div styleName='layer'>
                        <div styleName='entryTotal'>
                          <div styleName='label'><Translate value={prefix('finished')}/>:</div>
                          <div styleName='percent'>{details.percents.toString()}%</div>
                        </div>
                        <div styleName='chart chart1'>
                          <DoughnutChart key={details} weight={0.20} items={[
                            {value: details.shareholdersCount.toNumber() || 1, fillFrom: '#fbda61', fillTo: '#f98019'},
                            {value: 0.0001, fill: 'transparent'}
                          ]}/>
                        </div>
                        <div styleName='chart chart2'>
                          <DoughnutChart key={details} weight={0.20} items={[
                            {value: details.votedCount.toNumber(), fillFrom: '#311b92', fillTo: '#d500f9'},
                            {
                              value: (details.shareholdersCount.minus(details.votedCount)).toNumber(),
                              fill: 'transparent'
                            }
                          ]}/>
                        </div>
                      </div>

                      <div styleName='layer layerEntries'>
                        <div styleName='entry'>
                          <div><Translate value={prefix('published')}/>:&nbsp;</div>
                          <div><b>{
                            details.published && <Moment date={details.published} action='fromNow'/>
                          }</b></div>
                        </div>
                        <div styleName='entry'>
                          <div><Translate value={prefix('process')}/>:&nbsp;</div>
                          <div><b>{
                            details.endDate && <Moment date={details.endDate} action='fromNow'/>
                          }</b></div>
                        </div>
                      </div>
                      <div styleName='more' onClick={() => handlePollDetails(item)}>
                        <Translate value={prefix('moreInfo')}/>
                      </div>

                    </div>
                  </Paper>
                </div>
              })
            }
          </div>
        </SplitSection>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const voting = state.get('voting')
  const wallet = state.get('wallet')

  return {
    list: voting.list,
    timeDeposit: wallet.timeDeposit,
    isFetched: voting.isFetched && wallet.tokensFetched,
    isFetching: voting.isFetching && !voting.isFetched
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getList: () => dispatch(listPolls()),
    initTIMEDeposit: () => dispatch(initTIMEDeposit()),
    handlePollDetails: (model) => dispatch(modalsOpen({
      component: PollDetailsDialog,
      props: {model}
    })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Voting)
