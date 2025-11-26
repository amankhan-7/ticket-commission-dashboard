"use client";
import React, { useState } from "react";
import {
  useGetAllTicketExecutivesQuery,
  useAssignCounterToExecutiveMutation,
  useGetAllCounterPersonsQuery,
} from "@/utils/redux/api/executiveApi";
import { FaUserTie, FaUserCircle, FaCheckCircle } from "react-icons/fa";
import { PanelBottomDashed } from "lucide-react";
import Navbar from "@/components/ui/navbar";


function AssignCounter({ tenentId }) {
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedCounterPerson, setSelectedCounterPerson] = useState("");

  const { data: executives = [], isLoading: exLoading } =
    useGetAllTicketExecutivesQuery();

  const { data: counterPersons = [], isLoading: cpLoading } =
    useGetAllCounterPersonsQuery();

  const [assignCounter, { isLoading: assignLoading }] =
    useAssignCounterToExecutiveMutation();

  const handleAssign = async () => {
    try {
      await assignCounter({
        executiveId: selectedExecutive,
        counterPersonId: selectedCounterPerson,
      }).unwrap();

      alert("Counter assigned successfully!");

      setSelectedExecutive("");
      setSelectedCounterPerson("");
    } catch (err) {
      console.error(err);
      alert("Assignment failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      <Navbar/>


      <main className="flex-1 px-4 sm:px-6 md:px-8 pb-24 md:pb-6 lg:ml-18">
        {/* HEADER */}
        <h1
          className="text-4xl font-extrabold text-center pb-5 mb-12 mt-14 
      bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 
      bg-clip-text text-transparent"
        >
          Assign Counter to Ticket Executive
        </h1>

        <div className="max-w-5xl mx-auto">
          <div
            className="bg-white rounded-xl shadow-lg border-t-4 p-8"
            style={{ borderTopColor: "#004AAD" }}
          >
            {/* EXECUTIVE DROPDOWN */}
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase">
              Select Ticket Executive
            </label>

            <div className="relative mb-6">
              <select
                value={selectedExecutive}
                onChange={(e) => setSelectedExecutive(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black 
                       focus:ring-2 focus:ring-[#004AAD] focus:outline-none"
              >
                <option value="">-- Choose Executive --</option>
                {!exLoading &&
                  executives?.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} ({ex._id})
                    </option>
                  ))}
              </select>
              <FaUserTie className="absolute right-4 top-4 text-gray-500" />
            </div>

            {/* COUNTER PERSON DROPDOWN */}
            <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase">
              Select Counter Person
            </label>

            <div className="relative mb-8">
              <select
                value={selectedCounterPerson}
                onChange={(e) => setSelectedCounterPerson(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black 
                       focus:ring-2 focus:ring-[#004AAD] focus:outline-none"
              >
                <option value="">-- Choose Counter Person --</option>
                {!cpLoading &&
                  counterPersons?.map((cp) => (
                    <option key={cp._id} value={cp._id}>
                      {cp.name} ({cp._id})
                    </option>
                  ))}
              </select>
              <FaUserCircle className="absolute right-4 top-4 text-gray-500" />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={
                !selectedExecutive || !selectedCounterPerson || assignLoading
              }
              onClick={handleAssign}
              className={`w-full py-3 rounded-lg font-bold text-white text-lg transition-all ${
                !selectedExecutive || !selectedCounterPerson
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#004AAD] hover:bg-blue-700 shadow-md"
              }`}
            >
              {assignLoading ? "Assigning..." : "Assign Counter"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AssignCounter;
