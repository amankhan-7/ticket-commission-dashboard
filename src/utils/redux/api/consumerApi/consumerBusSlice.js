import { consumerBaseSlice } from "./consumerBaseSlice";

export const busApiSlice = consumerBaseSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    searchBuses: builder.query({
      query: ({ fromCity, toCity, travelDate }) => ({
        url: `/search-buses`,
        method: "POST",
        body: { fromCity, toCity, travelDate },
      }),
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, { fromCity, toCity, travelDate }) => [
        { type: "Bus", id: `${fromCity}-${toCity}-${travelDate}` },
      ],
    }),

    getBusDetails: builder.query({
      query: ({ busId, travelDate, routeId }) => ({
        url: `/buses/${busId}?date=${travelDate}${
          routeId ? `&routeId=${routeId}` : ""
        }`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, { busId }) => [{ type: "Bus", id: busId }],
    }),

    getAvailableSeats: builder.query({
      query: ({ busId }) => ({
        url: `/buses/${busId}/seats`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, { busId }) => [
        { type: "AvailableSeats", id: busId },
      ],
    }),

    getBusSchedule: builder.mutation({
      query: ({ fromCity, toCity, travelDate }) => {
        return {
          url: `/bus-schedule?fromCity=${fromCity}&toCity=${toCity}&date=${travelDate}`,
          method: "GET",
        };
      },
      transformResponse: (res) => res.data,
      providesTags: (_res, _err, { fromCity, toCity, travelDate }) => [
        { type: "BusSchedule", id: `${fromCity}-${toCity}-${travelDate}` },
      ],
    }),


  }),
});

export const {
  useSearchBusesQuery,
  useGetBusDetailsQuery,
  useGetAvailableSeatsQuery,
  useGetBusScheduleMutation,
} = busApiSlice;