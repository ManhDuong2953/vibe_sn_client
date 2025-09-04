import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

// Action creators
export const { loginSuccess, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
