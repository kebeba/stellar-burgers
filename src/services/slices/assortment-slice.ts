import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TAssortmentState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errorText: string | null;
};

const initialState: TAssortmentState = {
  ingredients: [],
  isLoading: false,
  errorText: null
};

export const requestIngredients = createAsyncThunk(
  'assortment/fetch',
  async () => getIngredientsApi()
);

export const assortmentSlice = createSlice({
  name: 'assortment',
  initialState,
  reducers: {},
  selectors: {
    fetchIngredients: (state) => state.ingredients,
    getLoadingStatus: (state) => state.isLoading,
    check4Error: (state) => state.errorText,
    getBunStock: createSelector(
      (state: TAssortmentState) => state.ingredients,
      (ingredients) => ingredients.filter((i) => i.type == 'bun')
    ),
    getFillingStock: createSelector(
      (state: TAssortmentState) => state.ingredients,
      (ingredients) => ingredients.filter((i) => i.type == 'main')
    ),
    getSauceStock: createSelector(
      (state: TAssortmentState) => state.ingredients,
      (ingredients) => ingredients.filter((i) => i.type == 'sauce')
    )
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(requestIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          action.error.message ?? 'Произошла непредвиденная ошибка';
      })
      .addCase(requestIngredients.pending, (state, action) => {
        state.isLoading = true;
        state.errorText = null;
      });
  }
});

export const {
  fetchIngredients,
  getLoadingStatus,
  check4Error,
  getBunStock,
  getFillingStock,
  getSauceStock
} = assortmentSlice.selectors;
export default assortmentSlice.reducer;
