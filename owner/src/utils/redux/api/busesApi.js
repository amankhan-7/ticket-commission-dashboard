import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const busesApi = createApi({
  reducerPath: 'busesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Bus'],
  endpoints: (builder) => ({
    getBuses: builder.query({
      query: () => 'buses',
      providesTags: ['Bus'],
    }),
  }),
});

export const { useGetBusesQuery } = busesApi;
