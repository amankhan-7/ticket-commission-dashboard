import { bookingBaseApi } from "./ownerBaseSlice";

const busSlice = bookingBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================
    // Offline Booking Endpoints
    // ========================

    getOwnerBusesForBooking: builder.query({
      query: () => ({
        url: "/offline-booking/buses",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Bus", id })), "Bus"]
          : ["Bus"],
      transformResponse: (response) => response.data.buses,
    }),

    getBusStops: builder.query({
      query: (busId) => ({
        url: `/offline-booking/bus/${busId}/stops`,
        method: "GET",
      }),
      providesTags: (result, error, busId) =>
        result ? [{ type: "BusSchedule", id: busId }] : [],
      transformResponse: (response) => response.data.stops,
    }),
    
    //searching a bus starts
    searchBusRoutes: builder.mutation({
      query: ({ busId, routeFrom, routeTo, journeyDate }) => ({
        url: "/offline-booking/search-routes",
        method: "POST",
        body: { busId, routeFrom, routeTo, journeyDate },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["AvailableSeats"],
    }),

    getRouteSeatLayout: builder.query({
      query: ({ routeId, travelDate }) => ({
        url: `/offline-booking/route/${routeId}/seat-layout/${travelDate}`,
        method: "GET",
      }),
      providesTags: (result, error, { routeId }) => [
        { type: "SeatMap", id: routeId },
      ],
      transformResponse: (response) => response.data,
    }),

    validateOwnerPin: builder.mutation({
      query: ({ pin }) => ({
        url: "/offline-booking/validate-pin",
        method: "POST",
        body: { pin },
      }),
      transformResponse: (response) => response.data,
    }),

    // lockSeatsForBooking: builder.mutation({
    //   query: ({ routeId, seatNumbers, journeyDate }) => ({
    //     url: "/offline-booking/lock-seats",
    //     method: "POST",
    //     body: { routeId, seatNumbers, journeyDate },
    //   }),
    //   transformResponse: (response) => response.data,
    //   invalidatesTags: (result, error, { routeId }) => [
    //     { type: "SeatMap", id: routeId },
    //   ],
    // }),

    // createOfflineBooking: builder.mutation({
    //   query: (bookingData) => ({
    //     url: "/offline-booking/create",
    //     method: "POST",
    //     body: bookingData,
    //   }),
    //   transformResponse: (response) => response.data,
    //   invalidatesTags: ["Booking", "AvailableSeats"],
    // }),

    confirmOnlineBookingPayment: builder.mutation({
      query: ({ bookingId, paymentId, orderId, signature, paymentMethod }) => ({
        url: "/offline-booking/confirm-online-payment",
        method: "POST",
        body: { bookingId, paymentId, orderId, signature, paymentMethod },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Booking", "Payment"],
    }),

    // getOfflineBookingHistory: builder.query({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `/offline-booking/history?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ id }) => ({ type: "BookingDetails", id })),
    //           "BookingDetails",
    //         ]
    //       : ["BookingDetails"],
    //   transformResponse: (response) => response.data,
    // }),

    getOfflinePassengers: builder.query({
      query: ({ busId, journeyDate }) => ({
        url: `/offline-booking/passengers?busId=${busId}&journeyDate=${journeyDate}`,
        method: "GET",
      }),
      providesTags: (result, error, { busId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Passengers", id })),
              "Passengers",
            ]
          : ["Passengers"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetOwnerBusesForBookingQuery,
  useGetBusStopsQuery,
  useSearchBusRoutesMutation,
  useGetRouteSeatLayoutQuery,
  useValidateOwnerPinMutation,
  // useLockSeatsForBookingMutation,
  // useCreateOfflineBookingMutation,
  useConfirmOnlineBookingPaymentMutation,
  // useGetOfflineBookingHistoryQuery,
  useGetOfflinePassengersQuery,
} = busSlice;

export default busSlice;
