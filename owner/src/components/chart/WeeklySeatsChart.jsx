"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WeeklySeatsChart({ buses }) {
  const [chartData, setChartData] = useState([]);
  const [useShortDay, setUseShortDay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setUseShortDay(window.innerWidth < 640); // sm breakpoint
    };
    handleResize(); // check initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!Array.isArray(buses) || buses.length === 0) return;

    const daysOrder = [
      { full: "Sunday", short: "Sun" },
      { full: "Monday", short: "Mon" },
      { full: "Tuesday", short: "Tue" },
      { full: "Wednesday", short: "Wed" },
      { full: "Thursday", short: "Thu" },
      { full: "Friday", short: "Fri" },
      { full: "Saturday", short: "Sat" },    
    ];

    const weekData = daysOrder.map((day) => ({
      day: day.full,
      shortDay: day.short,
      totalSeats: 0,
      bookedSeats: 0,
      availableSeats: 0,
    }));

    buses.forEach((bus) => {
      if (!bus?.date) return;

      console.log(`Total Seats: ${bus.totalSeats}`);
      // console.log(`Booked Seats: ${bus.seatsBooked}`);

      const dateObj = new Date(bus.date);
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      const dayIndex = daysOrder.findIndex((d) => d.full === weekday);
      if (dayIndex !== -1) {
        const booked = bus.seatsBooked || 0;
        const total = bus.totalSeats || 0;

        weekData[dayIndex].totalSeats += total;
        weekData[dayIndex].bookedSeats += booked;
        weekData[dayIndex].availableSeats += Math.max(total - booked, 0);
      }
    });

    setChartData(weekData);
  }, [buses]);

  return (
    <section className="bg-white rounded-[12px] p-4 sm:p-6 mb-6 shadow max-w-full sm:max-w-5xl mx-auto w-full animate-fadeInUp mt-10">
      <h2 className="text-[#004aad] mb-4 text-base sm:text-lg font-semibold text-center sm:text-left">
        Weekly Bus Seats Overview
      </h2>
      {/* Responsive height for different screens */}
      <div className="w-full h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey={useShortDay ? "shortDay" : "day"}
              tick={{ fontSize: 10, fill: "#4B5563" }}
              interval={0}
            />
            <YAxis
              dataKey="totalSeats" // base it on totalSeats so scaling works
              domain={[0, "dataMax"]}
              tickCount={8}
              tick={{ fontSize: 10, fill: "#4B5563" }}
              label={{
                value: "Total number of seats per day",
                angle: -90,
                position: "insideLeft",
                dy: 70,
                fill: "#374151",
                fontSize: 10,
              }}
            />
            {/* Gray total seats bar */}
            <Bar
              dataKey="totalSeats"
              fill="#9CA3AF" // Tailwind gray-400
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            {/* Blue booked seats bar overlay */}
            <Bar
              dataKey="bookedSeats"
              fill="#004aad"
              barSize={12}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Static legend */}
      <div className="flex justify-center gap-6 mt-2 text-[10px] lg:text-xs">
        <div className="flex items-center gap-1">
          <span className="w-4 h-1 lg:w-3 lg:h-3 bg-gray-400 rounded"></span>
          <span className="text-gray-600">Total Seats</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-1 lg:w-3 lg:h-3 bg-[#004aad] rounded"></span>
          <span className="text-gray-600">Booked Seats</span>
        </div>
      </div>
    </section>
  );
}
