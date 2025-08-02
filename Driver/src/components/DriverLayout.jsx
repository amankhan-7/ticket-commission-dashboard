import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';



const DriverLayout = ({ children, currentPageTitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-20">
      <div className="max-w-7xl mx-auto">
        <Header
          currentPageTitle={currentPageTitle}
          userName="Rajesh Kumar"
          userRole="Bus Driver"
          userInitials="RK"
        />
        <main>{children}</main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default DriverLayout; 