import Web3Utils from 'Login/network/Web3Utils'

export default class EthereumEngine {
  constructor (wallet, network, url) {
    this._wallet = wallet
    this._network = network
    this._engine = Web3Utils.createEngine(wallet, url)
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddressString()
  }

  getProvider () {
    return this._engine
  }
}
