import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, FileText, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { logout } from '../../api/auth';
import Avatar from '../ui/Avatar';

const Header = ({ onMenuClick }) => {
  const { currentUser, logout: authLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-700 to-purple-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Invoice Logo & Text */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow animate-pulse" />
            <span className="bg-gradient-to-r from-violet-100 to-white bg-clip-text text-transparent hidden sm:inline">
              Invoice App
            </span>
          </Link>
        </div>

        {/* Right: User Info + Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
            {/* Desktop: Full user info */}
            <div className="hidden sm:flex items-center gap-3">
              <Avatar 
                src={currentUser.avatar} 
                name={currentUser.name} 
                size="md"
                className="ring-2 ring-white/20 hover:ring-white/40 transition-all duration-200"
              />
              <span className="text-sm lg:text-base font-medium text-white max-w-[120px] lg:max-w-[150px] truncate">
                {currentUser.name}
              </span>
            </div>

            {/* Mobile: Only avatar */}
            <div className="sm:hidden">
              <Avatar 
                src={currentUser.avatar} 
                name={currentUser.name} 
                size="sm"
                className="ring-2 ring-white/20"
              />
            </div>

            {/* Logout button - icon only on mobile, full button on desktop */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95
                         px-2 py-2 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2
                         text-sm lg:text-base"
              title="Logout"
            >
              <LogOut size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
