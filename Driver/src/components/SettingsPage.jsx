'use client';
import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 9876543210'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    window.location.href = '/login';
  };

  return (
    <div className="p-5">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="text-xl font-semibold text-[#004aad] mb-5">Account Settings</div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="mb-5">
            <label className="block font-medium mb-2">Phone</label>
            <input
              type="tel"
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              value={formData.phone}
              disabled
            />
          </div>
          
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#004aad] text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
        
        <button
          onClick={handleLogout}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 