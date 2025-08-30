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
import { useDispatch, useSelector } from "react-redux";
import {
  addDriver,
  deleteDriver,
} from "@/utils/redux/slices/driversSlice";
import {
  useAddDriverMutation,
  useVerifyDriverInvitationMutation,
} from "@/utils/redux/api/driverSlice";

export default function DriversPage() {
  const drivers = useSelector((state) => state.drivers);
  const dispatch = useDispatch();

  const [driverPhone, setDriverPhone] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [drivingLicense, setDriverDrivingLicense] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [isInvited, setIsInvited] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [addDriverMut, { isLoading: isInviting } ] = useAddDriverMutation();
  const [verifyInvitation, { isLoading: isVerifying } ] = useVerifyDriverInvitationMutation();

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!driverPhone.trim()) {
      alert("Please enter driver's phone number");
      return;
    }
    try {
      await addDriverMut({
        phoneNumber: driverPhone,
        name: driverName,
        drivingLicense,
        joinedAt: joiningDate || undefined,
      }).unwrap();
      alert("Invitation sent to the driver!");
      setIsInvited(true);
    } catch (err) {
      alert(err?.data?.message || "Failed to send invitation");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      alert("Please enter the OTP/Invitation code.");
      return;
    }
    try {
      await verifyInvitation({
        phoneNumber: driverPhone,
        otp: otpCode,
        firstName: driverName,
        lastName: "",
        drivingLicense,
      }).unwrap();
      alert("Invitation verified and driver created!");
      // Reset form after verification
      setDriverPhone("");
      setDriverName("");
      setDriverDrivingLicense("");
      setJoiningDate("");
      setOtpCode("");
      setIsInvited(false);
      setShowForm(false);
    } catch (err) {
      alert(err?.data?.message || "Verification failed");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setDriverPhone("");
    setDriverName("");
    setDriverDrivingLicense("");
    setJoiningDate("");
    setOtpCode("");
    setIsInvited(false);
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
          {drivers.map((driver, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-800">
                  {driver.name}
                </h2>
                <button
                  onClick={() => dispatch(deleteDriver(driver.id))}
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
                    Assigned to: <strong>{driver.assignedTo}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-[#28a745]" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarCheck className="text-[#28a745]" />
                  <span>Joined: {driver.joined}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 text-[#28a745] bg-[#f5f7fa] font-medium">
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
                    disabled={isInvited || isInviting || isVerifying}
                  />
                </div>
                 <div>
                  <label
                    htmlFor="driverName"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="driverName"
                    name="driverName"
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    autoComplete="name"
                    placeholder="Enter driver's name"
                    className="w-full p-2 placeholder-gray-400 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                    disabled={isInvited || isInviting || isVerifying}
                  />
                </div>
                {/* drivingLicense */}
                 <div>
                  <label
                    htmlFor="drivingLicense"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Driving License
                  </label>
                  <input
                    id="drivingLicense"
                    name="drivingLicense"
                    type="text"
                    value={drivingLicense}
                    onChange={(e) => setDriverDrivingLicense(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter driver's license number"
                    className="w-full p-2 placeholder-gray-400 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                    disabled={isInvited || isInviting || isVerifying}
                  />
                </div>
                   {/* Joining Date */}
                 <div>
                  <label
                    htmlFor="joiningDate"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Joining Date
                  </label>
                  <input
                    id="joiningDate"
                    name="joiningDate"
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    autoComplete="off"
                    placeholder="Select joining date"
                    className="w-full p-2 placeholder-gray-400 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                    disabled={isInvited || isInviting || isVerifying}
                  />
                </div>

                {isInvited && (
                  <div>
                    <label
                      htmlFor="otpCode"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      OTP / Invitation Code
                    </label>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      autoComplete="one-time-code"
                      placeholder="Enter the OTP/invitation code"
                      className="w-full p-2 placeholder-gray-400 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 transition duration-200 ease-in-out text-gray-700"
                      disabled={isVerifying}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!isInvited ? (
                  <button
                    type="submit"
                    className="bg-[#004aad] text-white px-4 py-2 rounded-sm text-xs font-base hover:bg-[#0056b3] transition cursor-pointer duration-200 ease-in-out"
                    disabled={isInviting}
                  >
                    {isInviting ? "Sending..." : "Send Invitation Code"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="bg-[#28a745] text-white px-4 py-2 rounded-sm text-xs font-base hover:bg-[#23923d] transition cursor-pointer duration-200 ease-in-out"
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify Code"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white text-gray-600 text-xs font-base border border-gray-300 rounded-md px-3 py-2 hover:bg-[#f5f7fa] transition duration-200 cursor-pointer"
                  disabled={isInviting || isVerifying}
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
