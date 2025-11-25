"use client";

import React, { useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaBus,
  FaUser,
  FaCog,
  FaTicketAlt,
  FaPercentage,
  FaMoneyBillWave,
  FaCoins,
  FaHandHoldingUsd,
  FaFileInvoiceDollar,
  FaReceipt,
} from "react-icons/fa";

export default function ExecutiveCommission() {
  const router = useRouter();
  const [executives, setExecutives] = useState([
    {
      id: 1,
      name: "Arun Prakash",
      employeeId: "CNT001",
      totalSales: 185000,
      totalCommission: 16950,
      month: "November 2025",
      performance: "Excellent",
      transactions: 42,
    },
    {
      id: 2,
      name: "Neha Bansal",
      employeeId: "CNT002",
      totalSales: 152000,
      totalCommission: 11040,
      month: "November 2025",
      performance: "Good",
      transactions: 36,
    },
    {
      id: 3,
      name: "Rohit Sinha",
      employeeId: "CNT003",
      totalSales: 96000,
      totalCommission: 17920,
      month: "November 2025",
      performance: "Average",
      transactions: 24,
    },
  ]);

  const totalCommission = executives.reduce(
    (sum, ex) => sum + ex.totalCommission,
    0
  );

  const totalSales = executives.reduce((sum, ex) => sum + ex.totalSales, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <BottomNav />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#003374] via-[#004aad] to-blue-200 bg-clip-text text-transparent">
          Executive Commission Overview
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Total Sales
            </div>
            <div className="text-3xl font-bold text-black">
              ₹{totalSales.toLocaleString()}
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Total Commission Paid
            </div>
            <div className="text-3xl font-bold text-black">
              ₹{totalCommission.toLocaleString()}
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-lg p-6 border-t-4"
            style={{ borderTopColor: "#004AAD" }}
          >
            <div className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Total Executives
            </div>
            <div className="text-3xl font-bold text-black">
              {executives.length}
            </div>
          </div>
        </div>

        {/* EXECUTIVE TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-[#004AAD]">
            <h2 className="text-2xl font-bold text-white flex flex-row-2 justify-items-end items-center gap-4">
            
              Counter Officers Performance List
                <FaTicketAlt size={40} className="rotate-50 md:pr-5 md:pt-5"/>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Cnt. ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {executives.map((ex) => (
                  <tr
                    key={ex.id}
                    onClick={() => router.push(`/counterpersons/${ex.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {ex.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {ex.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {ex.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                      ₹{ex.totalSales.toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold"
                      style={{ color: "#004AAD" }}
                    >
                      ₹{ex.totalCommission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-black">
                      {ex.transactions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {ex.performance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
