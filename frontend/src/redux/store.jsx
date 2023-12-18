import { configureStore } from '@reduxjs/toolkit'
import trainingReducer from '../slices/trainingSlice'

export const store = configureStore({
    reducer: {
        training: trainingReducer,
      },
})