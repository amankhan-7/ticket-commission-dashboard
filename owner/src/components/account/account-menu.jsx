"use client";
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/account/account-form";
import { useSearchParams, useRouter } from "next/navigation";
import LogoutButton from "@/components/account/logout-button";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/skeletons";

const MenuItem = ({ label, description, Icon, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="flex items-center w-full p-4 border-b last:border-none h-fit"
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/20 text-primary mr-4">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 text-left flex flex-col items-start justify-center">
      <div className="font-medium text-foreground">{label}</div>
      <div className="text-sm text-muted-foreground font-normal">
        {description}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground" />
  </Button>
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
    <>
      <div className="px-2 text-xs uppercase text-muted-foreground mb-2">
        Account
      </div>
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <MenuItem
            label="Profile"
            description="Edit your personal information"
            Icon={User}
            onClick={() => handleTabChange("profile")}
          />
        </CardContent>
      </Card>
      <LogoutButton />
    </>
  );
};

export default function AccountPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AccountMenu />
    </Suspense>
  );
}
