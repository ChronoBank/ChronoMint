/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import abstractEthereum from './abstractEthereum/reducer'
import assetsHolder from './assetsHolder/reducer'
import assetsManager from './assetsManager/reducer'
import bitcoin from './bitcoin/reducer'
import dao from './daos/reducer'
import device from './device/reducer'
import ethereum from './ethereum/reducer'
import transaction from './transaction/reducer'
import ethMultisigWallet from './multisigWallet/reducer'
import events from './events/reducer'
import laborHour from './laborHour/reducer'
import modals from './modals/reducer'
import nem from './nem/reducer'
import eos from './eos/reducer'
import notifier from './notifier/reducer'
import persistAccount from './persistAccount/reducer'
import profile from './profile/reducer'
import rewards from './rewards/reducer'
import session from './session/reducer'
import settingsErc20Tokens from './settings/erc20/tokens/reducer'
import tokens from './tokens/reducer'
import voting from './voting/reducer'
import wallet from './wallet/reducer'
import wallets from './wallets/reducer'
import watcher from './watcher/reducer'
import waves from './waves/reducer'

const coreReducers = {
  abstractEthereum,
  assetsHolder,
  assetsManager,
  bitcoin,
  dao,
  device,
  ethereum,
  transaction,
  ethMultisigWallet,
  events,
  laborHour,
  modals,
  nem,
  eos,
  notifier,
  persistAccount,
  profile,
  rewards,
  session,
  settingsErc20Tokens,
  tokens,
  voting,
  wallet,
  wallets,
  watcher,
  waves,
}

export default coreReducers

// for further development
export const combinedCoreReducers = combineReducers(coreReducers)
