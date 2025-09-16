"use client";

import BottomNav from "@/components/ui/BottomNav";
import { FaBus, FaTicketAlt, FaPlus, FaCircleNotch, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGetTodaySeatsBookedQuery } from "@/utils/redux/api/busSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/utils/redux/slices/authSlice";
import Image from "next/image";
import { useEffect } from "react";
import AuthGuard from "@/components/wrapper/AuthGuard";

export default function HomePage() {
  const router = useRouter();

  const {
    data,
    isLoading: busLoading,
    refetch,
  } = useGetTodaySeatsBookedQuery();

  const user = useSelector(selectCurrentUser);
  const profilePic = useSelector((state) => state.profile.profilePic);
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
      : "SB";

  const totalTrips = data?.totalTrips ?? 0;
  const totalSeatsBooked = data?.totalSeatsBooked ?? 0;

  useEffect(() => {
    if (user?.token) {
      refetch(); // ensure it runs after auth is ready
    }
  }, [user?.token, refetch]);

  const handleAddBus = () => {
    router.push("/buses?add=true");
  };

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      
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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/account")}
          >
            {profilePic ? (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={profilePic}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-semibold">
                {initials}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-800">
                {user?.firstName || user?.lastName
                  ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
                  : "Unknown Owner"}
              </div>
              <div className="text-sm text-gray-500">Bus Owner</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-5xl mx-auto animate-fadeInUp">
          <div className="bg-white px-4 pt-4 pb-3 rounded-lg shadow flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-3">Total Trips</div>
              <div className="text-2xl font-semibold text-gray-800">
                {busLoading ? (
                  <FaCircleNotch className="animate-spin text-gray-400" />
                ) : (
                  totalTrips
                )}
              </div>
              <div className="flex flex-row gap-1 cursor-pointer"
                onClick={() => router.push("/offline-booking")}>
                 <p className="text-xs md:text-sm text-primary font-bold">View All Trips</p>
              <FaArrowRight size={17} className="text-primary pt-1"/>
              </div>
             
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
              <div className="text-2xl font-semibold text-gray-800">
                {busLoading ? (
                  <FaCircleNotch className="animate-spin text-gray-400" />
                ) : (
                  totalSeatsBooked
                )}
              </div>
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

    </AuthGuard>
  );
}