"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/wrapper/AuthGuard";
import VerifyStep from "@/components/counterPerson/verifyStep";

export default function Page() {
  const router = useRouter();
  const { user, userType, isAuthenticated, loading } = useAuth();

  const counterPersonId = user?.id;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <div>Loading...</div>;

  const canVerify = [
    "counter",
    "ticketExecutive",
    "admin",
    "superAdmin",
  ].includes(userType);

  return (
    <AuthGuard redirectTo="/login" requireAuth>
      <main>
        {canVerify ? (
          <VerifyStep counterPersonId={counterPersonId} />
        ) : (
          <div className="flex items-center justify-center h-screen bg-white">
            <p className="text-[#004aad] text-lg font-semibold">
              You are not allowed to access this step.
              <br />
              <span className="text-gray-800 text-sm font-medium text-center">
                It will be governed by Admins and Super Admin
              </span>
            </p>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
