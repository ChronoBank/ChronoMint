import bs58 from 'bs58'
import truffleContract from 'truffle-contract'
import isEthAddress from '../utils/isEthAddress'
import web3Provider from '../network/Web3Provider'

/**
 * @type {number} to distinguish old and new blockchain events
 * @see AbstractContractDAO._watch
 */
const timestampStart = Date.now()

/**
 * Collection of all blockchain events to stop watching all of them via only one call of...
 * @see AbstractContractDAO.stopWatching
 * @type {Array}
 */
const events = []

class AbstractContractDAO {
  static _web3 = null

  constructor (json, at = null) {
    if (new.target === AbstractContractDAO) {
      throw new TypeError('Cannot construct AbstractContractDAO instance directly')
    }
    this._json = json
    this._at = at

    this._initWeb3()
    this.contract = this._initContract(json, at)
    this.contract.catch(e => { console.error(e); return false })
  }

  /**
   * @return {boolean|Promise}
   * @private
   */
  _initWeb3 () {
    web3Provider.onReset(this.handleWeb3Reset)
    return web3Provider.getWeb3().then((web3) => {
      AbstractContractDAO._web3 = web3
      this.web3 = web3
      return web3
    })
  }

  handleWeb3Reset = () => {
    this._initWeb3()
    this.contract = this._initContract(this._json, this._at)
  }

  /**
   * @param json
   * @param at
   * @private
   */
  _initContract (json, at) {
    return new Promise((resolve, reject) => {
      if (at !== null && !isEthAddress(at)) {
        reject(new Error('invalid address passed'))
      }
      web3Provider.getWeb3()
        .then((web3) => {
          const contract = truffleContract(json)
          contract.setProvider(web3.currentProvider)
          return contract[at === null ? 'deployed' : 'at'](at)
        })
        .then(i => resolve(i))
        .catch(e => reject(e))
    })
  }

  getAccounts () {
    return web3Provider.getWeb3instance().eth.accounts
  }

  getAddress () {
    return this.contract.then(deployed => deployed.address)
  };

  /**
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytesToString (bytes) {
    return web3Provider.getWeb3instance().toAscii(bytes).replace(/\u0000/g, '')
  };

  /**
   * @param bytes
   * @return {string}
   * @protected
   */
  _bytes32ToIPFSHash (bytes) {
    const string = Buffer.from(bytes.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(string)
  };

  /**
   * @param value
   * @return {string}
   * @protected
   */
  _IPFSHashToBytes32 (value) {
    return `0x${Buffer.from(bs58.decode(value)).toString('hex').substr(4)}`
  };

  /**
   * @param value
   * @return {string}
   * @protected
   */
  _toBytes32 (value) {
    let zeros = '000000000000000000000000000000000000000000000000000000000000000'
    if (typeof value === 'string') {
      return ('0x' + [].reduce.call(value, (hex, c) => {
        return hex + c.charCodeAt(0).toString(16)
      }, '') + zeros).substr(0, 66)
    }
    let hexNumber = value.toString(16)
    return '0x' + (zeros + hexNumber).substring(hexNumber.length - 1)
  }

  /**
   * @param address
   * @return {boolean}
   * @protected
   */
  _isEmptyAddress (address: string) {
    return address === '0x0000000000000000000000000000000000000000'
  };

  /**
   * This function will read events from the last block saved in window.localStorage or from the latest block in network
   * if localStorage for provided event is empty.
   * @param event
   * @param callback in the absence of error will receive event result object, block number, timestamp of event
   * in milliseconds and special isOld flag, which will be true if received event is older than timestampStart
   * @see timestampStart
   * @param id To able to save last read block, pass unique constant id to this param and don't change it if you
   * want to keep receiving of saved block number from user localStorage.
   * @protected
   */
  _watch (event, callback, id = Math.random()) {
    const key = 'fromBlock-' + id
    let fromBlock = window.localStorage.getItem(key)
    fromBlock = fromBlock ? parseInt(fromBlock, 10) : 'latest'
    const instance = event({}, {fromBlock, toBlock: 'latest'})
    instance.watch((error, result) => {
      if (!error) {
        web3Provider.getWeb3instance().eth.getBlock(result.blockNumber, (e, block) => {
          const ts = block.timestamp
          window.localStorage.setItem(key, result.blockNumber + 1)
          callback(
            result,
            result.blockNumber,
            ts * 1000,
            Math.floor(timestampStart / 1000) > ts
          )
        })
      }
    })
    events.push(instance)
  };

  static stopWatching () {
    for (let key in events) {
      if (events.hasOwnProperty(key)) {
        events[key].stopWatching()
      }
    }
    events.splice(0, events.length)
  }

  static getWatchedEvents () {
    return events
  }
}

export default AbstractContractDAO
