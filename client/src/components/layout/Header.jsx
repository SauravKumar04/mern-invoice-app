import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, FileText, LogOut, Sparkles } from 'lucide-react';
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
    <header className="w-full relative overflow-hidden">
      {/* Animated background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      
      {/* Floating sparkles */}
      <div className="absolute top-2 right-20 animate-pulse">
        <Sparkles className="w-3 h-3 text-white/30" />
      </div>
      <div className="absolute top-4 left-32 animate-pulse animation-delay-1000">
        <Sparkles className="w-2 h-2 text-fuchsia-200/40" />
      </div>
      
      {/* Main header content */}
      <div className="relative z-10 backdrop-blur-sm border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={onMenuClick}
                className="group p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
              >
                <Menu size={20} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* Invoice Logo & Text */}
            <Link to="/" className="group flex items-center gap-2 text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight transition-all duration-300 hover:scale-105">
              <div className="relative">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-white via-violet-100 to-fuchsia-100 bg-clip-text text-transparent drop-shadow-sm">
                Invoice App
              </span>
            </Link>
          </div>

          {/* Right: User Info + Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
              {/* Desktop: Full user info */}
              <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <Avatar 
                  src={currentUser.avatar} 
                  name={currentUser.name} 
                  size="md"
                  className="ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300 shadow-lg"
                />
                <div className="min-w-0">
                  <span className="block text-sm lg:text-base font-semibold text-white max-w-[120px] lg:max-w-[150px] truncate drop-shadow-sm">
                    {currentUser.name}
                  </span>
                  <span className="block text-xs text-violet-100/80 truncate">
                    Welcome back!
                  </span>
                </div>
              </div>

              {/* Mobile: Only avatar */}
              <div className="sm:hidden group">
                <Avatar 
                  src={currentUser.avatar} 
                  name={currentUser.name} 
                  size="sm"
                  className="ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 shadow-lg transform group-hover:scale-110"
                />
              </div>

              {/* Logout button - icon only on mobile, full button on desktop */}
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl backdrop-blur-sm border border-red-400/30
                           px-2 py-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2
                           text-sm lg:text-base relative overflow-hidden"
                title="Logout"
              >
                <LogOut size={16} className="sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">Logout</span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
