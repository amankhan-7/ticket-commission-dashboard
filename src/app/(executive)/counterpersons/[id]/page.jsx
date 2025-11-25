"use client";

import { useParams } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const executives = [
  {
    id: 1,
    name: "Arun Prakash",
    employeeId: "CNT001",
    totalSales: 185000,
    totalCommission: 49950,
    month: "November 2025",
    performance: "Excellent",
    transactions: 42,
    history: [
      {
        date: "2025-11-02",
        ticket: "TKT000912",
        name: "Rjesh",
        amount: 5200,
        commission: 1404,
      },
      {
        date: "2025-11-05",
        ticket: "TKT000934",
        name: "Ashok",
        amount: 3100,
        commission: 837,
      },
      {
        date: "2025-11-11",
        ticket: "TKT000945",
        name: "Rajkumar",
        amount: 4600,
        commission: 1242,
      },
    ],
  },
  {
    id: 2,
    name: "Neha Bansal",
    employeeId: "CNT002",
    totalSales: 152000,
    totalCommission: 41040,
    month: "November 2025",
    performance: "Good",
    transactions: 36,
    history: [
      {
        date: "2025-11-03",
        ticket: "TKT000876",
        name: "Rjesh",
        amount: 4100,
        commission: 1107,
      },
      {
        date: "2025-11-06",
        ticket: "TKT000889",
        name: "Dinesh",
        amount: 3800,
        commission: 1026,
      },
    ],
  },
];

export default function ExecutiveDetails() {
  const { id } = useParams();
  const exec = executives.find((e) => e.id === Number(id));

  if (!exec) {
    return (
      <div className="p-10 text-center text-gray-600">Executive not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <BottomNav />

      <h1 className="text-4xl font-bold mb-0 bg-gradient-to-r from-[#013881] via-[#014fb5] to-blue-100 bg-clip-text text-transparent">
        {exec.name}
      </h1>
      <p className="text-gray-700 mb-8 text-sm">
        Counter Person ID: {exec.employeeId}
      </p>

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
            ₹{exec.totalSales.toLocaleString()}
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
            ₹{exec.totalCommission.toLocaleString()}
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow-lg p-6 border-t-4"
          style={{ borderTopColor: "#004AAD" }}
        >
          <div className="text-gray-600 text-sm font-semibold uppercase">
            Transactions
          </div>
          <div className="text-3xl font-bold">{exec.transactions}</div>
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
              <th className="px-6 py-3  text-xs font-bold uppercase">
                Ticket No
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-bold uppercase">
                Passenger Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                Commission
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {exec.history.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 text-center">
                <td className="px-6 py-4">{row.ticket}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.name}</td>
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
