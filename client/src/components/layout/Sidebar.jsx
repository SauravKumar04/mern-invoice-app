import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Building2,
  User,
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
        fixed top-0 left-0 h-full w-64 z-50 bg-gradient-to-b from-purple-900 via-violet-800 to-purple-700 text-white backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex-shrink-0
      `}
    >
      <div className="px-6 pt-20 h-full overflow-y-auto">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-purple-300 rounded-xl w-14 h-14 flex items-center justify-center text-purple-200 text-xl font-semibold shadow-inner">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate text-white">{currentUser?.name || 'User'}</h2>
            <p className="text-xs text-purple-300 truncate">{currentUser?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Close on mobile tap
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-purple-900 shadow-inner'
                        : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3 group-hover:scale-110 transition-transform duration-200 text-white group-hover:text-white">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
