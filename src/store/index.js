import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import authReducer from './slices/auth/authSlice';
import quoteReducer from './slices/quoteSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  quote: quoteReducer,
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
