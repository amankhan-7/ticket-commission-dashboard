"use client";
import React from "react";
import DriverLayout from "@/components/DriverLayout";
import { usePathname } from "next/navigation";

export default function DriverLayoutWrapper({
  children,
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/bookings":
        return "Bookings";
      case "/bus":
        return "Bus";
      case "/settings":
        return "Settings";
      default:
        return "Home";
    }
  };

  return (
    <DriverLayout currentPageTitle={getPageTitle()}>{children}</DriverLayout>
  );
} 