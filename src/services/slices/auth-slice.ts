import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TAuthState = {
  userInfo: TUser | null;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  userInfo: null,
  isAuthorized: false,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk('auth/check', async () => {
  const data = await getUserApi();
  return data.user;
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const rspData = await registerUserApi(userData);
    localStorage.setItem('refreshToken', rspData.refreshToken);
    setCookie('accessToken', rspData.accessToken);
    return rspData.user;
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logOut = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUserData = createAsyncThunk(
  'auth/update',
  async ({
    email,
    name,
    password
  }: {
    email: string;
    name: string;
    password: string;
  }) => {
    const data = await updateUserApi({ email, name, password });
    return data.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthorized = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.userInfo = null;
        state.isAuthorized = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthorized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации пользователя';
      })

      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthorized = true;
        state.isLoading = false;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      .addCase(logOut.fulfilled, (state) => {
        state.userInfo = null;
        state.isAuthorized = false;
      })

      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isAuthorized = true;
        state.isLoading = false;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления профиля';
      });
  },
  selectors: {
    getUserInfo: (state): TUser | null => state.userInfo,
    getUserAuthStatus: (state): boolean => state.isAuthorized,
    getLoadingStatus: (state): boolean => state.isLoading,
    getUserName: (state): string => state.userInfo?.name ?? '',
    getErrorText: (state): string | null => state.error
  }
});

export const {
  getUserInfo,
  getUserAuthStatus,
  getLoadingStatus,
  getUserName,
  getErrorText
} = authSlice.selectors;
export const authReducer = authSlice.reducer;
