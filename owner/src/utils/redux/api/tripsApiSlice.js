import { apiSlice } from "./apiSlice";

export const tripsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodayTrips: builder.query({
      query: () => ({
        url: "/routes/today-trips",
        method: "GET",
      }),
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, _arg) => [{ type: "Trip", id: "TODAY" }],
    }),
  }),
});

export const { useGetTodayTripsQuery } = tripsApiSlice;
