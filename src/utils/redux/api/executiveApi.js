import { apiSlice } from "./apiSlice"; // baseUrl: /api/v1/counter

export const ticketExecutiveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // =======================
    // CREATE EXECUTIVE
    // =======================
    createTicketExecutive: builder.mutation({
      query: (body) => ({
        url: "/ticket-executive/onboarding/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TicketExecutive"],
    }),

    // =======================
    // GET ALL EXECUTIVES
    // =======================
    getAllTicketExecutives: builder.query({
      query: (params) => ({
        url: "/ticket-executive",
        method: "GET",
        params, // { tenentId, status, page, limit, search }
      }),
      providesTags: ["TicketExecutive"],
    }),

    // =======================
    // GET EXECUTIVES BY TENANT
    // =======================
    getExecutivesByTenent: builder.query({
      query: ({ tenentId, page, limit }) => ({
        url: `/ticket-executive/tenent/${tenentId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["TicketExecutive"],
    }),

    // =======================
    // GET EXECUTIVE BY ID
    // =======================
    getTicketExecutiveById: builder.query({
      query: (executiveId) => ({
        url: `/ticket-executive/${executiveId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "TicketExecutive", id }],
    }),

    // =======================
    // UPDATE EXECUTIVE
    // =======================
    updateTicketExecutive: builder.mutation({
      query: ({ executiveId, body }) => ({
        url: `/ticket-executive/${executiveId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "TicketExecutive",
        { type: "TicketExecutive", id: arg.executiveId },
      ],
    }),

    // =======================
    // CHANGE EXECUTIVE PIN
    // =======================
    changeTicketExecutivePin: builder.mutation({
      query: ({ executiveId, body }) => ({
        url: `/ticket-executive/${executiveId}/change-pin`,
        method: "PATCH",
        body, // { currentPin, newPin }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "TicketExecutive", id: arg.executiveId },
      ],
    }),

    // =======================
    // GET EXECUTIVE STATS
    // =======================
    getTicketExecutiveStats: builder.query({
      query: (executiveId) => ({
        url: `/ticket-executive/${executiveId}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "TicketExecutiveStats", id },
      ],
    }),

    // =======================
    // ASSIGN COUNTER
    // =======================
    assignCounterToExecutive: builder.mutation({
      query: ({ executiveId, counterPersonId }) => ({
        url: `/ticket-executive/${executiveId}/assign-counter`,
        method: "POST",
        body: { counterPersonId },
      }),
      invalidatesTags: ["TicketExecutive"],
    }),

    // =======================
    // REMOVE COUNTER
    // =======================
    removeCounterFromExecutive: builder.mutation({
      query: ({ executiveId, counterPersonId }) => ({
        url: `/ticket-executive/${executiveId}/remove-counter`,
        method: "POST",
        body: { counterPersonId },
      }),
      invalidatesTags: ["TicketExecutive"],
    }),

  }),
});

export const {
  useCreateTicketExecutiveMutation,
  useGetAllTicketExecutivesQuery,
  useGetExecutivesByTenentQuery,
  useGetTicketExecutiveByIdQuery,
  useUpdateTicketExecutiveMutation,
  useChangeTicketExecutivePinMutation,
  useGetTicketExecutiveStatsQuery,
  useAssignCounterToExecutiveMutation,
  useRemoveCounterFromExecutiveMutation,
} = ticketExecutiveApi;


// POST   /ticket-executive/onboarding/create
// GET    /ticket-executive
// GET    /ticket-executive/tenent/:tenentId
// GET    /ticket-executive/:executiveId
// PATCH  /ticket-executive/:executiveId
// PATCH  /ticket-executive/:executiveId/change-pin
// GET    /ticket-executive/:executiveId/stats
// POST   /ticket-executive/:executiveId/assign-counter
// POST   /ticket-executive/:executiveId/remove-counter
