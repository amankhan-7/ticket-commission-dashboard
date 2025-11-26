import { apiSlice } from "./apiSlice";

export const counterPersonApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =======================
    // USER SIDE ENDPOINTS
    // =======================

    createCounterPerson: builder.mutation({
      query: (body) => ({ url: `/create`, method: "POST", body }),
      invalidatesTags: ["CounterPerson"],
    }),

    uploadDocument: builder.mutation({
      query: ({ counterPersonId, documentType, file }) => {
        const formData = new FormData();
        formData.append("documentType", documentType);
        formData.append("file", file);
        return {
          url: `/${counterPersonId}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Documents"],
    }),

    getCounterPersonDocuments: builder.query({
      query: (counterPersonId) => `/${counterPersonId}/documents`,
      providesTags: (result, error, arg) => [{ type: "Documents", id: arg }],
    }),

    deleteDocument: builder.mutation({
      query: ({ counterPersonId, documentId }) => ({
        url: `/onboarding/${counterPersonId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),

    getPendingCounterPersons: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/admin/pending?page=${page}&limit=${limit}`,
      providesTags: ["CounterPerson"],
    }),

    // =======================
    // ADMIN SIDE ENDPOINTS
    // =======================

    verifyDocument: builder.mutation({
      query: ({ counterPersonId, documentId }) => ({
        url: `/onboarding/admin/verify-document/${counterPersonId}/${documentId}`,
        method: "PATCH",
      }),
      invalidatesTags: (r, e, { counterPersonId }) => [
        { type: "CounterPerson", id: counterPersonId },
        "VerificationStatus",
      ],
    }),

    approveCounterPerson: builder.mutation({
      query: (counterPersonId) => ({
        url: `/admin/approve/${counterPersonId}`,
        method: "PATCH",
      }),
      invalidatesTags: (r, e, counterPersonId) => [
        { type: "CounterPerson", id: counterPersonId },
        "PendingCounterPersons",
        "VerificationStatus",
      ],
    }),

    rejectCounterPerson: builder.mutation({
      query: ({ counterPersonId }) => ({
        url: `/onboarding/admin/reject/${counterPersonId}`,
        method: "PATCH",
      }),
      invalidatesTags: (r, e, { counterPersonId }) => [
        { type: "CounterPerson", id: counterPersonId },
        "PendingCounterPersons",
        "VerificationStatus",
      ],
    }),

    getCounterPersonVerificationStatus: builder.query({
      query: (counterPersonId) => `/verification-status/${counterPersonId}`,
      providesTags: (r, e, id) => [
        { type: "VerificationStatus", id },
        { type: "CounterPerson", id },
      ],
    }),

    getCounterPersonForVerification: builder.query({
      query: (counterPersonId) => `/onboarding/${counterPersonId}/documents`,
      providesTags: (result, error, id) => [{ type: "counterPerson", id }],
    }),

    // =======================
    // COUNTER BOOKING ENDPOINTS
    // =======================

    createCounterBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Bookings", "SeatMap"],
    }),

    getCounterBooking: builder.query({
      query: (params) => ({
        url: "/bookings",
        method: "GET",
        params,
      }),
      providesTags: ["Bookings"],
    }),

    getCounterBookingStats: builder.query({
      query: (params) => ({
        url: "/bookings/stats",
        method: "GET",
        params,
      }),
      providesTags: ["BookingStats"],
    }),

    cancelCounterBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/cancel",
        method: "POST",
        body,
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Bookings", "SeatMap"],
    }),
    getCounterRouteSeatLayout: builder.query({
      query: ({ routeId, journeyDate }) => ({
        url: `counter-booking/route/${routeId}/seat-layout/${journeyDate}`,
        method: "GET",
      }),
      providesTags: (result, error, { routeId }) => [
        { type: "SeatMap", id: routeId },
      ],
      transformResponse: (response) => response.data, // only if your backend wraps data
    }),

    lockSeatsForBooking: builder.mutation({
      query: ({ routeId, seatNumbers, journeyDate, counterPersonId }) => ({
        url: "/bookings/lock-seats",
        method: "POST",
        body: { routeId, seatNumbers, journeyDate, counterPersonId },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { routeId }) => [
        { type: "SeatMap", id: routeId },
      ],
    }),

    createOfflineBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Booking", "AvailableSeats"],
    }),
    getOfflineBookingHistory: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/bookings/offline-booking/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "BookingDetails", id })),
              "BookingDetails",
            ]
          : ["BookingDetails"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  // User hooks
  useCreateCounterPersonMutation,
  useUploadDocumentMutation,
  useGetCounterPersonDocumentsQuery,
  useDeleteDocumentMutation,
  useGetPendingCounterPersonsQuery,

  // Admin hooks
  useVerifyDocumentMutation,
  useApproveCounterPersonMutation,
  useRejectCounterPersonMutation,
  useGetCounterPersonVerificationStatusQuery,
  useGetCounterPersonForVerificationQuery,

  useCreateCounterBookingMutation,
  useGetCounterBookingQuery,
  useGetCounterBookingStatsQuery,
  useCancelCounterBookingMutation,
  useGetCounterRouteSeatLayoutQuery,
  useLockSeatsForBookingMutation,
  useCreateOfflineBookingMutation,
  useGetOfflineBookingHistoryQuery,
} = counterPersonApi;
