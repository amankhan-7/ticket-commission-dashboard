"use client";
import { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { generateSeatLayout } from "@/utils/seat-utils";
import BusRow from "@/components/seats/bus-row";
import BusFrontRow from "@/components/seats/bus-front-row";

const BusLayoutContent = memo(
  ({ selectedSeats = [], onSeatClick, className = "", seatsData, busData }) => {
    const seatLayout = useMemo(() => {
      if (!seatsData?.seatMap) return [];

      try {
        return generateSeatLayout({
          seatMap: seatsData.seatMap,
          totalSeats: seatsData.total,
        });
      } catch (error) {
        console.error("Error generating seat layout:", error);
        return [];
      }
    }, [seatsData?.seatMap, seatsData?.total]);

    const frontRowSeat = useMemo(() => {
      if (!seatsData?.seatMap) return [];

      if (seatsData.total === 20) {
        // 20-seater: only 1 front passenger seat next to driver
        const seat17 = seatsData.seatMap.find((seat) => seat.seatNumber === 20);
        return seat17
          ? [
              {
                type: "seat",
                id: seat17._id,
                seatNumber: seat17.seatNumber,
                status: seat17.status,
              },
            ]
          : [];
      }

      if (seatsData.total === 17) {
        // 17-seater: only 1 front passenger seat next to driver
        const seat17 = seatsData.seatMap.find((seat) => seat.seatNumber === 17);
        return seat17
          ? [
              {
                type: "seat",
                id: seat17._id,
                seatNumber: seat17.seatNumber,
                status: seat17.status,
              },
            ]
          : [];
      }

      if (seatsData.total === 15) {
        // 15-seater: two passenger seats next to driver (14 & 15)
        return seatsData.seatMap
          .filter((seat) => seat.seatNumber === 14 || seat.seatNumber === 15)
          .map((seat) => ({
            type: "seat",
            id: seat._id,
            seatNumber: seat.seatNumber,
            status: seat.status,
          }));
      }

      return [];
    }, [seatsData?.seatMap, seatsData?.total]);

    const bookedSeats = useMemo(() => {
      if (!seatsData?.seatMap) return [];
      return seatsData.seatMap
        .filter((seat) => seat.status === "booked")
        .map((seat) => seat.seatNumber);
    }, [seatsData?.seatMap]);

    if (!busData || !seatsData) {
      return null;
    }

    return (
      <Card
        className={`mx-auto shadow-[0_2px_15px_rgba(0,0,0,0.05)] p-4 md:p-[1.5625rem] mb-[1.875rem] w-full rounded-xl will-change-transform ${className}`}
      >
        <CardContent className="space-y-2 p-0">
          <BusFrontRow
            seatData={frontRowSeat}
            onSeatClick={onSeatClick}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
          />
          {seatLayout.map((rowSeats, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-between mt-2.5 space-y-4 mb-0 items-center"
            >
              <BusRow
                rowSeats={rowSeats}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                onSeatClick={onSeatClick}
                seatMap={seatsData.seatMap}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
);

export default function BusLayoutContainer({
  selectedSeats,
  onSeatClick,
  seatsData,
  busData,
}) {
  return (
    <BusLayoutContent
      selectedSeats={selectedSeats}
      onSeatClick={onSeatClick}
      seatsData={seatsData}
      busData={busData}
    />
  );
}
