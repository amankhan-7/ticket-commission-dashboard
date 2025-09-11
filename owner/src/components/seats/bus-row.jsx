"use client";
import { memo } from "react";
import Seat from "@/components/seats/seat";

const BusRow = memo(
  ({
    rowSeats,
    onSeatClick,
    bookedSeats = [],
    selectedSeats = [],
  }) => {
    if (rowSeats.length === 3) {
      return (
        <>
          <div className="flex gap-2">
            <Seat
              seatItem={rowSeats[0]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          </div>
          <div className="flex gap-2">
            <Seat
              seatItem={rowSeats[1]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
            <Seat
              seatItem={rowSeats[2]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          </div>
        </>
      );
    }

    if (rowSeats.length === 4) {
      return (
        <div className="flex gap-2 justify-between w-full">
          {rowSeats.map((seat, index) => (
            <Seat
              key={seat.id}
              seatItem={seat}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          ))}
        </div>
      );
    }

    return (
      <>
        <div className="flex gap-2">
          {rowSeats[0] && (
            <Seat
              seatItem={rowSeats[0]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          )}
          {rowSeats[1] && (
            <Seat
              seatItem={rowSeats[1]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          )}
        </div>
        <div className="flex gap-2">
          {rowSeats[2] && (
            <Seat
              seatItem={rowSeats[2]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          )}
          {rowSeats[3] && (
            <Seat
              seatItem={rowSeats[3]}
              onSeatClick={onSeatClick}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
            />
          )}
        </div>
      </>
    );
  }
);

export default BusRow;
