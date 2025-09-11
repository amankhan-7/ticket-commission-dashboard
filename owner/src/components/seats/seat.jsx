"use client";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { X, Lock } from "lucide-react";
import { SEAT_STATUS } from "@/constants/seat-selection";
import { cn } from "@/lib/utils";

const Seat = memo(
  ({
    seatItem,
    onSeatClick,
    selectedSeats = [],
    className,
    disabled = false,
  }) => {
    const status =
      seatItem.status === "booked"
        ? SEAT_STATUS.BOOKED
        : seatItem.status === "locked"
        ? SEAT_STATUS.LOCKED
        : selectedSeats.includes(seatItem.id) ||
          selectedSeats.includes(seatItem.seatNumber)
        ? SEAT_STATUS.SELECTED
        : SEAT_STATUS.AVAILABLE;

    const baseClassName = [
      "border-2 border-[#ddd] rounded-lg flex items-center justify-center text-[#555] bg-white cursor-pointer hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 ease-in-out overflow-hidden border shadow-[0_1px_3px_rgba(0,0,0,0.05)] gap-0 p-0",
      "w-[36px] h-[36px] text-[0.8rem]",
      "md:w-[40px] md:h-[40px] md:text-[0.85rem]",
      "lg:w-[45px] lg:h-[45px] lg:text-[0.9rem]",
      "flex items-center justify-center",
      "rounded-[0.5rem] border-2",
      "cursor-pointer",
      "hover:-translate-y-0.5 hover:shadow-lg hover:text-white",
    ];

    const statusClassName = {
      [SEAT_STATUS.BOOKED]:
        "bg-gray-400 text-white border-gray-500 cursor-not-allowed opacity-75 hover:translate-y-0 hover:shadow-none",
      [SEAT_STATUS.LOCKED]:
        "bg-red-300 text-white border-gray-300 cursor-not-allowed opacity-75 hover:translate-y-0 hover:shadow-none",
      [SEAT_STATUS.SELECTED]:
        "bg-primary border-primary text-white hover:bg-primary hover:text-white animate-selectedPulse",
      [SEAT_STATUS.AVAILABLE]:
        "hover:bg-white hover:border-primary hover:text-[#555] border hover:scale-105 active:scale-95",
    };

    const isDisabled =
      status === SEAT_STATUS.BOOKED ||
      status === SEAT_STATUS.LOCKED ||
      seatItem.type !== "seat" ||
      disabled;

    return (
      <Button
        className={cn(...baseClassName, statusClassName[status], className)}
        onClick={() => onSeatClick && onSeatClick(seatItem.seatNumber)}
        disabled={isDisabled}
      >
        {status === SEAT_STATUS.BOOKED ? (
          <X className="h-3 w-3" />
        ) : status === SEAT_STATUS.LOCKED ? (
          <Lock className="h-3 w-3" />
        ) : (
          seatItem.seatNumber || seatItem.id
        )}
      </Button>
    );
  }
);

export default Seat;
