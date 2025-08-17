import { apiSlice } from "./apiSlice";

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: () => ({
        url: "/drivers",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Driver", id: _id })),
              { type: "Driver", id: "LIST" },
            ]
          : [{ type: "Driver", id: "LIST" }],
      transformResponse: (res) =>
        (res.data || []).map((driver) => ({
          ...driver,
          status: driver.assignedTo ? "Active" : "Inactive",
        })),
    }),

    addDriver: builder.mutation({
      query: ({ ownerId, name, phoneNumber, drivingLicense, joinedAt }) => ({
        url: `/drivers`,
        method: "POST",
        body: { name, phoneNumber, drivingLicense, joinedAt },
      }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
      transformResponse: (res) => res.data,
    }),

    removeDriver: builder.mutation({
      query: ({ id }) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
      transformResponse: (res) => res.data,
    }),

    assignDriver: builder.mutation({
      query: ({ id, busId }) => ({
        url: `/drivers/${id}/assign`,
        method: "PUT",
        body: { busId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Driver", id },
        { type: "Driver", id: "LIST" },
        { type: "Route", id: "LIST" },
      ],
      transformResponse: (res) => res.data,
    }),

    getDriverById: builder.query({
      query: (driverId) => ({
        url: `/drivers/${driverId}`,
        method: "GET",
      }),
      providesTags: (result, error, driverId) => [
        { type: "Driver", id: driverId },
      ],
      transformResponse: (res) => res.data,
    }),

    updateDriver: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/drivers/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Driver", id },
        { type: "Driver", id: "LIST" },
      ],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const {
  useGetDriversQuery,
  useAddDriverMutation,
  useRemoveDriverMutation,
  useAssignDriverMutation,
  useGetDriverByIdQuery,
  useUpdateDriverMutation,
} = driverApiSlice;
