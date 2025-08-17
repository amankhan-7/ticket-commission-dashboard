"use client";

import BottomNav from "@/components/UI/BottomNav";
import {
  FaEdit,
  FaTrash,
  FaRoute,
  FaClock,
  FaChair,
  FaPlus,
  FaExchangeAlt,
  FaRupeeSign,
  FaTicketAlt,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useUpdateBusMutation,
  useAddBusMutation,
  useDeleteBusMutation,
  useGetAllBusesQuery,
} from "@/utils/redux/api/busSlice";
import {
  useGetDriversQuery,
  useAssignDriverMutation,
} from "@/utils/redux/api/driverSlice";
import { selectCurrentUser } from "@/utils/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { busSchema } from "@/utils/validations/form-validation";
import { useRouter } from "next/navigation";
import WeeklySeatsChart from "@/components/chart/WeeklySeatsChart";
import { safeLocalStorage } from "@/utils/localStorage";

export default function BusesPage() {
  const searchParams = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrivers, setSelectedDrivers] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const [addBus, { isLoading: isAdding }] = useAddBusMutation();
  const [updateBus, { isLoading: isUpdating }] = useUpdateBusMutation();
  const [deleteBus, { isLoading: isDeleting }] = useDeleteBusMutation();
  const { data, isLoading, refetch } = useGetAllBusesQuery();
  const fallbackBuses = [
    { _id: 1, date: "2025-08-09", totalSeats: 40, seatsBooked: 24 },
  ];
  const buses = data?.routes ?? fallbackBuses;
  const chartData = buses.map((bus) => ({
    date: bus.date,
    totalSeats: bus.totalSeats ?? 20,
    seatsBooked: bus.seatsBooked ?? 18,
  }));

  const { data: driverList = [], isLoading: driversLoading } =
    useGetDriversQuery();
  const [assignDriver, { isLoading: isAssigning }] = useAssignDriverMutation();

  const handleSwapRoute = () => {
    setBusData((prev) => {
      return {
        ...prev,
        routeFrom: prev.routeTo,
        routeTo: prev.routeFrom,
      };
    });
  };
  const USERS_PER_PAGE = 6;
  const totalPages = Math.ceil(buses.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedBuses = buses.slice(startIndex, startIndex + USERS_PER_PAGE);

  const user = useSelector(selectCurrentUser);
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
      : "SB";

  // Load on mount - same as you have
  useEffect(() => {
    async function loadSelectedDrivers() {
      const savedDrivers = await safeLocalStorage.getItem(
        "selectedDrivers",
        {}
      );
      setSelectedDrivers(savedDrivers);
    }
    loadSelectedDrivers();
  }, []);

  // Save only when selectedDrivers changes
  useEffect(() => {
    if (selectedDrivers !== null) {
      safeLocalStorage.setItem("selectedDrivers", selectedDrivers);
    }
  }, [selectedDrivers]);

  // handle showing form based on search param
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowForm(true);
    }
  }, [searchParams, buses?.length]);

  const [busData, setBusData] = useState({
    busNumber: "",
    busName: "",
    routeFrom: "",
    routeTo: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    totalSeats: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...busData,
      price: Number(busData.price),
      totalSeats: Number(busData.totalSeats),
    };

    try {
      if (editMode && selectedBusId) {
        await updateBus({ routeId: selectedBusId, ...payload }).unwrap();
        toast.success("Bus updated successfully");
      } else {
        await addBus(payload).unwrap();
        toast.success("Bus route added successfully");
        refetch();
      }

      setBusData({
        busName: "",
        busNumber: "",
        routeFrom: "",
        routeTo: "",
        departureTime: "",
        arrivalTime: "",
        date: "",
        price: "",
        totalSeats: "",
      });

      setEditMode(false);
      setSelectedBusId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAssignDriver = async (driverId, busId) => {
    if (driverId && busId) {
      try {
        setSelectedDrivers((prev) => ({
          ...prev,
          [busId]: driverId,
        }));
        await assignDriver({ id: driverId, busId }).unwrap();
      } catch (error) {
        console.error("Failed to assign driver", error);
        setSelectedDrivers((prev) => ({
          ...prev,
          [busId]: "",
        }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;
    try {
      await deleteBus(id).unwrap();
      toast.success("Bus deleted");
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <BottomNav />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <h1 className="text-xl font-semibold text-[#004aad] mb-4 md:mb-0">
            Buses
          </h1>
          <div
            className="flex items-center gap-3  cursor-pointer"
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

        {/* Top bar with title and add button */}
        <div className="flex flex-row sm:flex-row justify-between items-start max-w-5xl mx-auto w-full sm:items-center mb-4 gap-3">
          <h2 className="text-[#004aad] text-[22px] font-semibold">
            Your Buses
          </h2>
          <button
            onClick={(e) => setShowForm(true)}
            className="flex items-center text-xs gap-2 bg-[#004aad] text-white h-8 px-4 py-2 rounded hover:bg-[#0056b3] transition cursor-pointer"
          >
            <FaPlus />
            Add Buses
          </button>
        </div>

        {/* Bus Cards Grid */}
        <div className="max-w-5xl mx-auto w-full animate-fadeInUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white shadow rounded-sm animate-pulse p-4"
                  >
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/4"></div>
                  </div>
                ))
              : buses.map((bus) => (
                  <div
                    key={bus._id}
                    className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-800">
                        {bus.busName}
                        <p className="font-light text-xs text-gray-500">
                          {bus.busNumber}
                        </p>
                      </h2>
                      <div className="flex items-center gap-2 text-[#004aad]">
                        <button
                          title="Edit Bus"
                          onClick={() => {
                            setShowForm(true);
                            setEditMode(true);
                            setSelectedBusId(bus._id);
                            setBusData({
                              busNumber: bus.busNumber || "",
                              busName: bus.busName || "",
                              routeFrom: bus.routeFrom || "",
                              routeTo: bus.routeTo || "",
                              date: bus.date || "",
                              departureTime: bus.departureTime || "",
                              arrivalTime: bus.arrivalTime || "",
                              totalSeats: bus.totalSeats?.toString() || "",
                              price: bus.price?.toString() || "",
                            });
                          }}
                          className="bg-[#007bff1a] hover:bg-[#007bff33] py-2 pl-2 pr-1.5 rounded-lg transition duration-200"
                        >
                          <FaEdit className="text-[#004aad]" />
                        </button>
                        <button
                          onClick={() => handleDelete(bus._id)}
                          title="Delete Bus"
                          className="bg-[#007bff1a] hover:bg-[#007bff33] p-2 rounded-lg transition duration-200"
                        >
                          <FaTrash className="text-[#004aad]" />
                        </button>
                      </div>
                    </div>

                    {/* Bus Details */}
                    <div className="flex flex-col justify-between gap-2 px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaRoute className="text-[#004aad]" />
                        <span>
                          {bus.routeFrom} → {bus.routeTo}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaClock className="text-[#004aad]" />
                        <span>
                          {bus.departureTime} - {bus.arrivalTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaChair className="text-[#004aad]" />
                        <span>{bus.totalSeats}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaTicketAlt className="text-[#004aad]" />
                        <span>{bus.seatsBooked}</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaRupeeSign className="text-[#004aad]" />
                        <span>{bus.price}</span>
                      </div>
                    </div>

                    {/* Driver Dropdown */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] text-sm text-gray-700">
                      <label className="font-medium">Driver:</label>
                      <select
                        className="border border-gray-300 font-semibold rounded px-2 py-1 w-full md:w-56 text-sm focus:outline-none focus:ring focus:ring-[#0056b3]"
                        value={selectedDrivers[bus._id] || ""}
                        onChange={(e) =>
                          handleAssignDriver(e.target.value, bus._id)
                        }
                        disabled={isAssigning}
                      >
                        <option value="" className="font-semibold" disabled>
                          Assign Driver
                        </option>
                        {driverList.map((driver) => (
                          <option
                            disabled={
                              driver.assignedTo && driver.assignedTo !== bus._id
                            }
                            key={driver._id}
                            value={driver._id}
                            className="font-semibold"
                          >
                            {driver.driverName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 py-4 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold ${
                  currentPage === index + 1
                    ? "bg-[#004aad] text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <section className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp">
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              Add New Bus
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bus Number */}
              <div>
                <label
                  htmlFor="busNumber"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Bus Number
                </label>
                <input
                  id="busNumber"
                  name="busNumber"
                  value={busData.busNumber}
                  onChange={(e) =>
                    setBusData({ ...busData, busNumber: e.target.value })
                  }
                  placeholder="e.g., MH01 AB 1234"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] text-gray-700"
                />
              </div>

              {/* Bus Name */}
              <div>
                <label
                  htmlFor="busName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Bus Name
                </label>
                <input
                  id="busName"
                  name="busName"
                  value={busData.busName}
                  onChange={(e) =>
                    setBusData({ ...busData, busName: e.target.value })
                  }
                  placeholder="Enter bus name"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                />
              </div>

              {/* From and To with Swap Button */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
                {/* From */}
                <div>
                  <label
                    htmlFor="routeFrom"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    From
                  </label>
                  <input
                    id="routeFrom"
                    name="routeFrom"
                    value={busData.routeFrom}
                    onChange={(e) =>
                      setBusData({ ...busData, routeFrom: e.target.value })
                    }
                    placeholder="Departure City"
                    type="text"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>

                {/* Swap Icon Button */}
                <div className="flex justify-center items-center h-full pt-6">
                  <button
                    type="button"
                    onClick={handleSwapRoute}
                    className="text-[#004aad] hover:text-[#003580] transition text-xl p-2 rounded-full hover:bg-gray-100"
                    title="Swap From & To"
                  >
                    <FaExchangeAlt className="pointer-events-none" />
                  </button>
                </div>

                {/* To */}
                <div>
                  <label
                    htmlFor="routeTo"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    To
                  </label>
                  <input
                    id="routeTo"
                    name="routeTo"
                    value={busData.routeTo}
                    onChange={(e) =>
                      setBusData({ ...busData, routeTo: e.target.value })
                    }
                    placeholder="Arrival City"
                    type="text"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {/* Travel Date and Total Seats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Travel Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={busData.date}
                    onChange={(e) =>
                      setBusData({ ...busData, date: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalSeats"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Total Seats
                  </label>
                  <input
                    id="totalSeats"
                    name="totalSeats"
                    type="number"
                    min="1"
                    value={busData.totalSeats}
                    onChange={(e) =>
                      setBusData({ ...busData, totalSeats: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {/* Departure Time & Arrival Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="departureTime"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Departure Time
                  </label>
                  <input
                    id="departureTime"
                    name="departureTime"
                    type="time"
                    value={busData.departureTime}
                    onChange={(e) =>
                      setBusData({ ...busData, departureTime: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="arrivalTime"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Arrival Time
                  </label>
                  <input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    value={busData.arrivalTime}
                    onChange={(e) =>
                      setBusData({ ...busData, arrivalTime: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {/* Ticket Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Ticket Price (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={busData.price}
                  onChange={(e) =>
                    setBusData({ ...busData, price: e.target.value })
                  }
                  placeholder="Enter price"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-[#004aad] focus:ring-[#004aad] text-gray-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  className="bg-[#004aad] text-white px-6 py-2 rounded-sm text-xs font-base hover:bg-[#0056b3] cursor-pointer transition duration-200"
                >
                  {editMode
                    ? isUpdating
                      ? "Updating..."
                      : "Update"
                    : isAdding
                    ? "Saving..."
                    : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setSelectedBusId(null);
                    setBusData({
                      busNumber: "",
                      busName: "",
                      routeFrom: "",
                      routeTo: "",
                      date: "",
                      departureTime: "",
                      arrivalTime: "",
                      totalSeats: "",
                      price: "",
                    });
                  }}
                  className="bg-white text-gray-600 border border-gray-300 rounded-md px-4 py-2 text-xs font-base hover:bg-[#f5f7fa] transition duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <WeeklySeatsChart buses={chartData} />
      </main>
    </div>
  );
}
