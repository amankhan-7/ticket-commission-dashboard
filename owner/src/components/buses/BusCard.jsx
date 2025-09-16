import React from "react";
import { FaPlus, FaRoute, FaEdit, FaTrash, FaChair, FaRupeeSign, FaBus, FaIdCard } from "react-icons/fa";
import { Wifi, FileText, ClipboardCheck, Calendar } from "lucide-react";

export default function BusCard({
  bus,
  driverList,
  isAssigning,
  assignDriver,
  handleEditRoutes,
  deleteBus,
  setShowBulkForm,
  setEditMode,
  setSelectedBusId,
  handleOpenBulkForm,
  setBulkBusData,
  setShowForm,
  handleOpenBusForm,
  setBusData,
}) {
  return (
    <div className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* HEADER */}
      <div
        className={`flex justify-between items-center px-4 py-3.5 border-b border-gray-200 
             ${bus.status === "active" ? "bg-[#d5ffe7]" : "bg-white"}`}
      >
        <h2 className="text-base font-semibold text-gray-800">
          {bus.busName}
          <p className="font-light text-xs text-gray-500">{bus.busNumber}</p>
        </h2>
        <div className="flex items-center gap-2 text-[#004aad]">
          {/* Action Buttons */}
          <button
            title="Add New Route"
            onClick={() => {
              setShowBulkForm(true);
              setEditMode(true);
              setSelectedBusId(bus._id);
              handleOpenBulkForm();
              setBulkBusData({
                busId: bus._id,
                busNumber: bus.busNumber || "",
                busName: bus.busName || "",
                routeFrom: bus.baseRouteFrom || "",
                routeTo: bus.baseRouteTo || "",
                startDate: "",
                endDate: "",
                departureTime: "",
                arrivalTime: "",
                basePrice: bus.basePrice?.toString() || "",
                totalSeats: bus.totalSeats?.toString() || "32",
                frequency: "daily",
                routeStops: bus.routeAliases?.map((alias, idx) => ({
                  stopType: alias.stopType || `Stop ${idx + 1}`,
                  name: alias.name || "",
                  district: alias.district || "",
                  arrivalTime: alias.arrivalTime ? new Date(alias.arrivalTime) : null,
                  departureTime: alias.departureTime ? new Date(alias.departureTime) : null,
                  haltDuration: alias.haltDuration || 0,
                  distanceFromMain: alias.distanceFromMain || 0,
                  distanceToMain: alias.distanceToMain || 0,
                  notes: alias.notes || "",
                })) || [],
              });
            }}
            className="bg-[#007bff1a] hover:bg-[#007bff33] py-1.5 px-1.5 rounded-lg transition duration-200"
          >
            <FaPlus className="text-[#004aad]" />
          </button>

          <button
            title="Edit Routes"
            onClick={() => handleEditRoutes(bus._id)}
            className="bg-[#007bff1a] hover:bg-[#007bff33] py-1.5 px-1.5 rounded-lg transition duration-200"
          >
            <FaRoute className="text-[#004aad]" />
          </button>

          <button
            title="Edit Bus"
            onClick={() => {
              setShowForm(true);
              setEditMode(true);
              setSelectedBusId(bus._id);
              handleOpenBusForm();
              setBusData({
                busNumber: bus.busNumber || "",
                busName: bus.busName || "",
                baseRouteFrom: bus.baseRouteFrom || "",
                baseRouteTo: bus.baseRouteTo || "",
                totalSeats: bus.totalSeats?.toString() || "",
                seatingCapacity: bus.seatingCapacity?.toString() || "",
                basePrice: bus.basePrice?.toString() || "",
                busType: bus.busType || "",
                amenities: bus.amenities ? bus.amenities.join(", ") : "",
                registrationNumber: bus.registrationNumber || "",
                insuranceExpiry: bus.insuranceExpiry || "",
                permitExpiry: bus.permitExpiry || "",
                yearOfManufacture: bus.yearOfManufacture?.toString() || "",
              });
            }}
            className="bg-[#007bff1a] hover:bg-[#007bff33] py-2 pl-2 pr-1.5 rounded-lg transition duration-200"
          >
            <FaEdit className="text-[#004aad]" />
          </button>

          <button
            onClick={() => deleteBus(bus._id)}
            title="Delete Bus"
            className="bg-[#007bff1a] hover:bg-[#007bff33] p-2 rounded-lg transition duration-200"
          >
            <FaTrash className="text-[#004aad]" />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col justify-between gap-2 px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaRoute className="text-[#004aad]" />
          <span>{bus.baseRouteFrom} → {bus.baseRouteTo}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaChair className="text-[#004aad]" />
          <span>{bus.totalSeats}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaRupeeSign className="text-[#004aad]" />
          <span>{bus.basePrice}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaBus className="text-[#004aad]" />
          <span>{bus.busType}</span>
        </div>

        {/* Render Amenities Only if Present */}
        {bus.amenities && bus.amenities.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Wifi className="text-[#004aad]" size={16} />
            <span>{bus.amenities.join(", ")}</span>
          </div>
        )}

        {bus.registrationNumber && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FaIdCard className="text-[#004aad]" />
            <span>{bus.registrationNumber}</span>
          </div>
        )}

        {bus.insuranceExpiry && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FileText className="text-[#004aad]" size={16} />
            <span>{bus.insuranceExpiry}</span>
          </div>
        )}

        {bus.permitExpiry && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ClipboardCheck className="text-[#004aad]" size={16} />
            <span>{bus.permitExpiry}</span>
          </div>
        )}

        {bus.yearOfManufacture && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="text-[#004aad]" size={16} />
            <span>{bus.yearOfManufacture}</span>
          </div>
        )}
      </div>

      {/* DRIVER SELECT */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] text-sm text-gray-700">
        <label className="font-medium">Driver:</label>
        <select
          className="border border-gray-300 font-semibold rounded px-2 py-1 w-full md:w-56 text-sm focus:outline-none focus:ring focus:ring-[#0056b3]"
          onChange={(e) => assignDriver({ driverId: e.target.value, busId: bus._id })}
          disabled={isAssigning}
          defaultValue=""
        >
          <option value="" className="font-semibold" disabled>
            Assign Driver
          </option>

          {driverList.map((driver) => (
            <option
              key={driver._id}
              value={driver._id}
              disabled={driver.assignedTo && driver.assignedTo !== bus._id}
              className="font-semibold"
            >
              {driver.driverName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
