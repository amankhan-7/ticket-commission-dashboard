// consumerBaseSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/utils/redux/slices/authSlice";
import { safeLocalStorage } from "@/utils/localStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Base query with re-auth logic
const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/consumer`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const token = getState().auth.user?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/refresh-token", method: "POST" },
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

// Consumer API slice
export const consumerBaseSlice = createApi({
  reducerPath: "consumerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Bus", "AvailableSeats", "BusSchedule"],
  endpoints: () => ({}),
});
