import { X } from "lucide-react";

export const SEAT_STATUS = {
  AVAILABLE: "available",
  SELECTED: "selected",
  BOOKED: "booked",
  LOCKED: "locked",
};

export const legendItems = [
  {
    status: "available",
    label: "Available",
    className: "bg-white border-gray-300",
    icon: "",
  },
  {
    status: "selected",
    label: "Selected",
    className: "bg-primary text-white",
    icon: "",
  },
  {
    status: "booked",
    label: "Booked",
    className: "bg-gray-300 text-white",
    icon: <X className="h-full w-full text-gray-500" />,
  },
  {
    status: "locked",
    label: "Locked",
    className: "bg-red-300 text-white",
    icon: "",
  },
];
