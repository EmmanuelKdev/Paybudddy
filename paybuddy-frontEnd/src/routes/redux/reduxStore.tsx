import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import dataReducer from './slice'; // Import the reducer

// Configure the Redux store with the data slice reducer
const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create a ReduxProvider component to wrap the application with the Redux Provider
export const ReduxProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);