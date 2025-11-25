"use client";
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/account/account-form";
import { useSearchParams, useRouter } from "next/navigation";
import LogoutButton from "@/components/account/logout-button";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/skeletons";
import { ChangePinCard } from "@/components/account/changePin"

const MenuItem = ({ label, description, Icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center px-5 hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#004AAD]/10 text-[#004AAD] mr-4">
      <Icon className="w-6 h-6" />
    </div>

    <div className="flex-1 text-left">
      <div className="font-semibold text-black">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>

    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

const AccountMenu = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab");

  if (activeTab === "profile") {
    return <AccountForm />;
  }

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-0 sm:px-6 md:px-8 lg:ml-18 py-4">

      {/* Section Header */}
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
        Account Settings
      </h2>

      {/* Menu Card */}
      <Card
        className="rounded-xl shadow-lg border-t-4 overflow-hidden mb-6"
        style={{ borderTopColor: "#004AAD" }}
      >
        <CardContent className="p-0">
          <MenuItem
            label="Profile"
            description="Edit your personal information"
            Icon={User}
            onClick={() => handleTabChange("profile")}
          />
        </CardContent>
      </Card>
         <ChangePinCard />

      {/* Logout Button Styled to Match Theme */}
      <div className="mt-4">
        <LogoutButton className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-md" />
      </div>
    </div>
  );
};

export default function AccountPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AccountMenu />
    </Suspense>
  );
}
