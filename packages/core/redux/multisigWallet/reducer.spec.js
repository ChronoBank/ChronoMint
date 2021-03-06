/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import TokenModel from '../../models/tokens/TokenModel'
import MultisigWalletCollection from '../../models/wallet/MultisigWalletCollection'
import * as a from './actions'
import reducer from './reducer'
import MultisigEthWalletModel from '../../models/wallet/MultisigEthWalletModel'

const wallet1 = new MultisigEthWalletModel({
  address: 'a1',
})
const wallet2 = new MultisigEthWalletModel({
  address: 'a2',
})

describe('Multisig Wallet reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(new MultisigWalletCollection())
  })

  it('should handle ETH_MULTISIG_FETCHING', () => {
    expect(reducer(new MultisigWalletCollection(), {
      type: a.ETH_MULTISIG_FETCHING,
    })).toMatchSnapshot()
  })

  it('should handle ETH_MULTISIG_FETCHED', () => {
    expect(reducer(new MultisigWalletCollection({
      isFetching: true,
    }), {
      type: a.ETH_MULTISIG_FETCHED,
      wallets: new Immutable.Map({
        a1: wallet1,
        a2: wallet2,
      }),
    })).toMatchSnapshot()
  })

  it('should handle ETH_MULTISIG_UPDATE (add new wallet)', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.ETH_MULTISIG_UPDATE,
      wallet: wallet2,
    }))
  })

  it('should handle ETH_MULTISIG_UPDATE (update existing wallet)', () => {
    const updatedWallet = new MultisigEthWalletModel({
      address: 'a1',
      tokens: new Immutable.Map({
        t1: new TokenModel(),
      }),
    })
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.ETH_MULTISIG_UPDATE,
      wallet: updatedWallet,
    })).toMatchSnapshot()
  })

  it('should handle ETH_MULTISIG_SELECT', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
      }),
    }), {
      type: a.ETH_MULTISIG_SELECT,
      wallet: wallet1,
    })).toMatchSnapshot()
  })

  it('should handle ETH_MULTISIG_REMOVE', () => {
    expect(reducer(new MultisigWalletCollection({
      list: new Immutable.Map({
        a1: wallet1,
        a2: wallet2,
      }),
    }), {
      type: a.ETH_MULTISIG_REMOVE,
      wallet: wallet1,
    })).toMatchSnapshot()
  })
})
