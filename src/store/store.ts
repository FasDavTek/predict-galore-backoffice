import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../slices/api/apiSlice";
import { authApi } from "../features/auth/api/authApi";
import authReducer from "../features/auth/slices/authSlice";
import { usersReducer } from "@/features/users/slices/userSlice";
import { userApi } from "@/features/users/api/userApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiSlice.middleware,
        authApi.middleware,
        userApi.middleware
      ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;