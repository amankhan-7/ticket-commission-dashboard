"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllTicketExecutivesQuery } from "@/utils/redux/api/executiveApi";

import { FaTicketAlt } from "react-icons/fa";
import Navbar from "@/components/ui/navbar";

export default function ExecutiveCommission() {
  const router = useRouter();

  // Fetch from RTK Query
  // const { data, isLoading, isError } = useGetAllTicketExecutivesQuery({
  //   page: 1,
  //   limit: 50,
  // });

  // TEMP STATIC MOCK DATA (same shape as mapped UI data)
const mockExecutives = [
  {
    id: "exec12345",
    name: "Ravi Kumar",
    employeeId: "EMP001",
    totalSales: 125000,
    totalCommission: 6250,
    month: "November 2025",
    performance: "Good",
    transactions: 42,
  },
  {
    id: "EXE002",
    name: "Priya Verma",
    employeeId: "EMP002",
    totalSales: 98000,
    totalCommission: 4900,
    month: "November 2025",
    performance: "Excellent",
    transactions: 51,
  },
  {
    id: "EXE003",
    name: "Amit Raj",
    employeeId: "EMP003",
    totalSales: 54000,
    totalCommission: 2700,
    month: "November 2025",
    performance: "Average",
    transactions: 28,
  },
  {
    id: "EXE004",
    name: "Sneha Iyer",
    employeeId: "EMP004",
    totalSales: 193000,
    totalCommission: 9650,
    month: "November 2025",
    performance: "Excellent",
    transactions: 63,
  },
];
 
const executives = mockExecutives;
  // Map backend → UI-friendly executive objects
  // const executives = useMemo(() => {
  //   if (!data?.ticketExecutives) return [];

  //   return data.ticketExecutives.map((ex) => ({
  //     id: ex._id,
  //     name: `${ex.firstName} ${ex.lastName}`,
  //     employeeId: ex._id.slice(-6).toUpperCase(), // fake ID derived from _id
  //     totalSales: ex.walletBalance || 0, // backend has no sales → fallback
  //     totalCommission: Math.round((ex.walletBalance || 0) * 0.05), // fake 5% commission
  //     month: "November 2025", // static because backend has no month
  //     performance: "N/A", // backend doesn't have performance
  //     transactions: ex.assignedCounters?.length || 0, // using # of counters as proxy
  //   }));
  // }, [data]);

  const totalCommission = executives.reduce((sum, ex) => sum + ex.totalCommission, 0);
  const totalSales = executives.reduce((sum, ex) => sum + ex.totalSales, 0);

  // if (isLoading) return <div className="text-center py-20">Loading...</div>;
  // if (isError) return <div className="text-center py-20">Error loading executives</div>;

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
  <Navbar />

  <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 mt-7 md:mt-14 md:pb-6 lg:ml-18">
     <div className="max-w-5xl mx-auto w-full">
         <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-8 
      bg-gradient-to-r from-[#003374] via-[#004aad] to-blue-200 
      bg-clip-text text-transparent">
      Executive Commission Overview
    </h1>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
        <div className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Sales</div>
        <div className="text-3xl font-bold text-black">₹{totalSales.toLocaleString()}</div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
        <div className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Commission Paid</div>
        <div className="text-3xl font-bold text-black">₹{totalCommission.toLocaleString()}</div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4" style={{ borderTopColor: "#004AAD" }}>
        <div className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Executives</div>
        <div className="text-3xl font-bold text-black">{executives.length}</div>
      </div>
    </div>

    {/* EXECUTIVE TABLE */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-[#004AAD]">
        <h2 className="text-2xl font-bold text-white flex items-center gap-4">
          Executives Performance List
          <FaTicketAlt size={40} className="rotate-50 md:pr-5 md:pt-5" />
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Ext. ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Sales</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Commission</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Transactions</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black uppercase tracking-wider">Performance</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {executives.map((ex) => (
              <tr
                key={ex.id}
                onClick={() => router.push(`/admin/ticket-executives/${ex.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{ex.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{ex.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{ex.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">₹{ex.totalSales.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center" style={{ color: "#004AAD" }}>
                  ₹{ex.totalCommission.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-black">{ex.transactions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{ex.performance}</td>
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
