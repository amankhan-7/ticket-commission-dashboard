"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBus,
  FaUser,
  FaCog,
  FaTicketAlt,
  FaPercentage,
  FaMoneyBillWave,
  FaCoins,
  FaHandHoldingUsd,
  FaFileInvoiceDollar,
  FaReceipt,
} from "react-icons/fa";
import clsx from "clsx";

const getUserRole = () => "counterPerson";

const getNavItems = (role) => {
  if (role === "counterPerson") {
    return [
      { label: "Commission", icon: FaPercentage, href: "/commission" },
      { label: "Booking", icon: FaTicketAlt, href: "/booking" },
      { label: "Documents", icon: FaReceipt, href: "/documents" },
      { label: "Profile", icon: FaUser, href: "/account" },
    ];
  }

  if (role === "executive") {
    return [
      { label: "Counters", icon: FaFileInvoiceDollar, href: "/counterpersons" },
      { label: "Add Counter", icon: FaTicketAlt, href: "/addcounter" },
      { label: "Profile", icon: FaUser, href: "/account" },
    ];
  }

  return []; // fallback to avoid UI crash
};

export default function BottomNav() {
  const pathname = usePathname();
  const role = getUserRole();
  const navItems = getNavItems(role);

  return (
    <nav
      className="bg-white shadow-lg shadow-gray-300 z-50
                    fixed bottom-0 w-full h-16
                    lg:top-0 lg:left-0 lg:bottom-auto lg:w-18 lg:h-screen lg:flex lg:flex-col"
    >
      <ul
        className={clsx(
          "flex justify-around items-center h-full w-full",
          "lg:flex-col lg:items-center lg:py-12"
        )}
      >
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-0 focus:outline-none transition-colors duration-200 py-0",
                  isActive ? "text-[#004aad] font-semibold" : "text-gray-500"
                )}
              >
                <Icon className="text-lg xl:text-xl" />
                <span className="text-[11px] font-bold text-center">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
