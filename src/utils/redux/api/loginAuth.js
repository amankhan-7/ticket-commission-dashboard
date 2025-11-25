import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =======================
    // AUTHENTICATION
    // =======================

    counterPersonLogin: builder.mutation({
      query: ({ phone, pin }) => ({
        url: `/auth/counter-person/login`,
        method: "POST",
        body: { phone, pin },
      }),

      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "counterPerson", id: "CURRENT" }],
    }),

    ticketExecutiveLogin: builder.mutation({
      query: ({ phone, pin }) => ({
        url: `/auth/ticket-executive/login`,
        method: "POST",
        body: { phone, pin },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "ticketExecutive", id: "CURRENT" }],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: `/auth/refresh-token`,
        method: "POST",
      }),
      transformResponse: (res) => res.data,
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "ticketExecutive",type: "counterPerson", id: "CURRENT" }],
    }),

    // =======================
    // PIN MANAGEMENT
    // =======================

    verifyPin: builder.mutation({
      query: ({ pin }) => ({
        url: `/auth/verify-pin`,
        method: "POST",
        body: { pin },
      }),
      transformResponse: (res) => res.data,
    }),

    changePin: builder.mutation({
      query: ({ currentPin, newPin }) => ({
        url: `/auth/change-pin`,
        method: "PATCH",
        body: { currentPin, newPin },
      }),
      transformResponse: (res) => res.data,
    }),

    // =======================
    // PROFILE MANAGEMENT
    // =======================

    getCounterPersonProfile: builder.query({
      query: () => `/auth/counter-person/profile`,
      providesTags: [{ type: "counterPerson", id: "CURRENT" }],
    }),

    updateCounterPersonProfile: builder.mutation({
      query: (body) => ({
        url: `/auth/counter-person/profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "counterPerson", id: "CURRENT" }],
    }),

    getTicketExecutiveProfile: builder.query({
      query: () => `/auth/ticket-executive/profile`,
      providesTags: [{ type: "ticketExecitive", id: "CURRENT" }],
    }),

    updateTicketExecutiveProfile: builder.mutation({
      query: (body) => ({
        url: `/auth/ticket-executive/profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "ticketExecutive", id: "CURRENT" }],
    }),
  }),
});

export const {
  // Auth hooks
  useCounterPersonLoginMutation,
  useTicketExecutiveLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,

  // PIN hooks
  useVerifyPinMutation,
  useChangePinMutation,

  // Profile hooks
  useGetCounterPersonProfileQuery,
  useUpdateCounterPersonProfileMutation,
  useGetTicketExecutiveProfileQuery,
  useUpdateTicketExecutiveProfileMutation,
} = userApiSlice;
