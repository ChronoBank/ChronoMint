/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import nemSdk from 'nem-sdk'
import * as WavesApi from '@waves/waves-api'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '@chronobank/login/network/constants';
import { getAddressByPrivateKey } from '@chronobank/core/services/signers/dash/utils';

import { byEthereumNetwork } from './NetworkProvider'
import {
  createBCCEngine,
  createBTCEngine,
  createBTGEngine,
  createDASHEngine,
  createLTCEngine
} from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import { createNEMEngine } from './NemUtils'
import { createWAVESEngine } from './WavesUtils'
import NemWallet from './NemWallet'
import WavesWallet from './WavesWallet'

import {
  COIN_TYPE_BTC_MAINNET,
  COIN_TYPE_BTC_TESTNET,
  COIN_TYPE_BTG_MAINNET,
  COIN_TYPE_BTG_TESTNET,
  COIN_TYPE_LTC_MAINNET,
  COIN_TYPE_LTC_TESTNET,
} from './constants'
import EthereumWallet from './EthereumWallet'

class PrivateKeyProvider {
  // eslint-disable-next-line complexity
  getPrivateKeyProvider (privateKey, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(privateKey)
    const engine = new EthereumEngine(ethereumWallet, network, url)
    const btc = network && network[BLOCKCHAIN_BITCOIN] && this.createBitcoinWallet(privateKey, bitcoin.networks[network[BLOCKCHAIN_BITCOIN]] )
    const bcc = network && network[BLOCKCHAIN_BITCOIN_CASH]  && this.createBitcoinWallet(privateKey, bitcoin.networks[network[BLOCKCHAIN_BITCOIN_CASH] ])
    const btg = network && network[BLOCKCHAIN_BITCOIN_GOLD]  && this.createBitcoinGoldWallet(privateKey, bitcoin.networks[network[BLOCKCHAIN_BITCOIN_GOLD] ])
    const dash = network && network[BLOCKCHAIN_DASH]  && this.createDashWallet(privateKey, bitcoin.networks[network[BLOCKCHAIN_DASH] ])
    const ltc = network && network[BLOCKCHAIN_LITECOIN]  && this.createLitecoinWallet(privateKey, bitcoin.networks[network[BLOCKCHAIN_LITECOIN] ])
    const nem = network && network[BLOCKCHAIN_NEM]  && NemWallet.fromPrivateKey(privateKey, nemSdk.model.network.data[network[BLOCKCHAIN_NEM] ])
    const waves = network && network[BLOCKCHAIN_WAVES]  && WavesWallet.fromPrivateKey(privateKey, WavesApi[network[BLOCKCHAIN_WAVES] ])

    return {
      networkCode,
      ethereum: engine,//new EthereumEngine(ethereumWallet, network, url, null, lastDeriveNumbers),
      btc: network && network[BLOCKCHAIN_BITCOIN] && createBTCEngine(btc, bitcoin.networks[network[BLOCKCHAIN_BITCOIN]] ),
      bcc: network && network[BLOCKCHAIN_BITCOIN_CASH]  && createBCCEngine(bcc, bitcoin.networks[network[BLOCKCHAIN_BITCOIN_CASH] ]),
      btg: network && network[BLOCKCHAIN_BITCOIN_GOLD]  && createBTGEngine(btg, bitcoin.networks[network[BLOCKCHAIN_BITCOIN_GOLD] ]),
      dash: network && network[BLOCKCHAIN_DASH]  && createDASHEngine(dash, bitcoin.networks[network[BLOCKCHAIN_DASH] ]),
      ltc: network && network[BLOCKCHAIN_LITECOIN]  && createLTCEngine(ltc, bitcoin.networks[network[BLOCKCHAIN_LITECOIN] ]),
      nem: network && network[BLOCKCHAIN_NEM]  && createNEMEngine(nem, nemSdk.model.network.data[network[BLOCKCHAIN_NEM] ]),
      waves: network && network[BLOCKCHAIN_WAVES]  && createWAVESEngine(waves, WavesApi[network[BLOCKCHAIN_WAVES] ]),
    }
  }

  createWalletFromPK (privateKey, network, getAddress) {
    const keyPair = new bitcoin.ECPair.fromPrivateKey(
        Buffer.from(privateKey, 'hex'),
        {
          network,
        }
    )
    return {
      keyPair,
      getNetwork () {
        return keyPair.network
      },
      getAddress () {
        return getAddress(keyPair);
      },
    }
  }

  createBitcoinWalletFromPK (privateKey, network) {
    return this.createWalletFromPK(privateKey, network, (keyPair) => {
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
      return address
    });
  }

  createBitcoinWallet (privateKey, network) {
    if (privateKey.length <= 64) {
      return this.createBitcoinWalletFromPK(privateKey, network)
    }
    const coinType = network === bitcoin.networks.testnet
      ? COIN_TYPE_BTC_TESTNET
      : COIN_TYPE_BTC_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(Buffer.from(privateKey, 'hex'), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createDashWallet (privateKey, network) {
    return this.createWalletFromPK(privateKey, network, () => getAddressByPrivateKey(privateKey, network));
  }

  createLitecoinWallet (privateKey, network) {
    if (privateKey.length <= 64) {
      return this.createBitcoinWalletFromPK(privateKey, network)
    }
    const coinType = network === bitcoin.networks.litecoin_testnet
      ? COIN_TYPE_LTC_TESTNET
      : COIN_TYPE_LTC_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(Buffer.from(privateKey, 'hex'), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createBitcoinGoldWallet (privateKey, network) {
    if (privateKey.length <= 64) {
      return this.createBitcoinWalletFromPK(privateKey, network)
    }
    const coinType = network === bitcoin.networks.bitcoingold_testnet
      ? COIN_TYPE_BTG_TESTNET
      : COIN_TYPE_BTG_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(Buffer.from(privateKey, 'hex'), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createEthereumWallet (privateKey) {
    return EthereumWallet.createWallet({ type: 'memory', pk: privateKey })
  }

  validatePrivateKey (privateKey: string): boolean {
    try {
      this.createEthereumWallet(privateKey)
      return true
    } catch (e) {
      return false
    }
  }
}

export default new PrivateKeyProvider()
