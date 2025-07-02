import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Not sticky, scrolls with content */}
        <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 sm:p-6 bg-white rounded-tl-3xl shadow-inner overflow-auto">
            <Outlet />
          </main>

          {/* Footer at bottom of content */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
