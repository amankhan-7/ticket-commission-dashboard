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

    getCounterPersonDocuments: builder.query({
      query: (counterPersonId) => `/onboarding/${counterPersonId}/documents`,
      providesTags: (result, error, id) => [{ type: "CounterPerson", id }],
    }),
    uploadDocument: builder.mutation({
      query: ({ counterPersonId, documentType, file }) => {
        const formData = new FormData();
        formData.append("documentType", documentType);
        formData.append("file", file);
        return {
          url: `/onboarding/${counterPersonId}/documents`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (r, e, { counterPersonId }) => [
        { type: "CounterPerson", id: counterPersonId },
      ],
    }),

    deleteDocument: builder.mutation({
      query: ({ counterPersonId, documentId }) => ({
        url: `/onboarding/${counterPersonId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
    cancelCounterBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings/cancel",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CounterBookings", "CounterBookingStats"],
    }),

    // =======================
    // ADMIN SIDE ENDPOINTS
    // =======================

    getPendingCounterPersons: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/admin/pending?page=${page}&limit=${limit}`,
      providesTags: ["counterPerson"],
    }),

    getCounterPersonForVerification: builder.query({
      query: (counterPersonId) => `/admin/verification/${counterPersonId}`,
      transformResponse: (response) => response.data.counterPerson,
      providesTags: (result, error, id) => [
        { type: "CounterPerson", id },
        "VerificationStatus",
      ],
    }),

    verifyDocument: builder.mutation({
      query: ({ counterPersonId, documentId, body }) => ({
        url: `/admin/verify-document/${counterPersonId}/${documentId}`,
        method: "PATCH",
        body,
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
      query: ({ counterPersonId, reason }) => ({
        url: `/admin/reject/${counterPersonId}`,
        method: "PATCH",
        body: { reason },
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
      transformResponse: (response) => response.data,
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
  // =======================
  // USER HOOKS
  // =======================
  useCreateCounterPersonMutation,
  useGetCounterPersonDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useCancelCounterBookingMutation,

  // =======================
  // ADMIN HOOKS
  // =======================
  useGetPendingCounterPersonsQuery,
  useGetCounterPersonForVerificationQuery,
  useVerifyDocumentMutation,
  useApproveCounterPersonMutation,
  useRejectCounterPersonMutation,
  useGetCounterPersonVerificationStatusQuery,

  // =======================
  // COUNTER BOOKING HOOKS
  // =======================
  useCreateCounterBookingMutation,
  useGetCounterBookingQuery,
  useGetCounterBookingStatsQuery,
  useGetCounterRouteSeatLayoutQuery,
  useLockSeatsForBookingMutation,
  useCreateOfflineBookingMutation,
  useGetOfflineBookingHistoryQuery,
} = counterPersonApi;
