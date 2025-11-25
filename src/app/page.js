"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RedirectPage() {
  const router = useRouter();
  const { userType, isAuthenticated} = useAuth();
  // console.log("usetype",userType, "user", user);

  useEffect(() => {
    // Not authenticated → dump them to home
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Authenticated but routes depend on userType
    if (isAuthenticated && userType === "counter") {
      router.push("/commission");
      return;
    }

    if (isAuthenticated && userType === "ticketExecutive") {
      router.push("/counterpersons");
      return;
    }

    // Fallback — either userType missing or garbage
    router.push("/login");
  }, [isAuthenticated, userType, router]);

  return null;
}
