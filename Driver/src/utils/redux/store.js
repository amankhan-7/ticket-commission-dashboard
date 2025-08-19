import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./slices/busesSlice";
import driverReducer from './slices/driversSlice'
import profileReducer from './slices/profileSlice'
import authReducer from "./slices/authSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    buses: busReducer,
    drivers: driverReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
