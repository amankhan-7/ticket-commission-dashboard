"use client";
import React from "react";
import { FaHome, FaBus, FaTicketAlt, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";



const NavItem = ({ href, icon, label, isActive }) => (
  <Link
    href={href}
    className={`flex flex-col items-center text-sm transition-colors py-2.5 md:py-4 ${
      isActive ? "text-[#004aad]" : "text-gray-600 hover:text-[#004aad]"
    }`}
  >
    <span className="text-xl mb-1">{icon}</span>
    <span>{label}</span>
  </Link>
);

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <FaHome />, label: "Home" },
    { href: "/bus", icon: <FaBus />, label: "Bus" },
    { href: "/bookings", icon: <FaTicketAlt />, label: "Bookings" },
    { href: "/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:left-0 md:top-0 md:w-20 md:h-full md:shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around md:flex-col md:h-full md:py-0">
        <div className="hidden md:block md:h-8"></div>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
        <div className="hidden md:block md:h-8"></div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
