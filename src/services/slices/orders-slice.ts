import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TOrdersState = {
  currentOrder: TOrder | null;
  overallOrders: TOrdersData;
  userOrders: TOrder[];
  modalOrders?: TOrder | null;
  isLoading: boolean;
  isOrdersLoading: boolean;
  errorText: string | null;
  ordersErrorText: string | null;
};

const initialState: TOrdersState = {
  currentOrder: null,
  overallOrders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  userOrders: [],
  modalOrders: null,
  isLoading: false,
  isOrdersLoading: false,
  errorText: null,
  ordersErrorText: null
};

export const makeOrder = createAsyncThunk(
  'user/order/make',
  async (ingredientIds: string[]) => {
    const rspData = await orderBurgerApi(ingredientIds);
    return rspData.order;
  }
);

export const getUserOrders = createAsyncThunk('user/orders/fetch', async () => {
  const response = await getOrdersApi();
  return response;
});

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const rspData = await getFeedsApi();
  return rspData;
});

export const getSpecifiedOrder = createAsyncThunk(
  'orders/getSpec',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.currentOrder = null;
      state.errorText = null;
    },
    clearModalOrderData: (state) => {
      state.modalOrders = null;
      state.isLoading = false;
      state.errorText = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.isLoading = true;
        state.errorText = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersErrorText = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.overallOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersErrorText = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(getSpecifiedOrder.pending, (state) => {
        state.isLoading = true;
        state.errorText = null;
      })
      .addCase(getSpecifiedOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modalOrders = action.payload;
      })
      .addCase(getSpecifiedOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.errorText = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Неизвестная ошибка';
      });
  },
  selectors: {
    getCurrentOrderSelector: (state): TOrder | null => state.currentOrder,
    getOrderLoadingStatusSelector: (state): boolean => state.isLoading,
    getOrderErrorTextSelector: (state): string | null => state.errorText,
    getUserOrdersSelector: (state): TOrder[] => state.userOrders,
    getOrdersFeedSelector: (state): TOrder[] => state.overallOrders.orders,
    getOrdersNumberSelector: (state): number => state.overallOrders.total,
    getOrdersNumberTodaySelector: (state): number =>
      state.overallOrders.totalToday,
    getModalOrderSelector: (state): TOrder | null => state.modalOrders || null
  }
});

export const { clearOrderData, clearModalOrderData } = orderSlice.actions;

export const {
  getCurrentOrderSelector,
  getOrderLoadingStatusSelector,
  getOrderErrorTextSelector,
  getUserOrdersSelector,
  getOrdersFeedSelector,
  getOrdersNumberSelector,
  getOrdersNumberTodaySelector,
  getModalOrderSelector
} = orderSlice.selectors;

export const ordersReducer = orderSlice.reducer;
