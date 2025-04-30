// /store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import authReducer from './slices/authSlice';
import quoteReducer from './slices/quoteSlice';
import dashboardReducer from './slices/dashboardSlice'
import usersReducer from './slices/userSlice'
import transactionsReducer from './slices/transactionSlice';
import predictionsReducer from './slices/predictionSlice'
import settingsReducer from './slices/settingsSlice'


const combinedReducer = combineReducers({
  auth: authReducer,
  quote: quoteReducer,
  dashboard: dashboardReducer,
  users: usersReducer,
  transactions: transactionsReducer,
  predictions: predictionsReducer,
  settings: settingsReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
  });
