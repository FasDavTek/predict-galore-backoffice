import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../slices/api/apiSlice";
import { authApi } from "../app/(auth)/features/api/authApi";
import authReducer from "../app/(auth)/features/slices/authSlice";
import { usersReducer } from "@/app/(dashboard)/users/features/slices/userSlice";
import { userApi } from "@/app/(dashboard)/users/features/api/userApi";
import { predictionsReducer } from '@/app/(dashboard)/predictions/features/slices/predictionSlice';
import { predictionApi } from "@/app/(dashboard)/predictions/features/api/predictionApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    predictions: predictionsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [predictionApi.reducerPath]: predictionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiSlice.middleware,
        authApi.middleware,
        userApi.middleware,
        predictionApi.middleware
      ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;