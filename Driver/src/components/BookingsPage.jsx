'use client';

import React from 'react';
import { FaPrint, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './BookingPage.module.css';


const BookingsPage = () => {
  const passengers = [
    { seatNo: '1A', name: 'Ramesh Kumar', phone: '98xxxxxx12', status: 'checked-in' },
    { seatNo: '1B', name: 'Priya Sharma', phone: '87xxxxxx34', status: 'not-checked' },
    { seatNo: '2A', name: 'Vikram Singh', phone: '76xxxxxx56', status: 'checked-in' },
    { seatNo: '2B', name: 'Neha Patel', phone: '65xxxxxx78', status: 'checked-in' },
    { seatNo: '3A', name: 'Suresh Joshi', phone: '54xxxxxx90', status: 'not-checked' },
    { seatNo: '3B', name: 'Empty', phone: '-', status: 'empty' },
    { seatNo: '4A', name: 'Anita Desai', phone: '43xxxxxx21', status: 'checked-in' },
    { seatNo: '4B', name: 'Rajesh Khanna', phone: '32xxxxxx43', status: 'not-checked' }
  ];

  const recentBookings = [
    { id: '#SB12345', passenger: 'Manisha Kulkarni', route: 'Mumbai → Pune', date: 'May 16, 2025', seat: 'Seat 5' },
    { id: '#SB12344', passenger: 'Aarav Jha', route: 'Mumbai → Pune', date: 'May 16, 2025', seat: 'Seat 6' },
    { id: '#SB12343', passenger: 'Shreya Patel', route: 'Mumbai → Pune', date: 'May 16, 2025', seat: 'Seat 10' }
  ];

  const tripHistory = [
    { date: 'May 15, 2025', route: 'Pune → Mumbai', status: 'Completed' },
    { date: 'May 14, 2025', route: 'Mumbai → Pune', status: 'Completed' },
    { date: 'May 13, 2025', route: 'Pune → Mumbai', status: 'Completed' }
  ];

  const summary = {
    totalBooked: 8,
    checkedIn: 5,
    notCheckedIn: 3,
    emptySeats: 2
  };

  return (
    <div className="p-5">
      {/* Trip Info Card */}
      <div className="bg-white rounded-lg shadow-sm mb-5 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-lg font-semibold">Express 1 - Today's Trip</div>
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(0,74,173,0.1)] text-[#004aad]">
            Upcoming
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center">
            <div className="text-center flex-1">
              <div className="text-lg font-medium">Mumbai</div>
              <div className="text-sm text-gray-600">07:00 AM</div>
            </div>
            
            <div className="flex items-center flex-2 relative">
              <div className="h-0.5 bg-gray-200 flex-1"></div>
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[#004aad] flex items-center justify-center text-[#004aad] text-sm absolute left-1/3">
                30m
              </div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-lg font-medium">Pune</div>
              <div className="text-sm text-gray-600">10:00 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger List */}
      <div className="bg-white rounded-lg shadow-sm mb-5 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-lg font-semibold">Passenger List</div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaPrint /> Print List
          </button>
        </div>
        
        <div className={`overflow-x-auto ${styles.tableContainer}`}>
          <table className="w-full md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Seat No</th>
                <th className="p-4 text-left font-medium text-gray-600">Passenger Name</th>
                <th className="p-4 text-left font-medium text-gray-600">Phone Number</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {passengers.map((passenger, index) => (
                <tr key={index} className="block md:table-row border-b border-gray-200 last:border-0">
                  <td className="block md:table-cell p-4" data-label="Seat No">
                    {passenger.seatNo}
                  </td>
                  <td className="block md:table-cell p-4" data-label="Passenger Name">
                    {passenger.name}
                  </td>
                  <td className="block md:table-cell p-4" data-label="Phone Number">
                    {passenger.phone}
                  </td>
                  <td className="block md:table-cell p-4" data-label="Status">
                    {passenger.status === 'checked-in' && (
                      <span className="flex items-center gap-1 text-[#28a745]">
                        <FaCheckCircle /> Checked In
                      </span>
                    )}
                    {passenger.status === 'not-checked' && (
                      <span className="flex items-center gap-1 text-[#dc3545]">
                        <FaTimesCircle /> Not Checked In
                      </span>
                    )}
                    {passenger.status === 'empty' && (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-semibold text-[#004aad]">{summary.totalBooked}</div>
          <div className="text-sm text-gray-600">Total Booked</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-semibold text-[#004aad]">{summary.checkedIn}</div>
          <div className="text-sm text-gray-600">Checked In</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-semibold text-[#004aad]">{summary.notCheckedIn}</div>
          <div className="text-sm text-gray-600">Not Checked In</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-semibold text-[#004aad]">{summary.emptySeats}</div>
          <div className="text-sm text-gray-600">Empty Seats</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm mb-5 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="text-lg font-semibold">Recent Bookings</div>
        </div>
        
        <div className={`overflow-x-auto ${styles.tableContainer}`}>
          <table className="w-full md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Booking ID</th>
                <th className="p-4 text-left font-medium text-gray-600">Passenger</th>
                <th className="p-4 text-left font-medium text-gray-600">Route</th>
                <th className="p-4 text-left font-medium text-gray-600">Date</th>
                <th className="p-4 text-left font-medium text-gray-600">Seat</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {recentBookings.map((booking, index) => (
                <tr key={index} className="block md:table-row border-b border-gray-200 last:border-0">
                  <td className="block md:table-cell p-4" data-label="Booking ID">{booking.id}</td>
                  <td className="block md:table-cell p-4" data-label="Passenger">{booking.passenger}</td>
                  <td className="block md:table-cell p-4" data-label="Route">{booking.route}</td>
                  <td className="block md:table-cell p-4" data-label="Date">{booking.date}</td>
                  <td className="block md:table-cell p-4" data-label="Seat">{booking.seat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trip History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="text-lg font-semibold">Trip History</div>
        </div>
        
        <div className={`overflow-x-auto ${styles.tableContainer}`}>
          <table className="w-full md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium text-gray-600">Date</th>
                <th className="p-4 text-left font-medium text-gray-600">Route</th>
                <th className="p-4 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {tripHistory.map((trip, index) => (
                <tr key={index} className="block md:table-row border-b border-gray-200 last:border-0">
                  <td className="block md:table-cell p-4" data-label="Date">{trip.date}</td>
                  <td className="block md:table-cell p-4" data-label="Route">{trip.route}</td>
                  <td className="block md:table-cell p-4" data-label="Status">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(0,74,173,0.1)] text-[#004aad]">
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage; 