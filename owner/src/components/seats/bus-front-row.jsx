"use client";
import { memo } from "react";
import Seat from "@/components/seats/seat";

const BusFrontRow = memo(
  ({
    seatData,
    onSeatClick,
    bookedSeats = [],
    selectedSeats = [],
  }) => {
    if (!seatData) return null;

    return (
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 font-medium">Driver</div>
          <Seat
            seatItem={seatData}
            onSeatClick={onSeatClick}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
          />
        </div>
      </div>
    );
  }
);

export default BusFrontRow;
