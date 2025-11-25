import { configureStore } from "@reduxjs/toolkit";
import busReducer from "./slices/busesSlice";
import profileReducer from "./slices/profileSlice";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./api/apiSlice";
import { bookingBaseApi } from "./api/ownerApi/ownerBaseSlice";
import { consumerBaseSlice } from "./api/consumerApi/consumerBaseSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    buses: busReducer,
    auth: authReducer,

    // Add all API slices here
    [apiSlice.reducerPath]: apiSlice.reducer,
    [bookingBaseApi.reducerPath]: bookingBaseApi.reducer,
    [consumerBaseSlice.reducerPath]: consumerBaseSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(bookingBaseApi.middleware)
      .concat(consumerBaseSlice.middleware),
});
