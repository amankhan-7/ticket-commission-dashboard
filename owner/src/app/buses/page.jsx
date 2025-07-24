"use client";

import BottomNav from "@/components/UI/BottomNav";
import {
  FaEdit,
  FaTrash,
  FaRoute,
  FaClock,
  FaChair,
  FaPlus,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addBus,
  editBus,
  deleteBus,
} from "@/utils/redux/features/buses/busesSlice";

export default function BusesPage() {
  const searchParams = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);

  const dispatch = useDispatch();
  const busInfo = useSelector((state) => state.buses); //

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowForm(true);
    }
  }, [dispatch, searchParams, busInfo.length]);

  const [busData, setBusData] = useState({
    busName: "",
    from: "",
    to: "",
    departureTime: "",
    numberOfSeats: "",
    ticketPrice: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBus = {
      id: editMode ? selectedBusId : Date.now(),
      name: busData.busName,
      route: `${busData.from} - ${busData.to}`,
      time: busData.departureTime,
      seats: busData.numberOfSeats,
      price: busData.ticketPrice,
    };

    if (editMode) {
      dispatch(editBus(newBus));
    } else {
      dispatch(addBus(newBus));
    }

    // Reset form
    setEditMode(false);
    setSelectedBusId(null);
    setBusData({
      busName: "",
      from: "",
      to: "",
      departureTime: "",
      numberOfSeats: "",
      ticketPrice: "",
    });
    setShowForm(false);
  };

  const drivers = [
    { id: 1, name: "Rajesh Kumar" },
    { id: 2, name: "Sunil Patil" },
    { id: 3, name: "Amit Sharma" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <BottomNav />

      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <h1 className="text-xl font-semibold text-[#004aad] mb-4 md:mb-0">
            Buses
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
            {busInfo.map((bus) => (
              <div
                key={bus.id}
                className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-800">
                    {bus.name}
                  </h2>
                  <div className="flex items-center gap-2 text-[#004aad]">
                    <button
                      title="Edit Bus"
                      onClick={() => {
                        setShowForm(true);
                        setEditMode(true);
                        setSelectedBusId(bus.id);
                        setBusData({
                          busName: bus.name,
                          from: bus.route.split(" - ")[0],
                          to: bus.route.split(" - ")[1],
                          departureTime: bus.time,
                          numberOfSeats: bus.seats,
                          ticketPrice: bus.price,
                        });
                      }}
                      className="bg-[#007bff1a] hover:bg-[#007bff33] py-2 pl-2 pr-1.5 rounded-lg transition duration-200"
                    >
                      <FaEdit className="text-[#004aad]" />
                    </button>
                    <button
                      onClick={() => dispatch(deleteBus(bus.id))}
                      title="Delete Bus"
                      className="bg-[#007bff1a] hover:bg-[#007bff33] p-2 rounded-lg transition duration-200"
                    >
                      <FaTrash className="text-[#004aad]" />
                    </button>
                  </div>
                </div>

                {/* Bus Details */}
                <div className="flex flex-wrap justify-between gap-2 px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaRoute className="text-[#004aad]" />
                    <span>{bus.route}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaClock className="text-[#004aad]" />
                    <span>{bus.time}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <FaChair className="text-[#004aad]" />
                    <span>{bus.seats}</span>
                  </div>
                </div>

                {/* Driver Dropdown */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] text-sm text-gray-700">
                  <label className="font-medium">Driver:</label>
                  <select
                    className="border border-gray-300 font-semibold rounded px-2 py-1 w-full md:w-56 text-sm focus:outline-none focus:ring focus:ring-[#0056b3]"
                    defaultValue=""
                  >
                    <option value="" className="font-semibold" disabled>
                      Assign Driver
                    </option>
                    {drivers.map((driver) => (
                      <option
                        key={driver.id}
                        className="font-semibold"
                        value={driver.id}
                      >
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <section className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full">
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              Add New Bus
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              {/* From and To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="from"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    From
                  </label>
                  <input
                    id="from"
                    name="from"
                    value={busData.from}
                    onChange={(e) =>
                      setBusData({ ...busData, from: e.target.value })
                    }
                    placeholder="Departure City"
                    type="text"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="to"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    To
                  </label>
                  <input
                    id="to"
                    name="to"
                    value={busData.to}
                    onChange={(e) =>
                      setBusData({ ...busData, to: e.target.value })
                    }
                    placeholder="Arrival City"
                    type="text"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {/* Departure Time & Number of Seats */}
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
                    value={busData.departureTime}
                    onChange={(e) =>
                      setBusData({ ...busData, departureTime: e.target.value })
                    }
                    type="time"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-medium focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="numberOfSeats"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Number of Seats
                  </label>
                  <input
                    id="numberOfSeats"
                    name="numberOfSeats"
                    value={busData.numberOfSeats}
                    onChange={(e) =>
                      setBusData({ ...busData, numberOfSeats: e.target.value })
                    }
                    type="number"
                    min="1"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-medium focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {/* Ticket Price */}
              <div>
                <label
                  htmlFor="ticketPrice"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Ticket Price (₹)
                </label>
                <input
                  id="ticketPrice"
                  name="ticketPrice"
                  value={busData.ticketPrice}
                  onChange={(e) =>
                    setBusData({ ...busData, ticketPrice: e.target.value })
                  }
                  type="number"
                  placeholder="Enter Price"
                  min="0"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  className="bg-[#004aad] text-white px-6 py-2 rounded-sm text-xs font-base hover:hover:bg-[#0056b3] cursor-pointer transition duration-200"
                >
                  Save Bus
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setSelectedBusId(null);
                    setBusData({
                      busName: "",
                      from: "",
                      to: "",
                      departureTime: "",
                      numberOfSeats: "",
                      ticketPrice: "",
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
      </main>
    </div>
  );
}
