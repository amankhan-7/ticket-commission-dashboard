"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/ui/BottomNav";
import {
  FaBus,
  FaSearch,
  FaTicketAlt,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaRupeeSign,
  FaRoute,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/utils/redux/slices/authSlice";
import {
  useGetOwnerBusesForBookingQuery,
  useGetBusStopsQuery,
  useSearchBusRoutesMutation,
  useGetRouteSeatLayoutQuery,
  useCreateOfflineBookingMutation,
} from "@/utils/redux/api/busSlice";
import BusLayoutContainer from "@/components/seats/bus-layout-container";
import PaymentOptions from "@/components/payment/PaymentOptions";
import PaymentScripts from "@/components/payment/PaymentScripts";
import { usePaymentHandlers } from "@/hooks/usePaymentHandlers";
import { PAYMENT_CONFIG } from "@/constants/payment";
import { legendItems } from "@/constants/seat-selection";
import { toast } from "sonner";

const OfflineBookingPage = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
      : "SB";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [step, setStep] = useState(1); // 1: Bus Selection, 2: Route Search, 3: Seat Selection, 4: Passenger Details, 5: Payment
  const [selectedBus, setSelectedBus] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Redux hooks
  const {
    data: buses = [],
    isLoading: busesLoading,
    error: busesError,
  } = useGetOwnerBusesForBookingQuery(undefined, {
    skip: !isClient, // Skip the query until client-side rendering
  });
  const {
    data: stops = [],
    isLoading: stopsLoading,
    error: stopsError,
  } = useGetBusStopsQuery(selectedBus, {
    skip: !selectedBus || !isClient,
  });
  const [searchRoutesMutation, { isLoading: searchLoading }] =
    useSearchBusRoutesMutation();
  const {
    data: seatLayout,
    isLoading: seatLoading,
    error: seatError,
  } = useGetRouteSeatLayoutQuery(
    { routeId: selectedRoute?._id, journeyDate },
    { skip: !selectedRoute || !journeyDate }
  );
  const [createBookingMutation, { isLoading: bookingLoading }] =
    useCreateOfflineBookingMutation();

  // Payment handlers
  const { processPayment, handlePaymentSuccess, handlePaymentFailure } =
    usePaymentHandlers(
      createBookingMutation,
      async (paymentData) => {
        // This will be handled by the backend confirm payment endpoint
        const response = await fetch(
          "http://localhost:9090/api/v1/bus-owner/offline-booking/confirm-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify(paymentData),
          }
        );
        return response.json();
      },
      setIsProcessingPayment,
      user
    );

  // Handle buses loading error
  useEffect(() => {
    if (busesError) {
      setError("Failed to load buses. Please try again.");
    }
  }, [busesError]);

  const searchRoutes = async () => {
    if (!selectedBus || !routeFrom || !routeTo || !journeyDate) {
      setError("Please fill all fields");
      return;
    }

    console.log("Searching routes with:", {
      busId: selectedBus,
      routeFrom,
      routeTo,
      journeyDate,
      journeyDateType: typeof journeyDate,
    });

    try {
      const result = await searchRoutesMutation({
        busId: selectedBus,
        routeFrom,
        routeTo,
        journeyDate,
      }).unwrap();

      setRoutes(result.routes || []);

      if (!result.routes || result.routes.length === 0) {
        setError(
          `No routes found for ${routeFrom} to ${routeTo} on ${journeyDate}. Please check if the route exists or try different locations.`
        );
      } else {
        setStep(2);
        setError("");
      }
    } catch (err) {
      setError(err.data?.message || err.message || "Failed to search routes");
    }
  };

  const selectRoute = (route) => {
    setSelectedRoute(route);
    setStep(3);
  };

  const toggleSeatSelection = (seatNumber) => {
    if (seatLayout.seats.seatMap[seatNumber - 1].status !== "available") {
      return; // Can't select unavailable seats
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const proceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }
    setStep(4);
    setError("");
  };

  const proceedToPayment = async () => {
    if (
      !passengerDetails.firstName ||
      !passengerDetails.lastName ||
      !passengerDetails.age ||
      !passengerDetails.gender ||
      !passengerDetails.email ||
      !passengerDetails.phone
    ) {
      setError("Please fill all passenger details");
      return;
    }

    try {
      setError("");
      setIsProcessingPayment(true);

      const bookingData = {
        routeId: selectedRoute._id,
        seatNumbers: selectedSeats,
        passengerDetails: {
          name: `${passengerDetails.firstName} ${passengerDetails.lastName}`.trim(),
          age: passengerDetails.age,
          gender: passengerDetails.gender,
          email: passengerDetails.email,
          phone: passengerDetails.phone,
        },
        journeyDate,
      };

      await processPayment(
        passengerDetails,
        bookingData,
        (response, bookingId, amount) => {
          handlePaymentSuccess(response, bookingId, amount);
          resetForm();
        },
        (error) => {
          handlePaymentFailure(error);
        }
      );
    } catch (error) {
      console.error("Payment processing error:", error);
      setError(error.message || "Failed to process payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  // Handle bus selection change
  const handleBusChange = (busId) => {
    setSelectedBus(busId);
    setRouteFrom("");
    setRouteTo("");
  };

  // Reset form to initial state
  const resetForm = () => {
    setStep(1);
    setSelectedBus("");
    setRouteFrom("");
    setRouteTo("");
    setJourneyDate("");
    setRoutes([]);
    setSelectedRoute(null);
    setSelectedSeats([]);
    setPassengerDetails({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
    });
    setError("");
    setIsProcessingPayment(false);
  };

  const renderStep1 = () => {
    // Debug: Log the buses data structure
    console.log("Buses data:", buses);
    console.log("Buses type:", typeof buses);
    console.log(
      "Buses length:",
      Array.isArray(buses) ? buses.length : "not an array"
    );
    console.log("Buses loading:", busesLoading);
    console.log("Buses error:", busesError);

    return (
      <div className="bg-white rounded-[12px] p-6 shadow max-w-2xl mx-auto animate-fadeInUp">
        <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
          <FaBus className="text-[#004aad]" />
          Select Bus
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="bus"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Select Bus
            </label>
            <select
              id="bus"
              value={selectedBus}
              onChange={(e) => handleBusChange(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            >
              <option value="">Choose a bus</option>
              {busesLoading ? (
                <option disabled>Loading buses...</option>
              ) : Array.isArray(buses) && buses.length > 0 ? (
                buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>
                    {bus.busName} ({bus.busNumber}) - {bus.baseRouteFrom} to{" "}
                    {bus.baseRouteTo}
                  </option>
                ))
              ) : (
                <option disabled>No buses available</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="routeFrom"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                From
              </label>
              <select
                id="routeFrom"
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                disabled={!selectedBus || stopsLoading}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select departure city</option>
                {stops.map((stop, index) => (
                  <option key={index} value={stop}>
                    {stop}
                  </option>
                ))}
              </select>
              {!selectedBus && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a bus first
                </p>
              )}
              {selectedBus && stopsLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading stops...</p>
              )}
              {selectedBus && !stopsLoading && stops.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No stops available for this bus
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="routeTo"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                To
              </label>
              <select
                id="routeTo"
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                disabled={!selectedBus || stopsLoading}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select destination city</option>
                {stops.map((stop, index) => (
                  <option key={index} value={stop}>
                    {stop}
                  </option>
                ))}
              </select>
              {!selectedBus && (
                <p className="text-xs text-gray-500 mt-1">
                  Please select a bus first
                </p>
              )}
              {selectedBus && stopsLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading stops...</p>
              )}
              {selectedBus && !stopsLoading && stops.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No stops available for this bus
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="journeyDate"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Journey Date
            </label>
            <input
              id="journeyDate"
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>

          <button
            onClick={searchRoutes}
            disabled={searchLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer disabled:opacity-50"
          >
            <FaSearch />
            {searchLoading ? "Searching..." : "Search Routes"}
          </button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="bg-white rounded-[12px] p-6 shadow max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
        <FaMapMarkerAlt className="text-[#004aad]" />
        Available Routes
      </h2>

      <div className="space-y-4">
        {Array.isArray(routes) && routes.length > 0 ? (
          routes.map((route) => (
            <div
              key={route._id}
              className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-200 p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {route.busId.busName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaRoute className="text-[#004aad]" />
                    {route.routeFrom} → {route.routeTo}
                  </p>
                  <p className="text-sm text-gray-500">
                    {route.departureTime} - {route.arrivalTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#004aad] flex items-center gap-1">
                    <FaRupeeSign />
                    {route.basePrice}
                  </p>
                  <button
                    onClick={() => selectRoute(route)}
                    className="px-4 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer text-sm"
                  >
                    Select Route
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No routes found</div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-[12px] p-6 shadow max-w-4xl mx-auto animate-fadeInUp">
      <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
        <FaTicketAlt className="text-[#004aad]" />
        Select Seats
      </h2>

      {seatLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading seat layout...</p>
        </div>
      ) : seatLayout ? (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">
              {seatLayout.route.busName}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaRoute className="text-[#004aad]" />
              {seatLayout.route.routeFrom} → {seatLayout.route.routeTo}
            </p>
            <p className="text-sm text-gray-500">
              {seatLayout.route.departureTime} - {seatLayout.route.arrivalTime}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaChair className="text-[#004aad]" />
                Available: {seatLayout.seats.available}
              </span>
              <span className="flex items-center gap-1">
                <FaTicketAlt className="text-red-500" />
                Booked: {seatLayout.seats.booked}
              </span>
            </div>
          </div>

          {/* Seat Map Layout - Exact replica of consumer frontend */}
          <BusLayoutContainer
            selectedSeats={selectedSeats}
            onSeatClick={toggleSeatSelection}
            seatsData={seatLayout.seats}
            busData={seatLayout.route}
          />

          {/* Seat Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Seat Status
            </h4>
            <div className="flex flex-wrap gap-4">
              {legendItems.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded border-2 ${item.className} flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600 flex items-center gap-4">
              <span>Selected Seats: {selectedSeats.length}</span>
              <span className="flex items-center gap-1">
                <FaRupeeSign />
                Total: ₹{selectedSeats.length * seatLayout.route.basePrice}
              </span>
            </div>
            <button
              onClick={proceedToPassengerDetails}
              disabled={selectedSeats.length === 0}
              className="px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No seat layout available
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-[12px] p-6 shadow max-w-2xl mx-auto animate-fadeInUp">
      <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
        <FaUser className="text-[#004aad]" />
        Passenger Details
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              value={passengerDetails.firstName}
              onChange={(e) =>
                setPassengerDetails({
                  ...passengerDetails,
                  firstName: e.target.value,
                })
              }
              placeholder="Enter first name"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              value={passengerDetails.lastName}
              onChange={(e) =>
                setPassengerDetails({
                  ...passengerDetails,
                  lastName: e.target.value,
                })
              }
              placeholder="Enter last name"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="age"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              id="age"
              type="number"
              value={passengerDetails.age}
              onChange={(e) =>
                setPassengerDetails({
                  ...passengerDetails,
                  age: e.target.value,
                })
              }
              placeholder="Enter age"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              value={passengerDetails.gender}
              onChange={(e) =>
                setPassengerDetails({
                  ...passengerDetails,
                  gender: e.target.value,
                })
              }
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={passengerDetails.email}
            onChange={(e) =>
              setPassengerDetails({
                ...passengerDetails,
                email: e.target.value,
              })
            }
            placeholder="Enter email address"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={passengerDetails.phone}
            onChange={(e) =>
              setPassengerDetails({
                ...passengerDetails,
                phone: e.target.value,
              })
            }
            placeholder="Enter phone number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
          />
        </div>

        <button
          onClick={proceedToPayment}
          disabled={isProcessingPayment}
          className="w-full px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessingPayment ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
        <BottomNav />
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
          <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full">
            <h1 className="text-xl font-semibold text-[#004aad] mb-4">
              Offline Booking
            </h1>
            <p className="text-gray-600 text-sm">
              Book tickets for customers who visit your office directly
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[12px] p-6 shadow max-w-2xl mx-auto animate-fadeInUp">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad] mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Sidebar Navigation */}
      <BottomNav />

      {/* Page Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* Header */}
        <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#004aad] mb-4 md:mb-0">
              Offline Bookings
            </h1>
            <p className="text-gray-600 text-sm">
              Book tickets for customers who visit your office directly
            </p>
          </div>

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

        {(error || busesError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
            {error ||
              busesError?.data?.message ||
              busesError?.message ||
              "An error occurred"}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Payment Scripts */}
        <PaymentScripts />
      </main>
    </div>
  );
};

export default OfflineBookingPage;
