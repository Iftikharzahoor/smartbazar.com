import { createSlice } from '@reduxjs/toolkit';
import { setAccessToken } from '../../services/api.js';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.token) {
        setAccessToken(action.payload.token);
      }
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      setAccessToken('');
    },
    updateWishlist: (state, action) => {
      if (state.user) {
        state.user.wishlist = action.payload;
      }
    }
  }
});

export const {
  authStart,
  authSuccess,
  authFailure,
  updateProfileSuccess,
  logoutSuccess,
  updateWishlist
} = authSlice.actions;

export default authSlice.reducer;
