"use client";

import AccountMenu from "@/components/account/account-menu";
import AccountHeader from "@/components/account/account-header";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/skeletons";
import BottomNav from "../ui/BottomNav";
import ExecutiveNavbar from "../ui/executiveNavbar"; 
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
  const { userType, isLoading } = useAuth();
  

  // Block rendering until we know what role the user has
  if (isLoading || !userType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa]">
      
      {/* Conditionally render the correct nav */}
      {userType === "counterPerson" && <BottomNav />}
      {userType === "ticketExecutive" && <ExecutiveNavbar />}

      <div className="max-w-[900px] w-full min-h-screen mt-16 pt-6 mx-auto mb-[50px] px-[15px]">
        <AccountHeader />

        <Suspense fallback={<div className="my-6"><PageSkeleton /></div>}>
          <AccountMenu />
        </Suspense>
      </div>
    </div>
  );
}
