// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Ensure your slice is correctly imported

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
