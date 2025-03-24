import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,  // Lưu địa chỉ ví
  balance: 0,   // Lưu số dư ETH
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.account = action.payload.account;
      state.balance = action.payload.balance;
    },
    clearWallet: (state) => {
      state.account = null;
      state.balance = 0;
    },
  },
});

export const { setWallet, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
