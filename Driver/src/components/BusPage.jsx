'use client';
import React, { useState } from 'react';



const BusPage = () => {
  const [formData, setFormData] = useState({
    busName: 'Express 1',
    route: 'Mumbai → Pune',
    busNumber: 'MH01 AB 1234',
    totalSeats: 30,
    issue: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    alert('Report submitted successfully!');
    setFormData(prev => ({ ...prev, issue: '' }));
  };

  return (
    <div className="p-5">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="text-xl font-semibold text-[#004aad] mb-5">Bus Details</div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-medium mb-2">Bus Name</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.busName}
              disabled
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-medium mb-2">Route</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.route}
              disabled
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-medium mb-2">Bus Number</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.busNumber}
              disabled
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-medium mb-2">Total Seats</label>
            <input
              type="number"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.totalSeats}
              disabled
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-medium mb-2">Report Issue</label>
            <textarea
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              rows={4}
              placeholder="Describe any issues with the bus"
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
            />
          </div>
          
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#004aad] text-white rounded-lg hover:bg-blue-700"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusPage; 