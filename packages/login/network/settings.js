/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_EOS } from '@chronobank/core/dao/constants'
import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from './constants'

export const NETWORK_MAIN_ID = 1

export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

// ---------- network's base parameters

const blockExplorersMap = {
  Ethereum: {
    mainnet: [
      'https://etherscan.io/tx',
      'https://api.etherscan.io',
    ],
    testnet: [
      'https://rinkeby.etherscan.io/tx',
      'https://rinkeby.etherscan.io',
    ],
  },
  [BLOCKCHAIN_BITCOIN]: {
    mainnet: 'https://blockexplorer.com/tx',
    testnet: 'https://live.blockcypher.com/btc-testnet/tx',
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    mainnet: 'https://bcc.blockdozer.com/insight/tx',
    testnet: 'https://tbcc.blockdozer.com/insight/tx',
  },
  [BLOCKCHAIN_DASH]: {
    mainnet: 'https://middleware-dash-mainnet.chronobank.io/tx',
    testnet: 'https://middleware-dash-dev.chronobank.io/tx',
  },
  [BLOCKCHAIN_LABOR_HOUR]: {
    mainnet: [
      'https://middleware-sidechain-laborx.chronobank.io/tx',
      'https://middleware-sidechain-laborx.chronobank.io',
    ],
    testnet: [
      'https://middleware-sidechain-laborx.chronobank.io/tx',
      'https://middleware-sidechain-laborx.chronobank.io',
    ],
  },
  [BLOCKCHAIN_LITECOIN]: {
    mainnet: 'https://live.blockcypher.com/ltc/tx',
    testnet: 'https://chain.so/tx/LTCTEST',
  },
}

const LABOR_HOUR_WSS = 'wss://parity.tp.ntr1x.com:8546'

const MAINNET_BASE = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  [BLOCKCHAIN_BITCOIN]: 'bitcoin',
  [BLOCKCHAIN_BITCOIN_CASH]: 'bitcoin',
  [BLOCKCHAIN_DASH]: 'bitcoin',
  [BLOCKCHAIN_LABOR_HOUR]: { type: 'mainnet', ws: LABOR_HOUR_WSS },
  [BLOCKCHAIN_LITECOIN]: 'litecoin',
  [BLOCKCHAIN_NEM]: 'mainnet',
  [BLOCKCHAIN_WAVES]: 'MAINNET_CONFIG',
  [BLOCKCHAIN_EOS]: 'mainnet',
}

const RINKEBY_BASE = {
  id: 4,
  protocol: 'https',
  name: 'Rinkeby (test network)',
  scanner: blockExplorersMap.Ethereum.testnet,
  [BLOCKCHAIN_BITCOIN]: 'testnet',
  [BLOCKCHAIN_BITCOIN_CASH]: 'testnet',
  [BLOCKCHAIN_DASH]: 'testnet',
  [BLOCKCHAIN_LABOR_HOUR]: { type: 'testnet', ws: LABOR_HOUR_WSS },
  [BLOCKCHAIN_LITECOIN]: 'litecoin_testnet',
  [BLOCKCHAIN_NEM]: 'testnet',
  [BLOCKCHAIN_WAVES]: 'TESTNET_CONFIG',
  [BLOCKCHAIN_EOS]: 'testnet',
}

// descriptions only, without hosts
const BASE_NETWORK_MAP = [
  MAINNET_BASE,
  RINKEBY_BASE,
]

// --------- providers

export const infuraMainnet = {
  ...MAINNET_BASE,
  host: `mainnet.infura.io/${INFURA_TOKEN}`,
  ws: 'wss://mainnet.infura.io/ws',
}

export const infuraTestnet = {
  ...RINKEBY_BASE,
  host: `rinkeby.infura.io/${INFURA_TOKEN}`,
  ws: 'wss://rinkeby.infura.io/ws',
}

export const infuraNetworkMap = [
  infuraMainnet,
  infuraTestnet,
]

const mewMainnet = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production MyEtherWallet)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  [BLOCKCHAIN_BITCOIN]: 'bitcoin',
  [BLOCKCHAIN_BITCOIN_CASH]: 'bitcoin',
  [BLOCKCHAIN_DASH]: 'bitcoin',
  [BLOCKCHAIN_LABOR_HOUR]: { type: 'mainnet', ws: LABOR_HOUR_WSS },
  [BLOCKCHAIN_LITECOIN]: 'litecoin',
  [BLOCKCHAIN_NEM]: 'mainnet',
  host: `api.myetherapi.com/eth`,
}

export const mewNetworkMap = [
  mewMainnet,
]

const givethMainnet = {
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  name: 'Mainnet (production Giveth)',
  scanner: blockExplorersMap.Ethereum.mainnet,
  [BLOCKCHAIN_BITCOIN]: 'bitcoin',
  [BLOCKCHAIN_BITCOIN_CASH]: 'bitcoin',
  [BLOCKCHAIN_DASH]: 'bitcoin',
  [BLOCKCHAIN_LABOR_HOUR]: { type: 'mainnet', ws: LABOR_HOUR_WSS },
  [BLOCKCHAIN_LITECOIN]: 'litecoin',
  [BLOCKCHAIN_NEM]: 'mainnet',
  [BLOCKCHAIN_WAVES]: 'MAINNET_CONFIG',
  host: `mew.giveth.io`,
}

export const givethNetworkMap = [
  givethMainnet,
]

export const chronoBankMainnet = {
  ...MAINNET_BASE,
  host: 'mainnet-full-parity-ws.chronobank.io/',
  ws: 'wss://mainnet-full-parity-ws.chronobank.io',
}

export const chronoBankTestnet = {
  ...RINKEBY_BASE,
  host: 'rinkeby-full-geth-rpc.chronobank.io/',
  ws: 'wss://rinkeby-full-geth-ws.chronobank.io',
}

export const chronoBankMap = [
  chronoBankMainnet,
  chronoBankTestnet,
]

export const chronoBankPrivate = {
  id: 777,
  protocol: 'https',
  host: 'private.chronobank.io/',
  name: 'Private (develop network)',
  [BLOCKCHAIN_BITCOIN]: 'testnet',
  [BLOCKCHAIN_BITCOIN_CASH]: 'testnet',
  [BLOCKCHAIN_DASH]: 'testnet',
  [BLOCKCHAIN_LABOR_HOUR]: { type: 'testnet', ws: LABOR_HOUR_WSS },
  [BLOCKCHAIN_LITECOIN]: 'litecoin_testnet',
  [BLOCKCHAIN_NEM]: 'testnet',
  [BLOCKCHAIN_WAVES]: 'TESTNET_CONFIG',
}

// dev only
if (process.env['NODE_ENV'] === 'development') {
  chronoBankMap.push(chronoBankPrivate)
}

export const providerMap = {
  metamask: {
    id: 1,
    name: 'Metamask/Mist',
    disabled: true,
  },
  infura: {
    id: 2,
    name: 'Infura',
    disabled: false,
  },
  chronoBank: {
    id: 4,
    name: 'ChronoBank',
    disabled: false,
  },
  mew: {
    id: 6,
    name: 'MyEtherWallet',
    disabled: false,
  },
  giveth: {
    id: 7,
    name: 'Giveth',
    disabled: false,
  },
  uport: {
    id: 5,
    name: 'UPort',
    disabled: false,
  },
}

// eslint-disable-next-line complexity
export const getNetworksByProvider = (providerId) => {
  switch (providerId) {
  case providerMap.uport.id:
  case providerMap.metamask.id: {
    return [...BASE_NETWORK_MAP]
  }
  case providerMap.infura.id: {
    const networks = [...infuraNetworkMap]
    return networks
  }
  case providerMap.giveth.id: {
    const networks = [...givethNetworkMap]
    return networks
  }
  case providerMap.mew.id: {
    const networks = [...mewNetworkMap]
    return networks
  }
  case providerMap.chronoBank.id: {
    return [...chronoBankMap]
  }
  default: {
    return []
  }
  }
}

export const getNetworkWithProviderNames = (providerId, networkId) => {

  const provider = getProviderById(providerId)
  const network = getNetworkById(networkId, providerId)

  if (!provider.name && !network.name) {
    return ''
  }

  return `${provider.name} - ${network.name}`
}

export const getProviderById = (providerId) => {
  return providerMap[Object.keys(providerMap).find((key) => providerMap[key].id === providerId)] || {}
}

export const getNetworkById = (networkId, providerId) => {
  const networkMap = getNetworksByProvider(providerId)
  return networkMap.find((net) => net.id === networkId) || {}
}

export const getBlockExplorerUrl = (networkId, providerId, txHash, blockchain) => {
  try {
    const isTestnet = isTestingNetwork(networkId, providerId)
    const explorers = blockExplorersMap[blockchain]
    if (!explorers) {
      // TODO @ipavlenko: We have no TX history & TX explorers for some blockchains, for NEM for example
      // Public installations have no https support.
      return null
    }
    let baseUrl = explorers[isTestnet ? 'testnet' : 'mainnet']
    if (Array.isArray(baseUrl)) {
      baseUrl = baseUrl[0]
    }

    return baseUrl ? (`${baseUrl}/${txHash}`) : null
  } catch (e) {
    // eslint-disable-next-line
    console.error('getBlockExplorerUrl', e.message)
  }
}

export const isTestingNetwork = (networkId, providerId) => {
  const net = getNetworkById(networkId, providerId)
  return net.id !== NETWORK_MAIN_ID
}

export const getDeveloperNetworksGroup = () => {
  const developerProviders = []

  if (process.env['NODE_ENV'] === 'development') {
    developerProviders.push({
      provider: providerMap.chronoBank,
      network: chronoBankPrivate,
    })
  }

  return developerProviders
}

export const getNetworksSelectorGroup = () => {

  const productionNetworks = {
    title: 'Production networks',
    description: 'Manage your funds',
    providers: [
      {
        provider: providerMap.chronoBank,
        network: chronoBankMainnet,
      },
      {
        provider: providerMap.infura,
        network: infuraMainnet,
      },
    ],
  }

  const testNetworks = {
    title: 'Test networks',
    description: 'Test networks with fake funds',
    providers: [
      {
        provider: providerMap.chronoBank,
        network: chronoBankTestnet,
      },
      {
        provider: providerMap.infura,
        network: infuraTestnet,
      },
    ],
  }

  const groups = [productionNetworks, testNetworks]

  const developerNetworkProviders = getDeveloperNetworksGroup()

  if (developerNetworkProviders.length) {
    groups.push({
      title: 'Developer networks',
      providers: developerNetworkProviders,
    })
  }

  return groups
}

export const EOS_NETWORK_CONFIG = {
  testnet: {
    httpEndpoint: 'https://api.jungle.alohaeos.com:443', // jungle testnet
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // id of network, https://github.com/shniu/eosio/blob/dfec872f1569cfbd8e1cb997e2131d2ebccbb485/jungletestnet/readme.md
  },
  mainnet: {
    httpEndpoint: 'https://api.eosdetroit.io:443',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // https://www.eosdocs.io/resources/apiendpoints/
  },
}
