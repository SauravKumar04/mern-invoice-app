import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, FileText } from 'lucide-react';
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
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Invoice Logo & Text */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl sm:text-2xl tracking-tight">
            <FileText className="w-6 h-6 text-white drop-shadow" />
            <span className="bg-gradient-to-r from-violet-100 to-white bg-clip-text text-transparent">
              Invoice App
            </span>
          </Link>
        </div>

        {/* Right: User Info + Logout */}
        {currentUser && (
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3">
              <Avatar 
                src={currentUser.avatar} 
                name={currentUser.name} 
                size="md"
              />
              <span className="text-sm sm:text-base font-medium text-white max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base rounded-md font-semibold transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
