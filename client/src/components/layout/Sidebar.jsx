import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Building2,
  User,
  Sparkles,
  Star,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Invoices', path: '/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Company Settings', path: '/company-settings', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Animated background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900 via-purple-900 to-fuchsia-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 backdrop-blur-xl border-r border-white/10" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-4 animate-pulse">
        <Sparkles className="w-3 h-3 text-violet-300/40" />
      </div>
      <div className="absolute top-40 left-4 animate-pulse animation-delay-1000">
        <Star className="w-2 h-2 text-fuchsia-300/30" />
      </div>
      <div className="absolute bottom-40 right-6 animate-pulse animation-delay-500">
        <Star className="w-4 h-4 text-purple-300/20" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-20 overflow-y-auto">
        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-8 shadow-xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-xl w-14 h-14 flex items-center justify-center text-white text-xl font-bold shadow-lg border border-white/20">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold truncate text-white drop-shadow-sm">
                {currentUser?.name || 'User'}
              </h2>
              <p className="text-xs text-violet-200/80 truncate">
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-shrink-0">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-violet-200/60 uppercase tracking-wider px-2">
              Navigation
            </h3>
          </div>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Close on mobile tap
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-sm'
                        : 'text-violet-200 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                    }`
                  }
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <span className="relative z-10 mr-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                    {item.icon}
                  </span>
                  <span className="relative z-10 drop-shadow-sm">{item.name}</span>
                  
                  {/* Active indicator */}
                  <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom decorative section - pushed to bottom */}
        <div className="mt-auto pt-8 pb-6 flex-shrink-0">
          <div className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-violet-300 animate-pulse" />
            </div>
            <p className="text-xs text-violet-200/80 font-medium">
              Invoice Management
            </p>
            <p className="text-xs text-violet-300/60">
              Made with ❤️
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
