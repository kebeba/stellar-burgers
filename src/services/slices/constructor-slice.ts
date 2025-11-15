import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() }
      })
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      const pos = action.payload;
      state.ingredients.splice(pos, 1);
    },
    reorderIngredient: (
      state,
      action: PayloadAction<{ fromIdx: number; toIdx: number }>
    ) => {
      const { fromIdx, toIdx } = action.payload;
      const ingredient = state.ingredients.splice(fromIdx, 1)[0];
      state.ingredients.splice(toIdx, 0, ingredient);
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getState: (state): TConstructorState => state,
    check4Bun: (state): TIngredient | null => state.bun,
    getIngredients: (state): TConstructorIngredient[] => state.ingredients || []
  }
});

export const {
  addIngredient,
  deleteIngredient,
  reorderIngredient,
  clearIngredients
} = constructorSlice.actions;
export const { getState, check4Bun, getIngredients } =
  constructorSlice.selectors;
export const constructorReducer = constructorSlice.reducer;
