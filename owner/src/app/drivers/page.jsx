"use client";

import BottomNav from "@/components/UI/BottomNav";
import { useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaBus,
  FaPhone,
  FaCalendarCheck,
  FaCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useGetDriversQuery,
  useAddDriverMutation,
  useRemoveDriverMutation,
} from "@/utils/redux/api/driverSlice";
import { selectCurrentUser } from "@/utils/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function DriversPage() {
  const router = useRouter();

  const [driverPhone, setDriverPhone] = useState("");
  const [showForm, setShowForm] = useState(false);

  const user = useSelector(selectCurrentUser);
  const ownerId = user?._id;
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
      : "SB";

  const {
    data: driversList = [],
    isLoading,
    isError,
  } = useGetDriversQuery();
  const [addDriver, { isLoading: isAdding }] = useAddDriverMutation();
  const [removeDriver, { isLoading: isRemoving }] = useRemoveDriverMutation();

  const sortedDrivers = [...driversList].sort(
    (a, b) => (b.status === "Active") - (a.status === "Active")
  );

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await addDriver({ phoneNumber: driverPhone }).unwrap();
      console.log("Driver invitation sent successfully!");
      alert("Driver invitation sent successfully!");
      setDriverPhone(""); // Clear input after success
    } catch (err) {
      console.error("Failed to send driver invitation:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setDriverPhone("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this driver?"
    );
    if (!confirmed) return; // User cancelled

    try {
      await removeDriver({ id }).unwrap();
      console.log("Driver removed successfully");
    } catch (error) {
      console.error("Failed to remove driver:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Sidebar Navigation */}
      <BottomNav />

      {/* Page Content */}
      <main className="flex-1 px-4 pb-24 md:pb-6 md:px-10 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <h1 className="text-xl font-semibold text-[#004aad] mb-4 md:mb-0">
            Drivers
          </h1>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/account")}
          >
            <div className="w-10 h-10 rounded-full bg-[#004aad] text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
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

        {/* Section Header */}
        <div className="flex flex-row justify-between items-start max-w-5xl mx-auto w-full sm:items-center mb-2 gap-3 ">
          <h2 className="text-[#004aad] text-[22px] font-semibold">
            Your Drivers
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center text-xs gap-2 bg-[#004aad] text-white h-8 px-4 py-2 rounded hover:bg-[#0056b3] transition cursor-pointer"
          >
            <FaPlus />
            Add Drivers
          </button>
        </div>

        {/* Drivers List */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-6 max-w-5xl mx-auto w-full animate-fadeInUp">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-sm animate-pulse p-7"
                >
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/4"></div>
                </div>
              ))
            : sortedDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-800">
                      {driver.driverName}
                    </h2>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      disabled={isRemoving}
                      title="Remove Driver"
                      className="bg-[#007bff1a] text-[#004aad] hover:bg-[#007bff33] p-2 rounded-lg transition duration-200"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaBus className="text-[#28a745]" />
                      <span>
                        Assigned to:{" "}
                        <strong>
                          {driver.assignedTo ? driver.assignedTo : "None"}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-[#28a745]" />
                      <span>{driver.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarCheck className="text-[#28a745]" />
                      <span>Joined: {driver.joinedAt}</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 font-medium ${
                      driver.status === "Active"
                        ? "text-[#28a745] bg-[#e6f9ee]"
                        : "text-[#dc3545] bg-[#fdecea]"
                    }`}
                  >
                    <FaCircle className="text-xs" />
                    {driver.status}
                  </div>
                </div>
              ))}
        </div>

        {/* Add New Driver Form */}
        {showForm && (
          <section className="bg-white rounded-[12px] p-6 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp">
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              Add New Driver
            </h2>

            <form onSubmit={handleInvite}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="driverPhone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="driverPhone"
                    name="driverPhone"
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="Enter driver's phone number"
                    className="w-full p-2 placeholder-gray-400 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#004aad] text-white px-4 py-2 rounded-sm text-xs font-base hover:bg-[#0056b3] transition cursor-pointer duration-200 ease-in-out"
                >
                  Send Invitation
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white text-gray-600 text-xs font-base border border-gray-300 rounded-md px-3 py-2 hover:bg-[#f5f7fa] transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
