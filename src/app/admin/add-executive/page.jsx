"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // adjust path as needed

import CreateTicketExecutivePage from "@/components/executive/createExecutive";

export default function Page() {
//   const { user, isAuthenticated } = useAuth();
//   const userType = user?.userType;
//   console.log("type", userType);


  // Role-based rules
//   const canCreate = ["admin", "superAdmin", "counter"].includes(userType);
//   const canVerify = [
//     "counterPerson",
//     "ticketExecutive",
//     "admin",
//     "superAdmin",
//   ].includes(userType);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  // Safety check: block unauthorized users immediately
//   if (!isAuthenticated) return <p>Unauthorized — Login required.</p>;

  return (
    <main>
       
        <CreateTicketExecutivePage
          onCreated={(id, data) => {
            setCounterPersonId(id);
            setCreatedData(data);
       
          }}
        />
     
        {/* <div className="flex items-center justify-center h-screen bg-white">
          <p className="text-[#004aad] text-lg font-semibold">
            You are not allowed to access this step.
            <br />
            <p className="text-gray-800 text-sm font-medium text-center">
              It will be governed by Admins and Super Admin
            </p>
          </p>
        </div> */}
     
    </main>
  );
}
