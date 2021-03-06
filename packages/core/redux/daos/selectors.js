/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

export const daosSelector = () => (state) => state.get('dao')

export const daoByAddress = (address) => createSelector(
  daosSelector(),
  (daos) => (address in daos.byAddress)
    ? daos.byAddress[address].dao
    : null,
)

export const daoByType = (type) => createSelector(
  daosSelector(),
  (daos) => {
    return (type in daos.byType)
      ? daos.byType[type].dao
      : null
  },
)
