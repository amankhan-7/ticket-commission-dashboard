import { apiSlice } from "./apiSlice";

export const routeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Route CRUD operations
    createRoute: builder.mutation({
      query: ({
        busNumber,
        busName,
        routeFrom,
        routeTo,
        date,
        departureTime,
        arrivalTime,
        price,
        totalSeats = 32,
        routeStops = [],
      }) => ({
        url: "/routes",
        method: "POST",
        body: {
          busNumber,
          busName,
          routeFrom,
          routeTo,
          date,
          departureTime,
          arrivalTime,
          price,
          totalSeats,
          routeStops,
        },
      }),
      invalidatesTags: ["Route", "TodayTrips", "RouteStats"],
      transformResponse: (res) => res.data,
    }),

    getRoutes: builder.query({
      query: ({ page = 1, limit = 10, date, status } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (date) params.append("date", date);
        if (status) params.append("status", status);

        return {
          url: `/routes?${params.toString()}`,
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

    getRouteById: builder.query({
      query: (routeId) => ({
        url: `/routes/${routeId}`,
        method: "GET",
      }),
      providesTags: (result, error, routeId) => [
        { type: "Route", id: routeId },
      ],
      transformResponse: (res) => res.data,
    }),

    updateRoute: builder.mutation({
      query: ({ routeId, ...updateData }) => ({
        url: `/routes/${routeId}`,
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

    deleteRoute: builder.mutation({
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

    // Route statistics and analytics
    getRouteStats: builder.query({
      query: () => ({
        url: "/routes/stats",
        method: "GET",
      }),
      providesTags: ["RouteStats"],
      transformResponse: (res) => res.data,
    }),

    getTodaysTrips: builder.query({
      query: () => ({
        url: "/routes/today-trips",
        method: "GET",
      }),
      providesTags: ["TodayTrips"],
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
      query: ({
        routeId,
        stopOrder,
        stopName,
        arrivalTime,
        departureTime,
        distanceKm,
      }) => ({
        url: `/routes/${routeId}/stops`,
        method: "POST",
        body: { stopOrder, stopName, arrivalTime, departureTime, distanceKm },
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
  }),
});

export const {
  useCreateRouteMutation,
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useGetRouteStatsQuery,
  useGetTodaysTripsQuery,
  useGetRouteStopsQuery,
  useAddRouteStopMutation,
  useUpdateRouteStopMutation,
  useDeleteRouteStopMutation,
} = routeApiSlice;
