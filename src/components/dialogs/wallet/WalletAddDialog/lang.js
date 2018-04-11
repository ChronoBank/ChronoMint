/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const prefix = 'WalletAddEditForm'

export default {
  en: {
    createNewWallet: 'Create new wallet',
    editWallet: 'Edit wallet',
    walletName: 'Wallet name',
    addOwner: 'Add owner',
    addWallet: 'Add wallet',
    save: 'Save',
    ownerAddress: 'Owner address',
    you: 'You',
    name: 'Name',
    // fields
    timeLocked: 'Time Locked',
    timeLockedDescription: 'Make this wallet active for transactions after specific date and time.',
    twoFA: '2 Factor Authentication',
    // twoFADescription: 'Protect your Wallet from unauthorized access by enabling two-factor authentication. Use this option if you do not plan to have more Owners.',
    twoFADescription: 'Coming soon.',
    walletOwners: 'Wallet Owners (%{count})',
    walletOwnersDescription: 'Add the wallet owner here.',
    walletOwners2FADescription: 'Disable 2FA in order to specify the wallet owners',
    enterAddress: 'Enter Owner’s Ethereum address',
    requiredSignatures: 'Required signatures',
    requiredSignaturesDescription: 'Specify number of owners’ signatures to perform transaction.',
    date: 'Date',
    time: 'Time',
  },
  ru: {
    createNewWallet: 'Создать новый кошелёк',
    editWallet: 'Редактировать кошелёк',
    walletName: 'Название кошелька',
    addOwner: 'Добавить владельца',
    addWallet: 'Добавить кошелёк',
    save: 'Сохранить',
    ownerAddress: 'Адрес владельца',
    you: 'Вы',
    name: 'Название',
    timeLocked: 'Time Locked',
    timeLockedDescription: 'Кошелек будет доступен для исходящих транзакций после определенных даты и времени.',
    twoFA: 'Двух-факторная авторизация',
    // twoFADescription: 'Protect your Wallet from unauthorized access by enabling two-factor authentication. Use this option if you do not plan to have more Owners.',
    twoFADescription: 'В разработке.',
    walletOwners: 'Владельцы кошелька',
    walletOwnersDescription: 'Добавьте здесь владельцев кошелька.',
    enterAddress: 'Введите Ethereum-адрес владельца',
    requiredSignatures: 'Необходимо подписей',
    requiredSignaturesDescription: 'Определите сколько необходимо подписей владельцев кошелька для того чтобы транзакции исполнялись.',
    date: 'Дата',
    time: 'Время',
  },
}

