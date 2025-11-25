"use client";

import BottomNav from "@/components/ui/BottomNav";
import React, { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetCounterBookingQuery,
  useGetCounterBookingStatsQuery,
} from "@/utils/redux/api/adminExecutiveApi";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/wrapper/AuthGuard";

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isLoading } = useGetCounterBookingQuery(
    userId ? { counterPersonId: userId, page: 1, limit: 20 } : skipToken
  );

  const { data: statsResponse, isLoading: isLoadingStats } =
    useGetCounterBookingStatsQuery({
      counterPersonId: userId,
      startDate: null,
      endDate: null,
    });
  const bookings = data?.data?.bookings || [];
  const stats = statsResponse?.data?.stats || {};
  const {
    totalBookings = 0,
    totalRevenue = 0,
    totalCommission = 0,
    averageBookingValue = 0,
    todayBookings = 0,
    todayRevenue = 0,
  } = stats;

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <BottomNav />
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
          <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
            Bus Ticket Commission Dashboard
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div
              className="bg-white rounded-xl shadow-lg px-6 pt-7 border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="text-gray-600 text-sm font-semibold uppercase mb-0">
                Total Commission Earned
              </div>
              <div className="text-3xl font-bold text-black">
                ₹{totalCommission}
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Average Booking Value
              </div>
              <div className="text-3xl font-bold text-black">
                ₹{averageBookingValue}
              </div>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg p-6 border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Total Revenue
              </div>
              <div className="text-3xl font-bold text-black">
                ₹{totalRevenue}
              </div>
            </div>
            <div
              className="bg-white rounded-xl shadow-lg p-6 border-t-4"
              style={{ borderTopColor: "#004AAD" }}
            >
              <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
                Total Bookings
              </div>
              <div className="text-3xl font-bold text-black">
                {totalBookings}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#004aad]">
              <h2 className="text-2xl font-bold text-white">Booking List</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Passenger Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Seat no.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        {booking.bookingReference}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {booking.passengerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {booking.seatNumbers?.join(", ") || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(booking.journeyDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-md font-semibold text-black">
                        ₹{booking.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bookings.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No bookings yet. Click "Book a Ticket" to add one.
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
