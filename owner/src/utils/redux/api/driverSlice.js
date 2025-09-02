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
          status: driver.assignmentStatus ? "Assigned" : "Unassigned",
        })),
    }),

    addDriver: builder.mutation({
      query: ({ firstName, lastName, phoneNumber, drivingLicense, joinedAt }) => ({
        url: `/drivers`,
        method: "POST",
           headers: {
          UserType: "busOwner",
        },
        body: { firstName, lastName, phoneNumber, drivingLicense, joinedAt, UserType: "busOwner", },
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
      query: ({ driverId, busId }) => ({
        url: `/drivers/${driverId}/assign`,
        method: "PUT",
        body: { driverId, busId},
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

    verifyDriverInvitation: builder.mutation({
      query: ({ phoneNumber, otp, firstName, lastName, drivingLicense }) => ({
        url: `/drivers/verify-invitation`,
        method: "POST",
        body: { phoneNumber, otp, firstName, lastName, drivingLicense },
      }),
      invalidatesTags: [{ type: "Driver", id: "LIST" }],
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
  useVerifyDriverInvitationMutation,
} = driverApiSlice;
