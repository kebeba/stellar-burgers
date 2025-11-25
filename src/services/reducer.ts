import { combineReducers } from '@reduxjs/toolkit';

import {
  assortmentReducer,
  authReducer,
  constructorReducer,
  ordersReducer
} from './slices';

export const rootReducer = combineReducers({
  assortment: assortmentReducer,
  auth: authReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer
});
