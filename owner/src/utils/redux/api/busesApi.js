import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const busesApi = createApi({
  reducerPath: 'busesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/routes/' }),
  tagTypes: ['Bus'],
  endpoints: (builder) => ({
    getBuses: builder.query({
      query: () => 'buses',
      providesTags: ['Bus'],
    }),
  }),
});

export const { useGetBusesQuery } = busesApi;
