import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiateLogin: builder.mutation({
      query: ({ phoneNumber }) => ({
        url: `/initiate-login`,
        method: "POST",
        body: { phoneNumber },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    verifyOtp: builder.mutation({
      query: ({ phoneNumber, otp, purpose }) => ({
        url: `/verify-otp`,
        method: "POST",
        body: { phoneNumber, otp, purpose },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: (_res, _err, _args) => [{ type: "User", id: "CURRENT" }],
    }),

    register: builder.mutation({
      query: ({ phoneNumber, firstName, lastName }) => ({
        url: `/register`,
        method: "POST",
        body: { phoneNumber, firstName, lastName },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    getUserProfile: builder.query({
      query: ({ userId }) => ({
        url: `/get-profile`,
        method: "POST",
        body: { userId },
      }),
      transformResponse: (res) => res.data,
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: `/refresh-token`,
        method: "POST",
      }),
      transformResponse: (res) => res.data,
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    resetAccount: builder.mutation({
      query: ({ phoneNumber, verificationData }) => ({
        url: `/reset-account`,
        method: "POST",
        body: { phoneNumber, verificationData },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    setPin: builder.mutation({
      query: ({ userId, pin }) => ({
        url: `/set-pin`,
        method: "POST",
        body: { userId, pin },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),

    updateUserProfile: builder.mutation({
      query: ({ userId, firstName, lastName, email }) => ({
        url: `/update-profile`,
        method: "POST",
        body: { userId, firstName, lastName, email },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
    deleteAccount: builder.mutation({
      query: ({ userId }) => ({
        url: `/delete-account`,
        method: "POST",
        body: { userId },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: [{ type: "User", id: "CURRENT" }],
    }),
  }),
});

export const {
  useInitiateLoginMutation,
  useVerifyOtpMutation,
  useResetAccountMutation,
  useSetPinMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRegisterMutation,
} = userApiSlice;
