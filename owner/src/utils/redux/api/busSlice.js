import { apiSlice } from "./apiSlice";

const busSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodaySeatsBooked: builder.query({
      query: () => ({
        url: "/routes/today-trips",
        method: "GET",
      }),
      providesTags: ["TodayTrips"],
      transformResponse: (response) => response.data,
    }),

    getRouteStats: builder.query({
      query: () => ({
        url: "/routes/stats",
        method: "GET",
      }),
      providesTags: ["RouteStats"],
      transformResponse: (response) => response.data,
    }),

    addBus: builder.mutation({
      query: ({
        busNumber,
        busName,
        baseRouteFrom,
        baseRouteTo,
        totalSeats,
        seatingCapacity,
        basePrice,
        busType,
        amenities,
        registrationNumber,
        insuranceExpiry,
        permitExpiry,
        yearOfManufacture,
      }) => ({
        url: "/buses",
        method: "POST",
        body: {
          busNumber,
          busName,
          baseRouteFrom,
          baseRouteTo,
          totalSeats: Number(totalSeats),
          seatingCapacity: Number(seatingCapacity),
          basePrice: basePrice ? Number(basePrice) : null,
          busType,
          amenities,
          registrationNumber,
          insuranceExpiry,
          permitExpiry,
          yearOfManufacture: yearOfManufacture
            ? Number(yearOfManufacture)
            : null,
          userType: "busOwner",
        },
      }),
      invalidatesTags: ["Bus", "TodayTrips", "BusStats"],
      transformResponse: (res) => res.data,
    }),

    // Bulk add buses for all 6  months
    bulkAddBus: builder.mutation({
      query: ({
        busId,
        startDate,
        endDate,
        routeFrom,
        routeTo,
        departureTime,
        arrivalTime,
        basePrice,
        routeStops = [],
        frequency = "daily",
        notes = "",
        restrictions = [],
        tags = [],
      }) => ({
        url: "/buses/routes/bulk",
        method: "POST",
        body: {
          busId,
          startDate,
          endDate,
          routeFrom,
          routeTo,
          departureTime,
          arrivalTime,
          basePrice: Number(basePrice),
          routeStops,
          frequency,
          notes,
          restrictions,
          tags,
        },
      }),
      invalidatesTags: ["Route", "TodayTrips", "RouteStats"],
      transformResponse: (res) => res.data,
    }),

    getAllBuses: builder.query({
      query: ({ date, status } = {}) => {
        const params = new URLSearchParams();

        if (date) params.append("date", date);
        if (status) params.append("status", status);

        return {
          url: `/buses?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.routes
          ? [
              ...result.routes.map(({ _id }) => ({ type: "Route", id: _id })),
              { type: "Route", id: "LIST" },
            ]
          : [{ type: "Route", id: "LIST" }],
      transformResponse: (res) => res.data,
    }),

    // Get route by ID
    getBusById: builder.query({
      query: (routeId) => ({
        url: `/routes/${routeId}`,
        method: "GET",
      }),
      providesTags: (result, error, routeId) => [
        { type: "Route", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    // Update route
    updateBus: builder.mutation({
      query: ({ routeId, ...updateData }) => ({
        url: `/buses/${routeId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { routeId }) => [
        { type: "Route", id: routeId },
        { type: "Route", id: "LIST" },
        "TodayTrips",
        "RouteStats",
      ],
      transformResponse: (res) => res.data,
    }),

    // Delete route
    deleteBus: builder.mutation({
      query: (routeId) => ({
        url: `/routes/${routeId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Route", id: "LIST" },
        "TodayTrips",
        "RouteStats",
      ],
      transformResponse: (res) => res.data,
    }),

    // Route stops management
    getRouteStops: builder.query({
      query: (routeId) => ({
        url: `/routes/${routeId}/stops`,
        method: "GET",
      }),
      providesTags: (result, error, routeId) => [
        { type: "RouteStop", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    addRouteStop: builder.mutation({
      query: ({ routeId, ...stopData }) => ({
        url: `/routes/${routeId}/stops`,
        method: "POST",
        body: stopData,
      }),
      invalidatesTags: (result, error, { routeId }) => [
        { type: "RouteStop", id: routeId },
        { type: "Route", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    updateRouteStop: builder.mutation({
      query: ({ routeId, stopId, ...updateData }) => ({
        url: `/routes/${routeId}/stops/${stopId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { routeId }) => [
        { type: "RouteStop", id: routeId },
        { type: "Route", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    deleteRouteStop: builder.mutation({
      query: ({ routeId, stopId }) => ({
        url: `/routes/${routeId}/stops/${stopId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { routeId }) => [
        { type: "RouteStop", id: routeId },
        { type: "Route", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    // Driver management
    // getDrivers: builder.query({
    //   query: () => ({
    //     url: "/drivers",
    //     method: "GET",
    //   }),
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ _id }) => ({ type: "Driver", id: _id })),
    //           { type: "Driver", id: "LIST" },
    //         ]
    //       : [{ type: "Driver", id: "LIST" }],
    //   transformResponse: (res) => res.data,
    // }),

    // addDrivers: builder.mutation({
    //   query: ({ ownerId, name, phoneNumber, drivingLicense, joinedAt }) => ({
    //     url: `/drivers`,
    //     method: "POST",
    //     body: { ownerId, name, phoneNumber, drivingLicense, joinedAt },
    //   }),
    //   invalidatesTags: [{ type: "Driver", id: "LIST" }],
    //   transformResponse: (res) => res.data,
    // }),

    // deleteDrivers: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/drivers/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [{ type: "Driver", id: "LIST" }],
    //   transformResponse: (res) => res.data,
    // }),

    // assignDriver: builder.mutation({
    //   query: ({ id, busId }) => ({
    //     url: `/drivers/${id}/assign`,
    //     method: "PUT",
    //     body: { busId },
    //   }),
    //   invalidatesTags: (result, error, { id }) => [
    //     { type: "Driver", id },
    //     { type: "Driver", id: "LIST" },
    //   ],
    //   transformResponse: (res) => res.data,
    // }),
  }),
});

export const {
  useGetTodaySeatsBookedQuery,
  useGetRouteStatsQuery,
  useAddBusMutation,
  useBulkAddBusMutation,
  useGetAllBusesQuery,
  useGetBusByIdQuery,
  useUpdateBusMutation,
  useDeleteBusMutation,
  useGetRouteStopsQuery,
  useAddRouteStopMutation,
  useUpdateRouteStopMutation,
  useDeleteRouteStopMutation,
} = busSlice;

export default busSlice;
