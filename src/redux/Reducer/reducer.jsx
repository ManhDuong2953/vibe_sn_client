import { createSlice } from '@reduxjs/toolkit'

// Lấy trạng thái theme từ localStorage hoặc sử dụng giá trị mặc định là "light"
const initialTheme = 'dark';

export const counterSlice = createSlice({
  name: 'themeUI',
  initialState: {
    theme: initialTheme
  },
  reducers: {
    lightHandle: (state) => {
      state.theme = 'light';
      localStorage.setItem('theme', 'light'); // Lưu trạng thái theme vào localStorage
    },
    darkHandle: (state) => {
      state.theme = 'dark';
      localStorage.setItem('theme', 'dark'); // Lưu trạng thái theme vào localStorage
    },
  },
})

// Action creators are generated for each case reducer function
export const { lightHandle, darkHandle } = counterSlice.actions

export default counterSlice.reducer
