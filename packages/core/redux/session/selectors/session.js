/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import {
  DUCK_SESSION,
  PROFILE_PANEL_TOKENS,
} from '../constants'
import {
  DUCK_PERSIST_ACCOUNT,
} from '../../persistAccount/constants'
import { getMainWallets } from '../../wallets/selectors/models'
import { getGasSliderCollection, getIsCBE } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import { getEosWallets } from '../../eos/selectors/mainSelectors'
import { getAddressCache } from '../../persistAccount/selectors'

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

export const getAddressesList = () => createSelector(
  [getMainWallets],
  (wallets: Array<WalletModel>) => {
    return wallets
      .reduce((accumulator, wallet: WalletModel) => {
        accumulator[wallet.blockchain] = wallet.address
        return accumulator
      }, {})
  },
)

export const getBlockchainAddressesList = () => createSelector(
  [getAddressesList()],
  (addresses) => {
    return PROFILE_PANEL_TOKENS
      .map((token) =>({
        ...token,
        address: addresses[token.blockchain],
      }))
      .filter(({ blockchain }) => Object.keys(addresses).includes(blockchain))
  }
)

export const isCBE = () => createSelector(
  [getIsCBE],
  (isCBE) => isCBE,
)

export const getProfileSignature = createSelector(
  (state) => state.get(DUCK_SESSION),
  (session) => {
    const { profileSignature } = session
    return profileSignature && profileSignature.profile
  },
)

export const getSelectedAccountName = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => {
    const { selectedWallet } = persistAccount

    return selectedWallet && selectedWallet.name
  },
)

export const getAccountProfileSummary = createSelector(
  [
    getProfileSignature,
    getSelectedAccountName,
  ],
  (profile, selectedAccountName) => {
    if (profile) {
      const level1 = profile.level1.submitted
      const level2 = profile.level2.submitted

      return {
        userName: level1 && level1.userName || selectedAccountName,
        avatar: level1 && level1.avatar && level1.avatar.id,
        phone: level2 && level2.phone,
        email: level2 && level2.email,
        company: level2 && level2.company,
        website: level2 && level2.website,
      }
    }

    return {}
  },
)

export const getAccountAddresses = createSelector(
  [
    getMainWallets,
    getEosWallets,
  ],
  (wallets, eosWallets) => {
    return Object.values({ ...wallets, ...eosWallets })
      .reduce((accumulator, wallet) => {
        // replace all non chars symbols with -
        const blockchain = wallet.blockchain.toLowerCase().replace(/\W/, '-')
        return [
          ...accumulator,
          {
            type: `${blockchain}-address`,
            value: wallet.address,
          },
        ]
      }, [])
  },
)

export const getDeviceAccountAddresses = createSelector(
  [
    getAddressCache,
  ],
  (addresses) => {
    return Object.entries(addresses)
      .reduce((accumulator, [blockchainName, data]) => {
        // replace all non chars symbols with -
        const blockchain = blockchainName.toLowerCase().replace(/\W/, '-')
        return [
          ...accumulator,
          {
            type: `${blockchain}-address`,
            value: data.address,
          },
        ]
      }, {})
  },
)
