import { combineReducers } from '@reduxjs/toolkit';

import { assortmentReducer, authReducer, constructorReducer } from './slices';

export const rootReducer = combineReducers({
  assortment: assortmentReducer,
  auth: authReducer,
  constructor: constructorReducer
});
