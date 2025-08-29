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
} from "@/utils/redux/slices/busesSlice";

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
    busNumber:"",
  baseRouteFrom: "",
  baseRouteTo: "",
  basePrice: "",
  totalSeats:"",
  seatingCapacity: "",
  busType: "",
  amenities:"",
  registrationNumber: "",
  insuranceExpiry: "",
  permitExpiry: "",
  yearOfManufacture: ""
  });

  // Bulk creation state
  const [bulkBusData, setBulkBusData] = useState({
    busNumber: "",
    busName: "",
    routeFrom: "",
    routeTo: "",
    startDate: "",
    endDate:"",
    departureTime: "",
    arrivalTime: "",
    price: "",
    totalSeats: "32",
    frequency: "daily",
    daysOfWeek: [],
    routeStops: [],
  });

  const addRouteStop = () => {
  setBulkBusData({
    ...bulkBusData,
    routeStops: [
      ...bulkBusData.routeStops,
      {
        name: "",
        district: "",
        stopOrder: bulkBusData.routeStops.length + 1,
        stopType: bulkBusData.routeStops.length === 0 ? "start" : "intermediate",
        arrivalTime: "",
        departureTime: "",
        haltDuration: 0,
        priceFromMain: 0,
        priceToMain: 0,
        customPrice: null,
        distanceFromMain: 0,
        distanceToMain: 0,
        facilities: [],
        notes: "",
      },
    ],
  });
};

const updateRouteStop = (index, field, value) => {
  const updatedStops = [...bulkBusData.routeStops];
  updatedStops[index][field] = value;
  setBulkBusData({ ...bulkBusData, routeStops: updatedStops });
};

const removeRouteStop = (index) => {
  setBulkBusData({
    ...bulkBusData,
    routeStops: bulkBusData.routeStops.filter((_, i) => i !== index),
  });
};


  const [isBulkCreating, setIsBulkCreating] = useState(false);

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

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    
    if (!bulkBusData.busNumber || !bulkBusData.busName || !bulkBusData.routeFrom || 
        !bulkBusData.routeTo || !bulkBusData.startDate || !bulkBusData.departureTime || 
        !bulkBusData.arrivalTime || !bulkBusData.price|| !bulkBusData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (bulkBusData.frequency === 'weekly' && bulkBusData.daysOfWeek.length === 0) {
      alert('Please select at least one day of the week for weekly frequency');
      return;
    }

    setIsBulkCreating(true);
    
    try {
      const response = await fetch('/api/v1/bus-owner/buses/routes/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busNumber: bulkBusData.busNumber,
          busName: bulkBusData.busName,
          routeFrom: bulkBusData.routeFrom,
          routeTo: bulkBusData.routeTo,
          startDate: bulkBusData.startDate,
          endDate:bulkBusData.endDate,
          departureTime: bulkBusData.departureTime,
          arrivalTime: bulkBusData.arrivalTime,
          price: parseInt(bulkBusData.price),
          totalSeats: parseInt(bulkBusData.totalSeats),
          frequency: bulkBusData.frequency,
          daysOfWeek: bulkBusData.daysOfWeek,
          routeStops: bulkBusData.routeStops,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully created ${result.data.routesCreated} routes!`);
     
        setBulkBusData({
          busNumber: "",
          busName: "",
          routeFrom: "",
          routeTo: "",
          startDate: "",
          endDate:"",
          departureTime: "",
          arrivalTime: "",
          price: "",
          totalSeats: "32",
          frequency: "daily",
          daysOfWeek: [],
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Bulk creation failed:', error);
      alert('Failed to create routes. Please try again.');
    } finally {
      setIsBulkCreating(false);
    }
  };

  const drivers = [
    { id: 1, name: "Rajesh Kumar" },
    { id: 2, name: "Sunil Patil" },
    { id: 3, name: "Amit Sharma" },
  ];

  const handleChange = (e) => {
  const { name, value } = e.target;
  setBusData((prev) => ({
    ...prev,
    [name]: value,
  }));
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
          <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
>
 
</form>

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
          <section className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp">
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              Add New Bus
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
             {/* Bus Name */}
  <div>
    <label htmlFor="busName" className="block mb-2 text-sm font-medium text-gray-700">
      Bus Name
    </label>
    <input
      id="busName"
      name="busName"
      value={busData.busName}
      onChange={handleChange}
      placeholder="Enter bus name"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Bus Number */}
  <div>
    <label htmlFor="busNumber" className="block mb-2 text-sm font-medium text-gray-700">
      Bus Number
    </label>
    <input
      id="busNumber"
      name="busNumber"
      value={busData.busNumber || ""}
      onChange={handleChange}
      placeholder="Enter bus number"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Route From */}
  <div>
    <label htmlFor="from" className="block mb-2 text-sm font-medium text-gray-700">
      Route From
    </label>
    <input
      id="from"
      name="from"
      value={busData.from}
      onChange={handleChange}
      placeholder="Enter starting location"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Route To */}
  <div>
    <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-700">
      Route To
    </label>
    <input
      id="to"
      name="to"
      value={busData.to}
      onChange={handleChange}
      placeholder="Enter destination location"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Departure Time */}
  <div>
    <label htmlFor="departureTime" className="block mb-2 text-sm font-medium text-gray-700">
      Departure Time
    </label>
    <input
      id="departureTime"
      name="departureTime"
      value={busData.departureTime}
      onChange={handleChange}
      type="time"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Total Seats */}
  <div>
    <label htmlFor="totalSeats" className="block mb-2 text-sm font-medium text-gray-700">
      Total Seats
    </label>
    <input
      id="totalSeats"
      name="totalSeats"
      value={busData.totalSeats}
      onChange={handleChange}
      type="number"
      placeholder="e.g., 17"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>
 

  {/* Ticket Price */}
  <div>
    <label htmlFor="ticketPrice" className="block mb-2 text-sm font-medium text-gray-700">
      Ticket Price
    </label>
    <input
      id="ticketPrice"
      name="ticketPrice"
      value={busData.ticketPrice}
      onChange={handleChange}
      type="number"
      placeholder="Enter ticket price"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Base Price */}
  <div>
    <label htmlFor="basePrice" className="block mb-2 text-sm font-medium text-gray-700">
      Base Price
    </label>
    <input
      id="basePrice"
      name="basePrice"
      value={busData.basePrice || ""}
      onChange={handleChange}
      type="number"
      placeholder="Enter base price"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Bus Type */}
  <div>
    <label htmlFor="busType" className="block mb-2 text-sm font-medium text-gray-700">
      Bus Type
    </label>
    <select
      id="busType"
      name="busType"
      value={busData.busType || ""}
      onChange={handleChange}
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    >
      <option value="">Select Type</option>
      <option value="AC">AC</option>
      <option value="Non-AC">Non-AC</option>
      <option value="Sleeper">Sleeper</option>
    </select>
  </div>

  {/* Amenities */}
  <div>
    <label htmlFor="amenities" className="block mb-2 text-sm font-medium text-gray-700">
      Amenities (comma separated,('WiFi', 'USB Charging', 'Water Bottle', 'Snacks', 'Blanket', 'Pillow'))
    </label>
    <input
      id="amenities"
      name="amenities"
      value={busData.amenities || ""}
      onChange={(e) =>
        setBusData({ ...busData, amenities: e.target.value.split(",") })
      }
      placeholder="e.g., USB Charging, WiFi"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Registration Number */}
  <div>
    <label htmlFor="registrationNumber" className="block mb-2 text-sm font-medium text-gray-700">
      Registration Number
    </label>
    <input
      id="registrationNumber"
      name="registrationNumber"
      value={busData.registrationNumber || ""}
      onChange={handleChange}
      placeholder="e.g., MH01AB1234"
      type="text"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Insurance Expiry */}
  <div>
    <label htmlFor="insuranceExpiry" className="block mb-2 text-sm font-medium text-gray-700">
      Insurance Expiry
    </label>
    <input
      id="insuranceExpiry"
      name="insuranceExpiry"
      type="date"
      value={busData.insuranceExpiry || ""}
      onChange={handleChange}
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Permit Expiry */}
  <div>
    <label htmlFor="permitExpiry" className="block mb-2 text-sm font-medium text-gray-700">
      Permit Expiry
    </label>
    <input
      id="permitExpiry"
      name="permitExpiry"
      type="date"
      value={busData.permitExpiry || ""}
      onChange={handleChange}
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

  {/* Year of Manufacture */}
  <div>
    <label htmlFor="yearOfManufacture" className="block mb-2 text-sm font-medium text-gray-700">
      Year of Manufacture
    </label>
    <input
      id="yearOfManufacture"
      name="yearOfManufacture"
      type="date"
      value={busData.yearOfManufacture || ""}
      onChange={handleChange}
      placeholder="e.g., 2025"
      className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
    />
  </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition"
                >
                  {editMode ? "Update Bus" : "Add Bus"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Bulk Route Creation Form */}
        <section className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp">
          <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
            Bulk Route Creation (6 Months)
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Create routes for all 6 months at once. This will generate buses for the specified frequency and date range.
          </p>

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            {/* Basic Bus Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bus Number
                </label>
                <input
                  value={bulkBusData.busNumber}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, busNumber: e.target.value })
                  }
                  placeholder="e.g., MH01 AB 1234"
                  type="text"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bus Name
                </label>
                <input
                  value={bulkBusData.busName}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, busName: e.target.value })
                  }
                  placeholder="e.g., Express 1"
                  type="text"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
            </div>

            {/* Route Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  From City
                </label>
                <input
                  value={bulkBusData.routeFrom}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, routeFrom: e.target.value })
                  }
                  placeholder="e.g., Mumbai"
                  type="text"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  To City
                </label>
                <input
                  value={bulkBusData.routeTo}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, routeTo: e.target.value })
                  }
                  placeholder="e.g., Pune"
                  type="text"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
            </div>

            {/* Schedule Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  value={bulkBusData.startDate}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, startDate: e.target.value })
                  }
                  type="date"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
               <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  value={bulkBusData.endDate}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, endDate: e.target.value })
                  }
                  type="date"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Departure Time
                </label>
                <input
                  value={bulkBusData.departureTime}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, departureTime: e.target.value })
                  }
                  type="time"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Arrival Time
                </label>
                <input
                  value={bulkBusData.arrivalTime}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, arrivalTime: e.target.value })
                  }
                  type="time"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
            </div>

            {/* Frequency and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  value={bulkBusData.frequency}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, frequency: e.target.value })
                  }
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ticket Price (₹)
                </label>
                <input
                  value={bulkBusData.price}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, price: e.target.value })
                  }
                  placeholder="e.g., 500"
                  type="number"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Total Seats
                </label>
                <input
                  value={bulkBusData.totalSeats}
                  onChange={(e) =>
                    setBulkBusData({ ...bulkBusData, totalSeats: e.target.value })
                  }
                  placeholder="e.g., 32"
                  type="number"
                  className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>
            </div>

            {/* Weekly Frequency Options */}
            {bulkBusData.frequency === 'weekly' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={bulkBusData.daysOfWeek.includes(index + 1)}
                        onChange={(e) => {
                          const dayNumber = index + 1;
                          if (e.target.checked) {
                            setBulkBusData({
                              ...bulkBusData,
                              daysOfWeek: [...bulkBusData.daysOfWeek, dayNumber]
                            });
                          } else {
                            setBulkBusData({
                              ...bulkBusData,
                              daysOfWeek: bulkBusData.daysOfWeek.filter(d => d !== dayNumber)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-[#004aad] focus:ring-[#004aad]"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
         {/* Route Stops (Optional) */}
<div className="space-y-4">
  <label className="block text-gray-700 font-medium">
    Route Stops (Optional)
  </label>

  {bulkBusData.routeStops.map((stop, index) => (
    <div
      key={index}
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm space-y-3"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-gray-800 font-semibold">
          Stop {index + 1} ({stop.stopType})
        </h4>
        <button
          type="button"
          onClick={() => removeRouteStop(index)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Stop Name</label>
          <input
            type="text"
            value={stop.name}
            onChange={(e) => updateRouteStop(index, "name", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">District</label>
          <input
            type="text"
            value={stop.district}
            onChange={(e) => updateRouteStop(index, "district", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Arrival Time</label>
          <input
            type="time"
            value={stop.arrivalTime}
            onChange={(e) =>
              updateRouteStop(index, "arrivalTime", e.target.value)
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Departure Time</label>
          <input
            type="time"
            value={stop.departureTime}
            onChange={(e) =>
              updateRouteStop(index, "departureTime", e.target.value)
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Halt Duration (minutes)
          </label>
          <input
            type="number"
            value={stop.haltDuration}
            onChange={(e) =>
              updateRouteStop(index, "haltDuration", parseInt(e.target.value))
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Distance From Main (km)
          </label>
          <input
            type="number"
            value={stop.distanceFromMain}
            onChange={(e) =>
              updateRouteStop(
                index,
                "distanceFromMain",
                parseInt(e.target.value)
              )
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Distance To Main (km)
          </label>
          <input
            type="number"
            value={stop.distanceToMain}
            onChange={(e) =>
              updateRouteStop(
                index,
                "distanceToMain",
                parseInt(e.target.value)
              )
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Notes</label>
        <textarea
          value={stop.notes}
          onChange={(e) => updateRouteStop(index, "notes", e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>
  ))}

  <button
    type="button"
    onClick={addRouteStop}
    className="px-4 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition"
  >
    + Add Stop
  </button>
</div>



            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isBulkCreating}
                className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBulkCreating ? "Creating Routes..." : "Create Routes for 12 Months"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
