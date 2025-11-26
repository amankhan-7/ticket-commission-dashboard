"use client";

import { useParams } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import {
  useGetTicketExecutiveByIdQuery,
  useGetTicketExecutiveStatsQuery,
} from "@/redux/services/ticketExecutiveApi";

export default function ExecutiveDetails() {
  const { id } = useParams();

  const {
    data: execData,
    isLoading: execLoading,
    isError: execError,
  } = useGetTicketExecutiveByIdQuery(id);

  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetTicketExecutiveStatsQuery(id);

  if (execLoading || statsLoading)
    return <div className="p-10 text-center">Loading...</div>;

  if (execError || statsError || !execData?.ticketExecutive)
    return (
      <div className="p-10 text-center text-gray-600">
        Executive not found.
      </div>
    );

  const ex = execData.ticketExecutive;
  const stats = statsData?.stats || {};

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <BottomNav />

      <h1 className="text-4xl font-bold mb-0 bg-gradient-to-r from-[#013881] via-[#014fb5] to-blue-100 bg-clip-text text-transparent">
        {ex.firstName} {ex.lastName}
      </h1>

      <p className="text-gray-700 mb-8 text-sm">
        Executive ID: {ex._id}
      </p>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
          <div className="text-gray-600 text-sm font-semibold uppercase">Total Sales</div>
          <div className="text-3xl font-bold">
            ₹{(stats.totalSales || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
          <div className="text-gray-600 text-sm font-semibold uppercase">Total Commission</div>
          <div className="text-3xl font-bold">
            ₹{(stats.totalCommission || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
          <div className="text-gray-600 text-sm font-semibold uppercase">Transactions</div>
          <div className="text-3xl font-bold">{stats.transactions || 0}</div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-[#004AAD]">
          <h2 className="text-2xl font-bold text-white">Commission History</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-bold uppercase">Ticket No</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Passenger Name</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">Commission</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {(stats.history || []).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 text-center">
                <td className="px-6 py-4">{row.ticketNo}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.passengerName}</td>
                <td className="px-6 py-4">₹{row.amount.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-[#004AAD]">
                  ₹{row.commission.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
