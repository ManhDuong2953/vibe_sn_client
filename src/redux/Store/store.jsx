import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../Reducer/reducer'
import walletReducer from '../Reducer/wallet'
export default configureStore({
  reducer: {
    themeUI: themeReducer,
    wallet: walletReducer, // Thêm wallet vào store
  },
})