"use client";

import BottomNav from "@/components/UI/BottomNav";
import { FaBus, FaTicketAlt, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleAddBus = () => {
    router.push("/buses?add=true");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Sidebar Navigation */}
      <BottomNav />

      {/* Page Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <h1 className="text-xl font-semibold text-[#004aad] mb-4 sm:mb-0">
            Home
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-semibold">
              AR
            </div>
            <div>
              <div className="font-medium text-gray-800">Ankush Raj</div>
              <div className="text-sm text-gray-500">Bus Owner</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-5xl mx-auto animate-fadeInUp">
          <div className="bg-white px-4 pt-4 pb-3 rounded-lg shadow flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-3">Today's Trips</div>
              <div className="text-2xl font-semibold text-gray-800">3</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#004aad] text-white flex items-center justify-center">
              <FaBus />
            </div>
          </div>

          <div className="bg-white px-4 pt-4 pb-3 rounded-lg shadow flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-3">
                Seats Booked Today
              </div>
              <div className="text-2xl font-semibold text-gray-800">14</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        {/* Add Bus Button */}
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleAddBus}
            className="flex items-center text-xs gap-2 bg-[#004aad] text-white px-2 py-1.5 rounded hover:bg-[#0056b3] transition cursor-pointer"
          >
            <FaPlus />
            Quick Add Bus
          </button>
        </div>
      </main>
    </div>
  );
}
