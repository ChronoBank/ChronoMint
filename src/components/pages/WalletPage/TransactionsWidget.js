import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableFooter,
  TableHeaderColumn,
  TableRowColumn,
  RaisedButton,
  CircularProgress
} from 'material-ui'
import { getTransactionsByAccount } from '../../../redux/wallet/actions'
import globalStyles from '../../../styles'
import LS from '../../../dao/LocalStorageDAO'
import { getScannerById } from '../../../network/networkSettings'

const styles = {
  columns: {
    id: {
      width: '15%'
    },
    hash: {
      width: '32%'
    },
    time: {
      width: '25%'
    },
    value: {
      width: '28%'
    }
  }
}

const mapStateToProps = (state) => ({
  transactions: state.get('wallet').transactions,
  toBlock: state.get('wallet').toBlock,
  isFetching: state.get('wallet').isFetching,
  selectedNetworkId: state.get('network').selectedNetworkId,
  selectedProviderId: state.get('network').selectedProviderId
})

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (toBlock = null) => dispatch(getTransactionsByAccount(LS.getAccount(), toBlock))
})

@connect(mapStateToProps, mapDispatchToProps)
class TransactionsWidget extends Component {
  componentWillMount () {
    this.props.getTransactions()
  }

  handleLoadMore = () => {
    this.props.getTransactions(this.props.toBlock)
  }

  getEtherscanUrl = () => {
    const { selectedNetworkId, selectedProviderId } = this.props
    const baseScannerUrl = getScannerById(selectedNetworkId, selectedProviderId)
    return baseScannerUrl ? `${baseScannerUrl}/tx/` : null
  }

  render () {
    const etherscanHref = this.getEtherscanUrl()

    return (
      <Paper style={globalStyles.paper} zDepth={1} rounded={false}>
        <h3 style={globalStyles.title}>Transactions</h3>
        <Divider style={{backgroundColor: globalStyles.title.color}} />
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.id}>Block</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.hash}>Hash</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.time}>Time</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.value}>Value</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.transactions.sortBy(x => x.blockNumber)
              .reverse()
              .valueSeq()
              .map(tx => (
                <TableRow key={tx.id()}>
                  <TableRowColumn style={styles.columns.id}>{tx.blockNumber}</TableRowColumn>
                  <TableRowColumn style={styles.columns.hash}>
                    { etherscanHref
                      ? <a href={etherscanHref + tx.txHash} target='_blank'>{tx.txHash}</a>
                      : tx.txHash
                    }
                  </TableRowColumn>
                  <TableRowColumn style={styles.columns.time}>{tx.time()}</TableRowColumn>
                  <TableRowColumn style={styles.columns.value}>
                    {tx.sign() + tx.value() + ' ' + tx.symbol}
                  </TableRowColumn>
                </TableRow>
              ))}
            {!this.props.transactions.size && !this.props.isFetching ? (<TableRow>
              <TableRowColumn>
                No transactions.
              </TableRowColumn>
            </TableRow>) : ''}
            {this.props.isFetching
              ? (<TableRow key='loader'>
                <TableRowColumn style={{width: '100%', textAlign: 'center'}} colSpan={4}>
                  <CircularProgress style={{margin: '0 auto'}} size={24} thickness={1.5} />
                </TableRowColumn>
              </TableRow>) : null}
          </TableBody>
          {!this.props.isFetching && this.props.toBlock > 0 ? <TableFooter adjustForCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <RaisedButton label={'Load More – From ' + this.props.toBlock + ' Block'}
                  onTouchTap={this.handleLoadMore} fullWidth primary />
              </TableRowColumn>
            </TableRow>
          </TableFooter> : ''}
        </Table>
      </Paper>
    )
  }
}

export default TransactionsWidget
