"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/ui/BottomNav";
import { FaBus, FaSearch, FaTicketAlt, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaRupeeSign, FaRoute } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/utils/redux/slices/authSlice";
import { 
  useGetOwnerBusesForBookingQuery,
  useGetBusStopsQuery,
  useSearchBusRoutesMutation,
  useGetRouteSeatLayoutQuery,
  useLockSeatsForBookingMutation,
  useCreateOfflineBookingMutation,
  useConfirmOnlineBookingPaymentMutation
} from "@/utils/redux/api/busSlice";
import BusLayoutContainer from "@/components/seats/bus-layout-container";
import PaymentOptions from "@/components/payment/PaymentOptions";
import PaymentScripts from "@/components/payment/PaymentScripts";
import PaymentSuccessScreen from "@/components/payment/PaymentSuccessScreen";
import { usePaymentHandlers } from "@/hooks/usePaymentHandlers";
import { PAYMENT_CONFIG } from "@/constants/payment";
import { legendItems } from "@/constants/seat-selection";
import { toast } from "sonner";
import AuthGuard from "@/components/wrapper/AuthGuard";

const OfflineBookingPage = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [step, setStep] = useState(1); // 1: Bus Selection, 2: Route Search, 3: Seat Selection, 4: Passenger Details, 5: Payment Options
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
    phone: ""
  });
  const [error, setError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isOfflineProcessing, setIsOfflineProcessing] = useState(false);
  const [offlineLoadingDuration] = useState(4); // Configurable loading duration in seconds
  const [seatLockId, setSeatLockId] = useState(null);
  const [isLockingSeats, setIsLockingSeats] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Redux hooks
  const { data: buses = [], isLoading: busesLoading, error: busesError } = useGetOwnerBusesForBookingQuery(undefined, {
    skip: !isClient, // Skip the query until client-side rendering
  });
  const { data: stops = [], isLoading: stopsLoading, error: stopsError } = useGetBusStopsQuery(selectedBus, {
    skip: !selectedBus || !isClient,
  });
  const [searchRoutesMutation, { isLoading: searchLoading }] = useSearchBusRoutesMutation();
  const { data: seatLayout, isLoading: seatLoading, error: seatError } = useGetRouteSeatLayoutQuery(
    { routeId: selectedRoute?._id, journeyDate },
    { skip: !selectedRoute || !journeyDate }
  );
  const [lockSeatsMutation, { isLoading: lockLoading }] = useLockSeatsForBookingMutation();
  const [createBookingMutation, { isLoading: bookingLoading }] = useCreateOfflineBookingMutation();
  const [confirmOnlinePaymentMutation] = useConfirmOnlineBookingPaymentMutation();

 
  const { processOnlinePayment } = usePaymentHandlers(
    createBookingMutation,
    confirmOnlinePaymentMutation,
    setIsProcessingPayment,
    user
  );

 
  useEffect(() => {
    if (busesError) {
      setError('Failed to load buses. Please try again.');
    }
  }, [busesError]);

  const searchRoutes = async () => {
    if (!selectedBus || !routeFrom || !routeTo || !journeyDate) {
      setError("Please fill all fields");
      return;
    }

    console.log('Searching routes with:', {
      busId: selectedBus,
      routeFrom,
      routeTo,
      journeyDate,
      journeyDateType: typeof journeyDate
    });

    try {
      const result = await searchRoutesMutation({
        busId: selectedBus,
        routeFrom,
        routeTo,
        journeyDate
      }).unwrap();
      
      setRoutes(result.routes || []);
      
      if (!result.routes || result.routes.length === 0) {
        setError(`No routes found for ${routeFrom} to ${routeTo} on ${journeyDate}. Please check if the route exists or try different locations.`);
      } else {
        setStep(2);
        setError("");
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to search routes');
    }
  };

  const selectRoute = (route) => {
    setSelectedRoute(route);
    setStep(3);
  };

  const toggleSeatSelection = (seatNumber) => {
    if (seatLayout.seats.seatMap[seatNumber - 1].status !== 'available') {
      return;  
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
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

  const proceedToPaymentOptions = async () => {
    if (!passengerDetails.firstName || !passengerDetails.lastName || !passengerDetails.age || !passengerDetails.gender || !passengerDetails.email || !passengerDetails.phone) {
      setError("Please fill all passenger details");
      return;
    }

    try {
      setError("");
      setIsLockingSeats(true);
      
       
      const lockResult = await lockSeatsMutation({
        routeId: selectedRoute._id,
        seatNumbers: selectedSeats,
        journeyDate
      }).unwrap();

      setSeatLockId(lockResult.lockId);
      setStep(5);
    } catch (error) {
      console.error("Seat locking error:", error);
      setError(error.data?.message || error.message || "Failed to lock seats. Please try again.");
    } finally {
      setIsLockingSeats(false);
    }
  };

  const handleOfflinePayment = async () => {
    try {
      setError("");
      setIsOfflineProcessing(true);
      
      const bookingData = {
        routeId: selectedRoute._id,
        seatNumbers: selectedSeats,
        passengerDetails: {
          name: `${passengerDetails.firstName} ${passengerDetails.lastName}`.trim(),
          age: passengerDetails.age,
          gender: passengerDetails.gender,
          email: passengerDetails.email,
          phone: passengerDetails.phone
        },
        journeyDate,
        paymentType: 'offline'
      };

      // Call the offline booking API
      const response = await createBookingMutation(bookingData).unwrap();
      
      setTimeout(() => {
        setIsOfflineProcessing(false);
        const enhancedBooking = {
          ...response.booking,
          busId: {
            busName: selectedRoute?.busId?.busName || selectedRoute?.busName || 'N/A'
          },
          fromCity: selectedRoute?.matchedFrom || selectedRoute?.routeFrom || response.booking.fromCity,
          toCity: selectedRoute?.matchedTo || selectedRoute?.routeTo || response.booking.toCity,
          departureTime: selectedRoute?.departureTime || selectedRoute?.startTime || 'N/A',
          arrivalTime: selectedRoute?.arrivalTime || selectedRoute?.endTime || 'N/A',
          departureTimeDisplay: selectedRoute?.departureTime || selectedRoute?.startTime || 'N/A',
          arrivalTimeDisplay: selectedRoute?.arrivalTime || selectedRoute?.endTime || 'N/A'
        };
        
        setConfirmedBooking(enhancedBooking);
        setShowSuccessScreen(true);
      }, offlineLoadingDuration * 1000);

    } catch (error) {
      console.error("Offline payment processing error:", error);
      setError(error.data?.message || error.message || "Failed to process offline payment. Please try again.");
      setIsOfflineProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
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
          phone: passengerDetails.phone
        },
        journeyDate,
        paymentType: 'online'
      };

      await processOnlinePayment(
        passengerDetails,
        bookingData,
        selectedRoute._id,
        selectedSeats,
        journeyDate,
        (booking) => {
          const enhancedBooking = {
            ...booking,
            busId: {
              busName: selectedRoute?.busId?.busName || selectedRoute?.busName || 'N/A'
            },
            fromCity: selectedRoute?.matchedFrom || selectedRoute?.routeFrom || booking.fromCity,
            toCity: selectedRoute?.matchedTo || selectedRoute?.routeTo || booking.toCity,
            departureTime: selectedRoute?.departureTime || selectedRoute?.startTime || 'N/A',
            arrivalTime: selectedRoute?.arrivalTime || selectedRoute?.endTime || 'N/A',
            departureTimeDisplay: selectedRoute?.departureTime || selectedRoute?.startTime || 'N/A',
            arrivalTimeDisplay: selectedRoute?.arrivalTime || selectedRoute?.endTime || 'N/A'
          };
          setConfirmedBooking(enhancedBooking);
          setShowSuccessScreen(true);
        }
      );
    } catch (error) {
      console.error("Online payment processing error:", error);
      setError(error.message || "Failed to process online payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };


  // Handle bus selection change
  const handleBusChange = (busId) => {
    setSelectedBus(busId);
    setRouteFrom("");
    setRouteTo("");
  };

 
  const goBackToSeatSelection = () => {
  
    setSeatLockId(null);
    setStep(3);
  };

  
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
      phone: ""
    });
    setError("");
    setIsProcessingPayment(false);
    setIsOfflineProcessing(false);
    setIsLockingSeats(false);
    setSeatLockId(null);
    setShowSuccessScreen(false);
    setConfirmedBooking(null);
  };

  const handleSuccessScreenClose = () => {
    setShowSuccessScreen(false);
    setConfirmedBooking(null);
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
      phone: ""
    });
    setError("");
    setIsProcessingPayment(false);
    setIsOfflineProcessing(false);
    setIsLockingSeats(false);
    setSeatLockId(null);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleDownloadTicket = (booking) => {
    console.log('Downloading ticket for booking:', booking);
  };


  const renderStep1 = () => {
    // Debug: Log the buses data structure
    console.log('Buses data:', buses);
    console.log('Buses type:', typeof buses);
    console.log('Buses length:', Array.isArray(buses) ? buses.length : 'not an array');
    console.log('Buses loading:', busesLoading);
    console.log('Buses error:', busesError);
    
    return (
      <div className="bg-white rounded-[12px] p-6 shadow max-w-2xl mx-auto animate-fadeInUp">
        <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
          <FaBus className="text-[#004aad]" />
          Select Bus
        </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="bus" className="block mb-2 text-sm font-medium text-gray-700">
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
            ) : Array.isArray(buses) && buses.length > 0 ? buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.busName} ({bus.busNumber}) - {bus.baseRouteFrom} to {bus.baseRouteTo}
              </option>
            )) : (
              <option disabled>No buses available</option>
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="routeFrom" className="block mb-2 text-sm font-medium text-gray-700">
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
              <p className="text-xs text-gray-500 mt-1">Please select a bus first</p>
            )}
            {selectedBus && stopsLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading stops...</p>
            )}
            {selectedBus && !stopsLoading && stops.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No stops available for this bus</p>
            )}
          </div>
          <div>
            <label htmlFor="routeTo" className="block mb-2 text-sm font-medium text-gray-700">
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
              <p className="text-xs text-gray-500 mt-1">Please select a bus first</p>
            )}
            {selectedBus && stopsLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading stops...</p>
            )}
            {selectedBus && !stopsLoading && stops.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No stops available for this bus</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="journeyDate" className="block mb-2 text-sm font-medium text-gray-700">
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
        {Array.isArray(routes) && routes.length > 0 ? routes.map((route) => (
          <div key={route._id} className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{route.busId.busName}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaRoute className="text-[#004aad]" />
                  {route.matchedFrom || route.routeFrom} → {route.matchedTo || route.routeTo}
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
        )) : (
          <div className="text-center py-8 text-gray-500">
            No routes found
          </div>
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
            <h3 className="font-semibold text-gray-800">{seatLayout.route.busName}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaRoute className="text-[#004aad]" />
              {seatLayout.route.matchedFrom || seatLayout.route.routeFrom} → {seatLayout.route.matchedTo || seatLayout.route.routeTo}
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
            <h4 className="text-sm font-medium text-gray-700 mb-3">Seat Status</h4>
            <div className="flex flex-wrap gap-4">
              {legendItems.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded border-2 ${item.className} flex items-center justify-center`}>
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
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              value={passengerDetails.firstName}
              onChange={(e) => setPassengerDetails({...passengerDetails, firstName: e.target.value})}
              placeholder="Enter first name"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              value={passengerDetails.lastName}
              onChange={(e) => setPassengerDetails({...passengerDetails, lastName: e.target.value})}
              placeholder="Enter last name"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={passengerDetails.age}
              onChange={(e) => setPassengerDetails({...passengerDetails, age: e.target.value})}
              placeholder="Enter age"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={passengerDetails.gender}
              onChange={(e) => setPassengerDetails({...passengerDetails, gender: e.target.value})}
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
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={passengerDetails.email}
            onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
            placeholder="Enter email address"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={passengerDetails.phone}
            onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
            placeholder="Enter phone number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline focus:outline-[#007bff33] focus:ring focus:ring-[#004aad] text-gray-700"
          />
        </div>

        <button
          onClick={proceedToPaymentOptions}
          disabled={isProcessingPayment || isOfflineProcessing || isLockingSeats}
          className="w-full px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#00348a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLockingSeats ? "Locking Seats..." : isProcessingPayment || isOfflineProcessing ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="bg-white rounded-[12px] p-6 shadow max-w-2xl mx-auto animate-fadeInUp">
      <h2 className="text-[#004aad] mb-4 text-lg font-semibold flex items-center gap-2">
        <FaRupeeSign className="text-[#004aad]" />
        Payment Options
      </h2>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Passenger:</span> {passengerDetails.firstName} {passengerDetails.lastName}</p>
            <p><span className="font-medium">Route:</span> {selectedRoute?.matchedFrom || selectedRoute?.routeFrom} → {selectedRoute?.matchedTo || selectedRoute?.routeTo}</p>
            <p><span className="font-medium">Date:</span> {journeyDate}</p>
            <p><span className="font-medium">Seats:</span> {selectedSeats.join(', ')}</p>
            <p><span className="font-medium">Total Amount:</span> ₹{selectedSeats.length * selectedRoute?.basePrice}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleOfflinePayment}
            disabled={isOfflineProcessing || isProcessingPayment}
            className="flex flex-col items-center justify-center p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >{/* ₹💸💸 */}
            <div className="text-4xl mb-2">₹</div>
            <h3 className="font-semibold text-green-700 mb-2">Pay Offline</h3>
            <p className="text-sm text-gray-600 text-center">Customer pays with cash at your office</p>
            {isOfflineProcessing && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </button>

          <button
            onClick={handleOnlinePayment}
            disabled={isOfflineProcessing || isProcessingPayment}
            className="flex flex-col items-center justify-center p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-4xl mb-2">💳</div>
            <h3 className="font-semibold text-blue-700 mb-2">Pay Online</h3>
            <p className="text-sm text-gray-600 text-center">Customer pays via Razorpay gateway</p>
            {isProcessingPayment && (
              <div className="mt-2 flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goBackToSeatSelection}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition cursor-pointer"
          >
            ← Back to Seat Selection
          </button>
        </div>
      </div>
    </div>
  );

  const renderOfflineLoadingScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004aad] mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Offline Payment</h3>
        <p className="text-gray-600 mb-4">Please wait while we complete your booking...</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#004aad] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">This will take about {offlineLoadingDuration} seconds</p>
      </div>
    </div>
  );

  // Show loading state during hydration
  if (!isClient) {
    return (
      <AuthGuard redirectTo="/login" requireAuth>
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
      </AuthGuard>
    );
  }

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
        {/* Sidebar Navigation */}
        <BottomNav />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
          <div className="bg-white p-4 mt-4 md:mt-8 rounded-lg shadow mb-6 max-w-5xl mx-auto w-full">
            <h1 className="text-xl font-semibold text-[#004aad] mb-4">
              Offline Booking
            </h1>
            <p className="text-gray-600 text-sm">
              Book tickets for customers who visit your office directly
            </p>
          </div>

          {(error || busesError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
              {error || busesError?.data?.message || busesError?.message || 'An error occurred'}
            </div>
          )}

          <div className="max-w-5xl mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
          
          {/* Offline Payment Loading Screen */}
          {isOfflineProcessing && renderOfflineLoadingScreen()}
          
          {/* Online Payment Success Screen */}
          {showSuccessScreen && (
            <PaymentSuccessScreen
              booking={confirmedBooking}
              onClose={handleSuccessScreenClose}
              onDownloadTicket={handleDownloadTicket}
              onGoHome={handleGoHome}
              loadingDuration={3000}
            />
          )}
          
          {/* Payment Scripts */}
          <PaymentScripts />
        </main>
      </div>
    </AuthGuard>
  );
};

export default OfflineBookingPage;
