import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/utils/redux/slices/authSlice";
import { safeLocalStorage } from "@/utils/localStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/counter`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const user = getState().auth.user;
    const token = user?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.success) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());
      safeLocalStorage.removeItem("user");
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
    tagTypes: [
    "BusSchedule",
    "Booking",
    "SeatMap",
    "BusAvailableSeats",
    "BookingDetails",
    "BookingStats",
    "Payment",
    "Coupon",
    "ticketExecutive",      
    "Documents",           
    "VerificationStatus", 
    "PendingCounterPersons",
    "AvaiableSeats",
    "Bookings",
    "counterPerson"
  ],
  endpoints: () => ({}),
});
