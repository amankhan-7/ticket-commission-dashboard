import AccountMenu from "@/components/account/account-menu";
import AccountHeader from "@/components/account/account-header";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/skeletons";
import BottomNav from "../ui/BottomNav";

export default function AccountPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] text-[var(--text-color)] font-sans">
      <BottomNav/>
      <div className="max-w-[900px] w-full min-h-screen mt-16 pt-6 mx-auto mb-[50px] px-[15px]">
        <AccountHeader />
        <Suspense
          fallback={
            <div className="my-6">
              <PageSkeleton />
            </div>
          }
        >
          <AccountMenu />
        </Suspense>
      </div>
    </div>
  );
}
