"use client";

import { useParams, useRouter } from "next/navigation";
// import {
//   useGetTicketExecutiveByIdQuery,
//   useGetTicketExecutiveStatsQuery,
// } from "@/redux/services/ticketExecutiveApi";
import Navbar from "@/components/ui/navbar";

// MOCK DATA FOR DEVELOPMENT
const MOCK_EXEC = {
  _id: "exec12345",
  firstName: "Ravi",
  lastName: "Kumar",
};

const MOCK_STATS = {
  totalSales: 127500,
  totalCommission: 15250,
  transactions: 26,
  history: [
    {
      ticketNo: "TK1001",
      date: "2025-02-10",
      passengerName: "Amit Sharma",
      amount: 3500,
      transactions: 9,
    },
    {
      ticketNo: "TK1002",
      date: "2025-02-11",
      passengerName: "Priya Verma",
      amount: 5400,
      transactions: 10,
    },
    {
      ticketNo: "TK1003",
      date: "2025-02-12",
      passengerName: "Rahul Singh",
      amount: 7200,
      transactions: 7,
    },
  ],
};

export default function ExecutiveDetails() {
  const { id } = useParams();
  const router = useRouter();

  // const {
  //   data: execData,
  //   isLoading: execLoading,
  //   isError: execError,
  // } = useGetTicketExecutiveByIdQuery(id);

  // const {
  //   data: statsData,
  //   isLoading: statsLoading,
  //   isError: statsError,
  // } = useGetTicketExecutiveStatsQuery(id);

  // if (execLoading || statsLoading)
  //   return <div className="p-10 text-center">Loading...</div>;

  // if (execError || statsError || !execData?.ticketExecutive)
  //   return (
  //     <div className="p-10 text-center text-gray-600">Executive not found.</div>
  //   );

  // const ex = execData.ticketExecutive;
  // const stats = statsData?.stats || {};
  const ex = MOCK_EXEC;
  const stats = MOCK_STATS;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 mt-8 md:mt-14 md:pb-6 lg:ml-18">

         <div className="max-w-5xl mx-auto w-full">

 <div className="flex flex-row justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-0 bg-gradient-to-r from-[#013881] via-[#014fb5] to-blue-200 bg-clip-text text-transparent">
              {ex.firstName} {ex.lastName}
            </h1>

            <p className="text-gray-700 text-sm">Executive ID: {ex._id}</p>
          </div>

          <button
            onClick={() => router.push(`/admin/add-counter?executiveId=${id}`)}
            className="px-5 py-4 bg-[#004AAD] text-white font-bold rounded-lg 
             shadow-xl shadow-gray-100 hover:opacity-90 active:scale-[0.98] transition"
          >
            Add Counter
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase">
              Total Sales
            </div>
            <div className="text-3xl font-bold">
              ₹{(stats.totalSales || 0).toLocaleString()}
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase">
              Total Commission
            </div>
            <div className="text-3xl font-bold">
              ₹{(stats.totalCommission || 0).toLocaleString()}
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase">
              Transactions
            </div>
            <div className="text-3xl font-bold">{stats.transactions || 0}</div>
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="px-6 py-4 bg-[#004AAD]">
            <h2 className="text-2xl font-bold text-white">Counter Persons</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-max w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Ticket No
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Transactions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {(stats.history || []).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 text-center">
                    <td className="px-6 py-4">{row.ticketNo}</td>
                    <td className="px-6 py-4">{row.date}</td>
                    <td className="px-6 py-4">{row.passengerName}</td>
                    <td className="px-6 py-4">
                      ₹{row.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#004AAD]">
                      {row.transactions.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
         </div>
       
      </main>
    </div>
  );
}
