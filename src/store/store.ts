// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../app/(auth)/features/api/authApi";
import authReducer from "../app/(auth)/features/slices/authSlice";
import { dashboardApi } from "../app/(dashboard)/dashboard/features/api/dashboardApi";
import { notificationApi } from "@/shared/api/notificationApi";
import { usersReducer } from "../app/(dashboard)/users/features/slices/userSlice";
import { userApi } from "../app/(dashboard)/users/features/api/userApi";
import { predictionsReducer } from '../app/(dashboard)/predictions/features/slices/predictionSlice';
import { predictionApi } from "../app/(dashboard)/predictions/features/api/predictionApi";
import { transactionApi } from "../app/(dashboard)/transactions/features/api/transactionApi";
import { settingsApi } from '../app/(dashboard)/settings/features/api/settingsApi';
import settingsSlice from '../app/(dashboard)/settings/features/slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    predictions: predictionsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [predictionApi.reducerPath]: predictionApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer, 
    settings: settingsSlice,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        authApi.middleware,
        dashboardApi.middleware,
        notificationApi.middleware,
        userApi.middleware,
        predictionApi.middleware,
        transactionApi.middleware,
        settingsApi.middleware
      ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;