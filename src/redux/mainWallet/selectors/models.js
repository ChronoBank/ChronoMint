/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import AddressModel from 'models/wallet/AddressModel'
import { getAssetsFromAssetHolder } from 'redux/assetsHolder/selectors'
import { getTokens } from 'redux/tokens/selectors'
import { DUCK_MAIN_WALLET } from 'redux/mainWallet/actions'

export const getWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET).addresses()
}

export const getWalletAddress = (blockchain: string) => createSelector(
  [getWallet],
  (addresses) => {
    return blockchain ? addresses.item(blockchain) : new AddressModel()
  },
)

export const getDeposit = (tokenId) => createSelector(
  [getAssetsFromAssetHolder, getTokens],
  (assets, tokens) => {
    const token = tokens.item(tokenId)
    return assets.item(token.address()).deposit()
  },
)