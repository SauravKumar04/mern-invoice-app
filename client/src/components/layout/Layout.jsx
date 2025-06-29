import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} />

        {/* Allow both x and y scrolling */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-white rounded-tl-3xl shadow-inner">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
