/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import PollInterfaceDAO from './PollInterfaceDAO'
import { PollInterfaceABI } from './abi'

export default class PollInterfaceManagerDAO extends EventEmitter {
  constructor ({ web3, history }) {
    super()
    this.history = history
    this.web3 = web3
  }

  async getPollInterfaceDAO (address: string) {
    const pollInterfaceDao = new PollInterfaceDAO({ abi: PollInterfaceABI, address, history: this.history })
    pollInterfaceDao.connect(this.web3)
    return pollInterfaceDao
  }
}
