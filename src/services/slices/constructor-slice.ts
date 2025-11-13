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
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type == 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
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
      const ingredient = state.ingredients.splice(action.payload.fromIdx, 1)[0];
      state.ingredients.splice(action.payload.toIdx, 0, ingredient);
    }
  },
  selectors: {
    getState: (state): TConstructorState => state,
    check4Bun: (state): TIngredient | null => state.bun,
    getIngredients: (state): TConstructorIngredient[] => state.ingredients
  }
});

export const { addIngredient, deleteIngredient, reorderIngredient } =
  constructorSlice.actions;
export const { getState, check4Bun, getIngredients } =
  constructorSlice.selectors;
export const constructorReducer = constructorSlice.reducer;
