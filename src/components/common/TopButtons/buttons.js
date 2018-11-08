/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { navigateToAddWallet, navigateToNewPoll, navigateToAddAsset } from 'redux/ui/navigation'
import { goBackForAddWalletsForm } from 'redux/ui/thunks'
import { changeWalletView, showTurnOffPopup } from 'redux/ui/actions'
import RemovePollTopButton from 'components/voting/RemovePollTopButton/RemovePollTopButton'
import ActivatePollTopButton from 'components/voting/ActivatePollTopButton/ActivatePollTopButton'
import EndPollTopButton from 'components/voting/EndPollTopButton/EndPollTopButton'
import AddCustomTokenTopButton from 'components/wallet/AddWalletWidget/AddCustomTokenTopButton/AddCustomTokenTopButton'

export default {
  '/deposits': {
    buttons: [
      {
        title: 'addDeposit',
        action: () => modalsOpen({ componentName: 'DepositTokensModal' }),
      },
    ],
  },
  '/deposit': {
    title: 'nav.deposit',
    backButton: true,
  },
  '/wallets': {
    title: 'nav.wallets',
    buttons: [
      {
        chronobankIcon: 'list',
        action: () => changeWalletView(),
      },
      {
        chronobankIcon: 'menu',
        action: () => showTurnOffPopup(),
      },
      {
        title: 'addWallet',
        action: () => navigateToAddWallet(),
      },
    ],
  },
  '/assets': {
    title: 'nav.assets',
    buttons: [
      {
        title: 'addAsset',
        action: () => navigateToAddAsset(),
      },
    ],
  },
  '/add-asset': {
    title: 'nav.assets',
    backButton: true,
  },
  '/wallet': {
    title: 'nav.wallet',
    backButton: true,
    backButtonAction: () => goBackForAddWalletsForm(),
  },
  '/add-wallet': {
    title: 'nav.addWallet',
    backButton: true,
    backButtonAction: () => goBackForAddWalletsForm(),
    buttons: [
      {
        component: AddCustomTokenTopButton,
      },
    ],
  },
  '/2fa': {
    title: 'nav.twoFa',
    backButton: true,
  },
  '/voting': {
    title: 'nav.voting',
    buttons: [
      {
        chronobankIcon: 'add',
        title: 'addPoll',
        action: () => navigateToNewPoll(),
      },
    ],
  },
  '/new-poll': {
    title: 'nav.newPoll',
    backButton: true,
  },
  '/poll': {
    title: 'nav.poll',
    backButton: true,
    buttons: [
      {
        component: ActivatePollTopButton,
      },
      {
        component: RemovePollTopButton,
      },
      {
        component: EndPollTopButton,
      },
    ],
  },
  '/vote-history': {
    title: 'nav.voteHistory',
    backButton: true,
  },
}
