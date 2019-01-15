/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3 from 'web3'
import EventEmitter from 'events'

export default class MetamaskPlugin extends EventEmitter {
  constructor () {
    super()
    if (window.web3 && window.web3.currentProvider) {
      this.web3 = new Web3(window.web3.currentProvider)
    }
  }

  get name () {
    return 'metamask'
  }

  get title () {
    return 'Metamask Plugin'
  }

  get isConnected () {
    return !!this.web3
  }

  async init () {
    if (window.web3 && window.web3.currentProvider) {
      if (!this.web3) {
        this.web3 = new Web3(window.web3.currentProvider)
      }
      const accounts = await this.web3.eth.getAccounts()
      if (accounts.length) {
        this.address = accounts[0]
        this.emit('connected')
        return {
          address: this.address,
        }
      }
    }
    return null
  }

  async getAddress () {
    if (!this.isConnected || !this.address) {
      await this.init()
    }

    return this.address
  }

  async getAddressInfoList () {
    if (!this.isConnected || !this.address) {
      await this.init()
    }

    const ethBalance = await this.web3.eth.getBalance(this.address)
    return [
      {
        address: this.address,
        ethBalance: this.web3.utils.fromWei(ethBalance),
        type: this.name,
      }]
  }

  async signTransaction ({ /*gas, gasPrice,*/ ...txData }) {
    const signed = await this.web3.eth.sendTransaction({
      ...txData,
    })

    return signed
  }

  async signData (data) {
    const signature = await this.web3.eth.personal.sign(data, this.address)

    return {
      signature,
    }
  }
}
