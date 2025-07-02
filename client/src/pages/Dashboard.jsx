import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/invoices';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import InvoiceList from '../components/dashboard/InvoiceList';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { Sparkles, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50 px-4">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentTime = new Date().getHours();
  const getGreeting = () => {
    if (currentTime < 12) return 'Good morning';
    if (currentTime < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 px-4 py-6 sm:px-6 lg:px-10">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 animate-pulse opacity-20">
        <Sparkles className="w-6 h-6 text-violet-400" />
      </div>
      <div className="fixed top-40 left-10 animate-pulse opacity-15 animation-delay-1000">
        <TrendingUp className="w-5 h-5 text-purple-400" />
      </div>

      {/* Header */}
      <header className={`mb-8 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/30 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                <span className="text-sm text-gray-500 font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">
                {getGreeting()}{currentUser?.name ? `, ${currentUser.name}` : ''} 👋
              </h1>
              <p className="text-base text-gray-600 mt-2">
                Here's what's happening with your invoices today.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className={`mb-10 transition-all duration-1000 delay-300 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full blur-lg" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
            </div>
            <DashboardStats stats={stats} />
          </div>
        </div>
      </section>

      {/* Invoices and Activity */}
      <section className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden group">
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
              </div>
              <InvoiceList />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden group">
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default Dashboard;
