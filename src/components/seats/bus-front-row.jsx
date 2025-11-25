"use client";
import { memo } from "react";
import Seat from "@/components/seats/seat";


const DriverSeat = memo(() => {
  return (
    <div className="flex flex-col items-center pt-1.5">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center justify-center">
        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-400 rounded-full"></div>
      </div>
      <div className="mt-2 text-xs font-medium text-gray-500 tracking-wide">
        Driver
      </div>
    </div>
  );
});


const BusFrontRow = memo(
  ({ seatData = [], onSeatClick, bookedSeats = [], selectedSeats = [] }) => {
    if (!seatData) return null;

    return (
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
         
          {seatData.map((seat, index) => (
            <Seat
              key={seat.id || index} seat={seat}
              seatItem={seat}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          ))}
        </div>
         <DriverSeat/>
      </div>
    );
  }
);

export default BusFrontRow;
