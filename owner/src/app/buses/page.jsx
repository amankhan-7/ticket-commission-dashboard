"use client";

import BottomNav from "@/components/ui/BottomNav";
import {
  FaEdit,
  FaTrash,
  FaRoute,
  FaChair,
  FaPlus,
  FaRupeeSign,
  FaBus,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { Wifi, Usb, FileText, ClipboardCheck, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AuthGuard from "@/components/wrapper/AuthGuard";
import {
  useUpdateBusMutation,
  useAddBusMutation,
  useDeleteBusMutation,
  useGetAllBusesQuery,
  useBulkAddBusMutation,
} from "@/utils/redux/api/busSlice";
import {
  useGetBusRoutesQuery,
  useUpdateBusRoutesMutation,
} from "@/utils/redux/api/routeSlice";
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
import AddBusForm from "@/components/buses/AddBusForm";

export default function BusesPage() {
  const searchParams = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrivers, setSelectedDrivers] = useState(null);
  const [showRouteEditor, setShowRouteEditor] = useState(false);
  const [editingRoutes, setEditingRoutes] = useState([]);
  const routeEditorRef = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const [addBus, { isLoading: isAdding }] = useAddBusMutation();
  const [updateBus, { isLoading: isUpdating }] = useUpdateBusMutation();
  const [deleteBus, { isLoading: isDeleting }] = useDeleteBusMutation();
  const { data, isLoading, refetch } = useGetAllBusesQuery();
  const [addBulkBus, { isLoading: isLoadingBulkRoutes }] =
    useBulkAddBusMutation();
  const fallbackBuses = [
    { _id: 1, date: "2025-08-09", totalSeats: 40, seatsBooked: 24 },
  ];
  const buses = data?.buses ?? fallbackBuses;
  // const chartData = buses.map((bus) => ({
  //   date: bus.date,
  //   totalSeats: bus.totalSeats ?? 20,
  //   seatsBooked: bus.seatsBooked ?? 18,
  // }));

  const { data: driverList = [], isLoading: driversLoading } =
    useGetDriversQuery();
  const [assignDriver, { isLoading: isAssigning }] = useAssignDriverMutation();

  const { data: busRoutesData, isLoading: routesLoading } = useGetBusRoutesQuery(
    { busId: selectedBusId },
    { skip: !selectedBusId || !showRouteEditor }
  );
  const [updateBusRoutes, { isLoading: isUpdatingRoutes }] = useUpdateBusRoutesMutation();

  const USERS_PER_PAGE = 6;
  const totalPages = Math.ceil(buses.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedBuses = buses.slice(startIndex, startIndex + USERS_PER_PAGE);

  const user = useSelector(selectCurrentUser);
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
      : "SB";

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

  useEffect(() => {
    if (selectedDrivers !== null) {
      safeLocalStorage.setItem("selectedDrivers", selectedDrivers);
    }
  }, [selectedDrivers]);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowForm(true);
    }
  }, [searchParams, buses?.length]);

  const [busData, setBusData] = useState({
    busNumber: "",
    busName: "",
    baseRouteFrom: "",
    baseRouteTo: "",
    basePrice: "",
    totalSeats: "",
    seatingCapacity: "",
    busType: "",
    amenities: "",
    registrationNumber: "",
    insuranceExpiry: "",
    permitExpiry: "",
    yearOfManufacture: "",
  });

  const [bulkBusData, setBulkBusData] = useState({
    busNumber: "",
    busName: "",
    routeFrom: "",
    routeTo: "",
    startDate: "",
    endDate: "",
    departureTime: "",
    arrivalTime: "",
    basePrice: "",
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
          stopType:
            bulkBusData.routeStops.length === 0 ? "start" : "intermediate",
          arrivalTime: null,
          departureTime: null,
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


  const [isBulkCreating, setIsBulkCreating] = useState(false);

  const safeParseDate = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const handleEditRoutes = (busId) => {
    setSelectedBusId(busId);
    setShowRouteEditor(true);
    setEditingRoutes([]);
    
    setTimeout(() => {
      routeEditorRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 100);
  };

  const handleRouteChange = (routeIndex, field, value) => {
    const updatedRoutes = [...editingRoutes];
    if (!updatedRoutes[routeIndex]) {
      updatedRoutes[routeIndex] = {};
    }
    updatedRoutes[routeIndex][field] = value;
    setEditingRoutes(updatedRoutes);
  };

  const handleRouteStopChange = (routeIndex, stopIndex, field, value) => {
    const updatedRoutes = [...editingRoutes];
    if (!updatedRoutes[routeIndex]) {
      updatedRoutes[routeIndex] = { routeStops: [] };
    }
    if (!updatedRoutes[routeIndex].routeStops) {
      updatedRoutes[routeIndex].routeStops = [];
    }
    if (!updatedRoutes[routeIndex].routeStops[stopIndex]) {
      updatedRoutes[routeIndex].routeStops[stopIndex] = {};
    }
    updatedRoutes[routeIndex].routeStops[stopIndex][field] = value;
    setEditingRoutes(updatedRoutes);
  };

  const addRouteEditorStop = (routeIndex) => {
    const updatedRoutes = [...editingRoutes];
    if (!updatedRoutes[routeIndex]) {
      updatedRoutes[routeIndex] = { routeStops: [] };
    }
    if (!updatedRoutes[routeIndex].routeStops) {
      updatedRoutes[routeIndex].routeStops = [];
    }
    updatedRoutes[routeIndex].routeStops.push({
      name: "",
      district: "",
      stopOrder: updatedRoutes[routeIndex].routeStops.length + 1,
      stopType: "intermediate",
      arrivalTime: null,
      departureTime: null,
      haltDuration: 0,
      priceFromMain: 0,
      priceToMain: 0,
      customPrice: null,
      distanceFromMain: 0,
      distanceToMain: 0,
      facilities: [],
      notes: "",
    });
    setEditingRoutes(updatedRoutes);
  };

  const removeRouteStop = (routeIndex, stopIndex) => {
    const updatedRoutes = [...editingRoutes];
    if (updatedRoutes[routeIndex]?.routeStops) {
      updatedRoutes[routeIndex].routeStops.splice(stopIndex, 1);
      updatedRoutes[routeIndex].routeStops.forEach((stop, index) => {
        stop.stopOrder = index + 1;
      });
    }
    setEditingRoutes(updatedRoutes);
  };

  const handleSaveRoutes = async () => {
    try {
      const routesToUpdate = editingRoutes.filter(route => route.routeId);
      if (routesToUpdate.length === 0) {
        toast.error("No routes to update");
        return;
      }

      await updateBusRoutes({
        busId: selectedBusId,
        routes: routesToUpdate,
      }).unwrap();

      toast.success("Routes updated successfully");
      setShowRouteEditor(false);
      setEditingRoutes([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to update routes:", error);
      toast.error(error?.data?.message || "Failed to update routes");
    }
  };

  useEffect(() => {
    if (busRoutesData?.routes && showRouteEditor) {
      setEditingRoutes(busRoutesData.routes.map(route => ({
        routeId: route._id,
        routeFrom: route.routeFrom,
        routeTo: route.routeTo,
        departureTime: safeParseDate(route.departureTime),
        arrivalTime: safeParseDate(route.arrivalTime),
        basePrice: route.basePrice,
        routeStops: (route.routeStops || []).map(stop => ({
          ...stop,
          arrivalTime: safeParseDate(stop.arrivalTime),
          departureTime: safeParseDate(stop.departureTime),
        })),
      })));
    }
  }, [busRoutesData, showRouteEditor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      busName: busData.busName,
      busNumber: busData.busNumber,
      baseRouteFrom: titleCase(busData.baseRouteFrom),
      baseRouteTo: titleCase(busData.baseRouteTo),
      totalSeats: busData.totalSeats ? Number(busData.totalSeats) : null,
      seatingCapacity: busData.seatingCapacity
        ? Number(busData.seatingCapacity)
        : null,
      basePrice: busData.basePrice ? Number(busData.basePrice) : null,
      busType: busData.busType,
      amenities: busData.amenities
        ? busData.amenities.split(",").map((a) => a.trim())
        : [],
      registrationNumber: busData.registrationNumber,
      insuranceExpiry: busData.insuranceExpiry || null,
      permitExpiry: busData.permitExpiry || null,
      yearOfManufacture: busData.yearOfManufacture
        ? Number(busData.yearOfManufacture)
        : null,
    };

    console.log("Payload ready to send:", payload);

    const requiredFields = [
      "busName",
      "busNumber",
      "baseRouteFrom",
      "baseRouteTo",
      "totalSeats",
      "seatingCapacity",
      "basePrice",
      "registrationNumber",
    ];

    for (let field of requiredFields) {
      if (!payload[field]) {
        toast.error(`Please fill ${field}`);
        return;
      }
    }

    try {
      let result;

      if (editMode && selectedBusId) {
        // Update bus
        result = await updateBus({ routeId: selectedBusId, ...payload });
      } else {
        // Add new bus
        result = await addBus(payload);
      }

      console.log("API raw result:", result);

      // Unwrap to throw if error
      await result.unwrap?.();

      // Success feedback
      toast.success(
        editMode ? "Bus updated successfully" : "Bus added successfully"
      );
      if (!editMode) refetch();

      // Reset form
      setBusData({
        busName: "",
        busNumber: "",
        baseRouteFrom: "",
        baseRouteTo: "",
        totalSeats: "",
        seatingCapacity: "",
        basePrice: "",
        busType: "",
        amenities: "",
        registrationNumber: "",
        insuranceExpiry: "",
        permitExpiry: "",
        yearOfManufacture: "",
      });

      setEditMode(false);
      setSelectedBusId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit failed:", error);

      // Detailed RTK Query error info
      if (error?.data) {
        console.error("Server response:", error.data);
        toast.error(error.data.message || "Server returned an error");
      } else if (error?.status) {
        console.error("Status code:", error.status);
        toast.error(`Request failed with status ${error.status}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      busId: selectedBusId,
      startDate: bulkBusData.startDate,
      endDate: bulkBusData.endDate,
      routeFrom: titleCase(bulkBusData.routeFrom),
      routeTo: titleCase(bulkBusData.routeTo),
      departureTime: bulkBusData.departureTime,
      arrivalTime: bulkBusData.arrivalTime,
      basePrice: bulkBusData.basePrice ? Number(bulkBusData.basePrice) : null,
      routeStops: bulkBusData.routeStops || [],
      frequency: bulkBusData.frequency || "daily",
      notes: bulkBusData.notes || "",
      restrictions: bulkBusData.restrictions || [],
      tags: bulkBusData.tags || [],
    };

    console.log("Bulk payload ready to send:", payload);

    // Required fields check
    const requiredFields = [
      // "busId",
      "startDate",
      "endDate",
      "routeFrom",
      "routeTo",
      "departureTime",
      "arrivalTime",
      "basePrice",
    ];

    for (let field of requiredFields) {
      if (!payload[field]) {
        console.error("Missing field:", field, "Value:", payload[field]);
        toast.error(`Please fill ${field}`);
        return; // exits before mutation
      }
    }

    try {
      // Call mutation with unwrap directly
      const res = await addBulkBus(payload).unwrap();

      console.log("Bulk API result:", res);
      toast.success("Bulk routes created successfulliyy");

      // Reset form
      setBulkBusData({
        busNumber: "",
        busName: "",
        routeFrom: "",
        routeTo: "",
        startDate: "",
        endDate: "",
        departureTime: "",
        arrivalTime: "",
        basePrice: "",
        totalSeats: "32",
        frequency: "daily",
        daysOfWeek: [],
        routeStops: [],
      });
      setShowBulkForm(false);
    } catch (error) {
      console.error("Bulk submit failed:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const bulkFormRef = useRef(null);
  const handleOpenBulkForm = () => {
    setShowBulkForm(true);

    setTimeout(() => {
      bulkFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const showFormRef = useRef(null);
  const handleOpenBusForm = () => {
    setShowForm(true);

    setTimeout(() => {
      showFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  function titleCase(str) {
    if (typeof str !== "string") return str;
    return str
      .trim()
      .replace(
        /\S+/gu,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
  }

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
        <BottomNav />

        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
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

        <div className=" max-w-5xl mx-auto w-full mb-8">
          <div className="flex justify-between items-center gap-3">
            <h2 className="text-[#004aad] text-[22px] font-semibold pl-1">
              Your Buses
            </h2>

            <div className="flex gap-2 pr-1">
              <button
                onClick={handleOpenBusForm}
                className="flex items-center text-xs gap-2 bg-[#004aad] text-white h-8 px-4 py-2 rounded hover:bg-[#0056b3] transition cursor-pointer"
              >
                <FaPlus />
                Add Buses
              </button>

            </div>
          </div>
        </div>

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
              : paginatedBuses.map((bus) => (
                  <div
                    key={bus._id}
                    className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div
                      className={`flex justify-between items-center px-4 py-3.5 border-b border-gray-200 
                           ${bus.status === "active" ? "bg-[#d5ffe7]" : "bg-white"}`}
                    >
                      <h2 className="text-base font-semibold text-gray-800">
                        {bus.busName}
                        <p className="font-light text-xs text-gray-500">
                          {bus.busNumber}
                        </p>
                      </h2>
                      <div className="flex items-center gap-2 text-[#004aad]">
                        <button
                          title="Add New Route"
                          onClick={() => {
                            setShowBulkForm(true);
                            setEditMode(true);
                            setSelectedBusId(bus._id);
                            handleOpenBulkForm();
                            setBulkBusData({
                              busId: bus._id || selectedBusId ||"",
                              busNumber: bus.busNumber || "",
                              busName: bus.busName || "",
                              routeFrom: bus.baseRouteFrom || "",
                              routeTo: bus.baseRouteTo || "",
                              startDate: "", // user must select
                              endDate: "", // user must select
                              departureTime: "",
                              arrivalTime: "",
                              basePrice: bus.basePrice?.toString() || "",
                              totalSeats: bus.totalSeats?.toString() || "32",
                              frequency: "daily",
                              routeStops:
                                bus.routeAliases?.map((alias, idx) => ({
                                  stopType: alias.stopType || `Stop ${idx + 1}`,
                                  name: alias.name || "",
                                  district: alias.district || "",
                                  arrivalTime: alias.arrivalTime
                                    ? new Date(alias.arrivalTime)
                                    : null,
                                  departureTime: alias.departureTime
                                    ? new Date(alias.departureTime)
                                    : null,
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
                              seatingCapacity:
                                bus.seatingCapacity?.toString() || "",
                              basePrice: bus.basePrice?.toString() || "",
                              busType: bus.busType || "",
                              amenities: bus.amenities
                                ? bus.amenities.join(", ")
                                : "",
                              registrationNumber: bus.registrationNumber || "",
                              insuranceExpiry: bus.insuranceExpiry || "",
                              permitExpiry: bus.permitExpiry || "",
                              yearOfManufacture:
                                bus.yearOfManufacture?.toString() || "",
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

                    <div className="flex flex-col justify-between gap-2 px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaRoute className="text-[#004aad]" />
                        <span>
                          {bus.baseRouteFrom} → {bus.baseRouteTo}
                        </span>
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

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Wifi className="text-[#004aad]" size={16} />
                        <span>{bus.amenities?.join(", ")}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FaIdCard className="text-[#004aad]" />
                        <span>{bus.registrationNumber}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <FileText className="text-[#004aad]" size={16} />
                        <span>{bus.insuranceExpiry}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <ClipboardCheck className="text-[#004aad]" size={16} />
                        <span>{bus.permitExpiry}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Calendar className="text-[#004aad]" size={16} />
                        <span>{bus.yearOfManufacture}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa] text-sm text-gray-700">
                      <label className="font-medium">Driver:</label>
                      <select
                        className="border border-gray-300 font-semibold rounded px-2 py-1 w-full md:w-56 text-sm focus:outline-none focus:ring focus:ring-[#0056b3]"
                        onChange={(e) =>
                          assignDriver({
                            driverId: e.target.value,
                            busId: bus._id,
                          })
                        }
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
                            disabled={
                              driver.assignedTo && driver.assignedTo !== bus._id
                            }
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

        {/* {showForm && (
          <section
            className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp"
            ref={showFormRef}
          >
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              {editMode ? "Update Bus" : "Add New Bus"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={busData.busName || ""}
                  onChange={handleChange}
                  placeholder="Enter bus name"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

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
                  value={busData.busNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter bus number"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="baseRouteFrom"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Route From
                </label>
                <input
                  id="baseRouteFrom"
                  name="baseRouteFrom"
                  value={busData.baseRouteFrom || ""}
                  onChange={handleChange}
                  placeholder="Enter starting location"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="baseRouteTo"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Route To
                </label>
                <input
                  id="baseRouteTo"
                  name="baseRouteTo"
                  value={busData.baseRouteTo || ""}
                  onChange={handleChange}
                  placeholder="Enter destination location"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
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
                  value={busData.totalSeats || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 40"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="seatingCapacity"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Seating Capacity
                </label>
                <input
                  id="seatingCapacity"
                  name="seatingCapacity"
                  value={busData.seatingCapacity || ""}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 40"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="basePrice"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="busType"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="amenities"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Amenities (comma separated, e.g., WiFi, USB Charging, Water
                  Bottle)
                </label>
                <input
                  id="amenities"
                  name="amenities"
                  value={busData.amenities || ""}
                  onChange={handleChange}
                  placeholder="e.g., USB Charging, WiFi"
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="insuranceExpiry"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="permitExpiry"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="yearOfManufacture"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Year of Manufacture
                </label>
                <input
                  id="yearOfManufacture"
                  name="yearOfManufacture"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={busData.yearOfManufacture || ""}
                  onChange={handleChange}
                  placeholder="e.g., 2022"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                />
              </div>

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
                  className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer"
                >
                  {editMode ? "Update Bus" : "Add Bus"}
                </button>
              </div>
            </form>
          </section>
        )}  */}

         <AddBusForm
        showFormRef={showFormRef}
        showForm={showForm}
        setShowForm={setShowForm}
        editMode={editMode}
        handleSubmit={handleSubmit}
        busData={busData}
        handleChange={handleChange}
      /> 

        {showBulkForm && (
          <section
            className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-5xl mx-auto w-full animate-fadeInUp"
            ref={bulkFormRef}
          >
            <h2 className="text-[#004aad] mb-4 text-lg font-semibold">
              Bulk Route Creation (6 Months)
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Create routes for all 6 months at once. This will generate buses
              for the specified frequency and date range.
            </p>

            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Bus Number
                  </label>
                  <input
                    value={bulkBusData.busNumber}
                    onChange={(e) =>
                      setBulkBusData({
                        ...bulkBusData,
                        busNumber: e.target.value,
                      })
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
                      setBulkBusData({
                        ...bulkBusData,
                        busName: e.target.value,
                      })
                    }
                    placeholder="e.g., Express 1"
                    type="text"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    From City
                  </label>
                  <input
                    value={bulkBusData.routeFrom}
                    onChange={(e) =>
                      setBulkBusData({
                        ...bulkBusData,
                        routeFrom: e.target.value,
                      })
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
                      setBulkBusData({
                        ...bulkBusData,
                        routeTo: e.target.value,
                      })
                    }
                    placeholder="e.g., Pune"
                    type="text"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    value={bulkBusData.startDate}
                    onChange={(e) =>
                      setBulkBusData({
                        ...bulkBusData,
                        startDate: e.target.value,
                      })
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
                      setBulkBusData({
                        ...bulkBusData,
                        endDate: e.target.value,
                      })
                    }
                    type="date"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Departure Time
                  </label>
                  <DatePicker
                    selected={safeParseDate(bulkBusData.departureTime)}
                    onChange={(time) =>
                      setBulkBusData({ ...bulkBusData, departureTime: time })
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select departure time"
                    className="w-auto md:w-80 p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Arrival Time
                  </label>
                  <DatePicker
                    selected={safeParseDate(bulkBusData.arrivalTime)}
                    onChange={(time) =>
                      setBulkBusData({ ...bulkBusData, arrivalTime: time })
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select arrival time"
                    className="w-auto md:w-80 p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <select
                    value={bulkBusData.frequency}
                    onChange={(e) =>
                      setBulkBusData({
                        ...bulkBusData,
                        frequency: e.target.value,
                      })
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
                    value={bulkBusData.basePrice}
                    onChange={(e) =>
                      setBulkBusData({ ...bulkBusData, basePrice: e.target.value })
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
                      setBulkBusData({
                        ...bulkBusData,
                        totalSeats: e.target.value,
                      })
                    }
                    placeholder="e.g., 32"
                    type="number"
                    className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                  />
                </div>
              </div>

              {bulkBusData.frequency === "weekly" && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Days of Week
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={bulkBusData.daysOfWeek.includes(index + 1)}
                          onChange={(e) => {
                            const dayNumber = index + 1;
                            if (e.target.checked) {
                              setBulkBusData({
                                ...bulkBusData,
                                daysOfWeek: [
                                  ...bulkBusData.daysOfWeek,
                                  dayNumber,
                                ],
                              });
                            } else {
                              setBulkBusData({
                                ...bulkBusData,
                                daysOfWeek: bulkBusData.daysOfWeek.filter(
                                  (d) => d !== dayNumber
                                ),
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
                      {/* <button
                        type="button"
                        onClick={() => updateRouteStop(index)}
                        className="bg-[#004aad] text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
                      >
                        UpdateRoutes
                      </button> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">
                          Stop Name
                        </label>
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) =>
                            updateRouteStop(index, "name", e.target.value)
                          }
                          className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          District
                        </label>
                        <input
                          type="text"
                          value={stop.district}
                          onChange={(e) =>
                            updateRouteStop(index, "district", e.target.value)
                          }
                          className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Arrival Time
                        </label>
                        <DatePicker
                          selected={safeParseDate(stop.arrivalTime)}
                          onChange={(time) =>
                            updateRouteStop(index, "arrivalTime", time)
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa" // 12-hour format with AM/PM
                          placeholderText="Select arrival time"
                          className="w-full md:w-115 p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Departure Time
                        </label>
                        <DatePicker
                          selected={safeParseDate(stop.departureTime)}
                          onChange={(time) =>
                            updateRouteStop(index, "departureTime", time)
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          placeholderText="Select departure time"
                          className="w-full md:w-115 p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Halt Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={
                            isNaN(stop.haltDuration) ? "" : stop.haltDuration
                          }
                          onChange={(e) =>
                            updateRouteStop(
                              index,
                              "haltDuration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Distance From Main (km)
                        </label>
                        <input
                          type="number"
                          value={
                            isNaN(stop.distanceFromMain)
                              ? ""
                              : stop.distanceFromMain
                          }
                          onChange={(e) =>
                            updateRouteStop(
                              index,
                              "distanceFromMain",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Distance To Main (km)
                        </label>
                        <input
                          type="number"
                          value={
                            isNaN(stop.distanceToMain)
                              ? ""
                              : stop.distanceToMain
                          }
                          onChange={(e) =>
                            updateRouteStop(
                              index,
                              "distanceToMain",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">
                        Notes
                      </label>
                      <textarea
                        value={stop.notes}
                        onChange={(e) =>
                          updateRouteStop(index, "notes", e.target.value)
                        }
                        className="w-full p-2 border placeholder-gray-500 border-slate-200 rounded-lg text-sm font-normal focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
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

              <div className="flex justify-center md:justify-end w-full gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBulkCreating}
                  className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkCreating
                    ? "Creating Routes..."
                    : "Create Routes for 12 Months"}
                </button>
              </div>
            </form>
          </section>
        )}

        {showRouteEditor && (
          <section 
            ref={routeEditorRef}
            className="bg-white rounded-[12px] p-6 mt-10 mb-6 shadow max-w-6xl mx-auto w-full animate-fadeInUp"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#004aad] text-lg font-semibold">
                Edit Routes for {busRoutesData?.bus?.busName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRouteEditor(false);
                    setEditingRoutes([]);
                    // Scroll back to top when closing route editor
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoutes}
                  disabled={isUpdatingRoutes}
                  className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition disabled:opacity-50"
                >
                  {isUpdatingRoutes ? "Saving..." : "Save Routes"}
                </button>
              </div>
            </div>

            {routesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad]"></div>
              </div>
            ) : editingRoutes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No routes found for this bus.
              </div>
            ) : (
              <div className="space-y-6">
                {editingRoutes.map((route, routeIndex) => (
                  <div key={route.routeId || routeIndex} className="border border-gray-300 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Route {routeIndex + 1}: {route.routeFrom} → {route.routeTo}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From
                        </label>
                        <input
                          type="text"
                          value={route.routeFrom || ""}
                          onChange={(e) => handleRouteChange(routeIndex, "routeFrom", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To
                        </label>
                        <input
                          type="text"
                          value={route.routeTo || ""}
                          onChange={(e) => handleRouteChange(routeIndex, "routeTo", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Departure Time
                        </label>
                        <DatePicker
                          selected={safeParseDate(route.departureTime)}
                          onChange={(time) => handleRouteChange(routeIndex, "departureTime", time)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Arrival Time
                        </label>
                        <DatePicker
                          selected={safeParseDate(route.arrivalTime)}
                          onChange={(time) => handleRouteChange(routeIndex, "arrivalTime", time)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Price
                        </label>
                        <input
                          type="number"
                          value={route.basePrice || ""}
                          onChange={(e) => handleRouteChange(routeIndex, "basePrice", parseFloat(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                        />
                      </div>
                    </div>

                    {/* Route Stops */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-semibold text-gray-700">Route Stops</h4>
                        <button
                          type="button"
                          onClick={() => addRouteEditorStop(routeIndex)}
                          className="px-3 py-1 bg-[#004aad] text-white rounded text-sm hover:bg-[#00348a] transition"
                        >
                          + Add Stop
                        </button>
                      </div>

                      {route.routeStops?.map((stop, stopIndex) => (
                        <div key={stopIndex} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Stop {stopIndex + 1} ({stop.stopType})
                            </span>
                            {stop.stopType !== "start" && stop.stopType !== "end" && (
                              <button
                                type="button"
                                onClick={() => removeRouteStop(routeIndex, stopIndex)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Stop Name</label>
                              <input
                                type="text"
                                value={stop.name || ""}
                                onChange={(e) => handleRouteStopChange(routeIndex, stopIndex, "name", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">District</label>
                              <input
                                type="text"
                                value={stop.district || ""}
                                onChange={(e) => handleRouteStopChange(routeIndex, stopIndex, "district", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Arrival Time</label>
                              <DatePicker
                                selected={safeParseDate(stop.arrivalTime)}
                                onChange={(time) => handleRouteStopChange(routeIndex, stopIndex, "arrivalTime", time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Departure Time</label>
                              <DatePicker
                                selected={safeParseDate(stop.departureTime)}
                                onChange={(time) => handleRouteStopChange(routeIndex, stopIndex, "departureTime", time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Price From Main</label>
                              <input
                                type="number"
                                value={stop.priceFromMain || ""}
                                onChange={(e) => handleRouteStopChange(routeIndex, stopIndex, "priceFromMain", parseFloat(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Price To Main</label>
                              <input
                                type="number"
                                value={stop.priceToMain || ""}
                                onChange={(e) => handleRouteStopChange(routeIndex, stopIndex, "priceToMain", parseFloat(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#004aad]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}
