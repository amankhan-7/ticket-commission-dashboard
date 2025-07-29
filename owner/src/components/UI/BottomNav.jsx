"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBus, FaUser, FaCog } from "react-icons/fa";
import clsx from "clsx";

const navItems = [
  { label: "Home", icon: FaHome, href: "/" },
  { label: "Buses", icon: FaBus, href: "/buses" },
  { label: "Drivers", icon: FaUser, href: "/drivers" },
  { label: "Settings", icon: FaCog, href: "/settings" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-white shadow-lg shadow-gray-300 z-50
                    fixed bottom-0 w-full h-16
                    lg:top-0 lg:left-0 lg:bottom-auto lg:w-18 lg:h-screen lg:flex lg:flex-col"
    >
      <ul
        className={clsx(
          "flex justify-around items-center h-full w-full",
          "lg:flex-col lg:justify-between lg:items-center lg:py-12"
        )}
      >
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 focus:outline-none transition-colors duration-200 py-14",
                  isActive ? "text-[#004aad] font-semibold" : "text-gray-500"
                )}
              >
                <Icon className="text-lg xl:text-xl" />
                <span className="text-[11px] xl:text-xs leading-none">
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
