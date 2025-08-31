import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "@/utils/redux/slices/authSlice";
import { safeLocalStorage } from "@/utils/localStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090";
const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/bus-owner`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    headers.set("User-Type", "busOwner"); 
    return headers;
  },
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
  const cleanArgs = (args) => {
    if (typeof args === "object" && args.method?.toUpperCase() === "GET") {
      const { body, ...rest } = args; // remove body
      return rest;
    }
    return args;
  };

  let result = await baseQuery(cleanArgs(args), api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data?.success) {
      result = await baseQuery(cleanArgs(args), api, extraOptions);
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
    "User",
    "Route",
    "Driver",
    "RouteStop",
    "RouteStats",
    "TodayTrips",
    "Bus",      
    "BusStats",
  ],
  endpoints: () => ({}),
});
