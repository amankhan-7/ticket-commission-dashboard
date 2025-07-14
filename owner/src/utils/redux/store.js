import { configureStore } from '@reduxjs/toolkit';
import { busesApi } from './api/busesApi';
import { driversApi } from './api/driversApi';
import busReducer from './features/buses/busesSlice';
import driverReducer from './features/drivers/deiversSlice';

export const store = configureStore({
  reducer: {
    [busesApi.reducerPath]: busesApi.reducer,
    [driversApi.reducerPath]: driversApi.reducer,
    buses: busReducer,
    drivers: driverReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(busesApi.middleware)
      .concat(driversApi.middleware),
});
