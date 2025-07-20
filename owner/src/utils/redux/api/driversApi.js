import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const driversApi = createApi({
  reducerPath: 'driversApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Driver'],
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: () => 'drivers',
      providesTags: ['Driver'],
    }),
  }),
});

export const { useGetDriversQuery } = driversApi;
