import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../Reducer/theme'
import authReducer from '../Reducer/auth'
import walletReducer from '../Reducer/wallet'
export default configureStore({
  reducer: {
    themeUI: themeReducer,
    auth: authReducer,
    wallet: walletReducer, // Thêm wallet vào store
  },
})