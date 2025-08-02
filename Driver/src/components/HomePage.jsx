'use client';

import React from 'react';
import { FaBus, FaTicketAlt, FaChair, FaPlay } from 'react-icons/fa';



const StatCard = ({ title, value, icon, iconBg }) => (
  <div className="bg-white rounded-lg p-5 shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center text-white`}>
        {icon}
      </div>
    </div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);



const TripCard = ({
  title,
  status,
  fromCity,
  fromTime,
  toCity,
  toTime,
  duration,
  busNumber,
  totalSeats,
  bookedSeats,
  passengers,
}) => (
  <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] mb-5 overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(0,74,173,0.1)] text-[#004aad]">
        {status}
      </div>
    </div>
    
    <div className="p-5">
      <div className="flex items-center mb-5">
        <div className="text-center flex-1">
          <div className="text-lg font-medium">{fromCity}</div>
          <div className="text-sm text-gray-600">{fromTime}</div>
        </div>
        
        <div className="flex items-center flex-2 relative">
          <div className="h-0.5 bg-gray-200 flex-1"></div>
          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#004aad] flex items-center justify-center text-[#004aad] text-sm absolute left-1/3">
            {duration}
          </div>
        </div>
        
        <div className="text-center flex-1">
          <div className="text-lg font-medium">{toCity}</div>
          <div className="text-sm text-gray-600">{toTime}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Bus Number</div>
          <div className="font-medium">{busNumber}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Seats</div>
          <div className="font-medium">{totalSeats}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Booked Seats</div>
          <div className="font-medium">{bookedSeats}</div>
        </div>
      </div>
      
      <div className="flex gap-2.5 mb-5">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#004aad] text-white rounded-lg hover:bg-[#0056b3]">
          <FaChair /> View Seat Map
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#28a745] text-white rounded-lg hover:bg-[#218838]">
          <FaPlay /> Start Trip
        </button>
      </div>
      
      <div className="mt-5">
        <div className="text-base font-semibold mb-2.5">Passenger List</div>
        {passengers.map((passenger, index) => (
          <div key={index} className="flex items-center justify-between py-3 px-5 border-b border-gray-200 last:border-0 hover:bg-gray-50">
            <div className="font-medium">{passenger.name}</div>
            <div className="bg-gray-50 px-2.5 py-1 rounded text-sm">{passenger.seat}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const stats = [
    {
      title: "Today's Trip",
      value: "Mumbai → Pune",
      icon: <FaBus />,
      iconBg: "bg-[#004aad]"
    },
    {
      title: "Seats Booked",
      value: "12/17",
      icon: <FaTicketAlt />,
      iconBg: "bg-[#28a745]"
    }
  ];

  const tripData = {
    title: "Express 1",
    status: "Upcoming",
    fromCity: "Mumbai",
    fromTime: "07:00 AM",
    toCity: "Pune",
    toTime: "10:00 AM",
    duration: "30m",
    busNumber: "MH01 AB 1234",
    totalSeats: 17,
    bookedSeats: 12,
    passengers: [
      { name: "Manisha Kulkarni", seat: "Seat 5" },
      { name: "Aarav Jha", seat: "Seat 6" },
      { name: "Shreya Patel", seat: "Seat 10" },
      { name: "Vikram Singh", seat: "Seat 12" },
      { name: "Priya Sharma", seat: "Seat 15" }
    ]
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <TripCard {...tripData} />
    </div>
  );
};

export default HomePage; 