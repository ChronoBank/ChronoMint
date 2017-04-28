import { Record as record } from 'immutable'
import moment from 'moment'
import { weiToEther } from '../utils/converter'

class TransactionModel extends record({
  txHash: null,
  nonce: null,
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  from: null,
  to: null,
  value: null,
  time: null,
  gasPrice: null,
  gas: null,
  input: null,
  credited: null,
  symbol: ''
}) {
  id () {
    return this.txHash + ' - ' + this.from + ' - ' + this.to
  }

  time () {
    return moment.unix(this.get('time')).format('Do MMMM YYYY HH:mm:ss')
  }

  // noinspection JSUnusedGlobalSymbols
  value () {
    if (this.symbol === 'ETH') {
      return weiToEther(this.get('value'))
    } else {
      return this.get('value') / 100000000
    }
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.credited ? '+' : '-'
  }
}

export default TransactionModel
