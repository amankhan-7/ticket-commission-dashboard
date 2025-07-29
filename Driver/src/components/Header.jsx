'use client';

import React from 'react';


const Header = ({ currentPageTitle, userName, userRole, userInitials }) => {
  return (
    <div className='p-5 w-full'>
    <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
      <div className="text-2xl font-semibold text-[#004aad]">{currentPageTitle}</div>
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-[#004aad] flex items-center justify-center text-white text-lg">
          {userInitials}
        </div>
        <div>
          <div className="font-medium">{userName}</div>
          <div className="text-sm text-gray-600">{userRole}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Header; 