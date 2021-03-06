/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'

import { AbstractEthereumDAO } from './AbstactEthereumDAO'
import { BLOCKCHAIN_ETHEREUM, ETH } from './constants'

export class EthereumDAO extends AbstractEthereumDAO {
  constructor () {
    super(ETH, BLOCKCHAIN_ETHEREUM, ethereumProvider, ...arguments)
  }
}

export default new EthereumDAO()
