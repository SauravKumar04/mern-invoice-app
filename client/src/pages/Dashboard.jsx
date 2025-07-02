import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/invoices';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import InvoiceList from '../components/dashboard/InvoiceList';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Clock,
  BarChart3,
  FileText,
  DollarSign,
  Activity,
  Users,
  Star,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative">
            <Loader size="lg" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Gathering your latest data</p>
        </div>
      </div>
    );
  }

  const currentTime = new Date().getHours();
  const getGreeting = () => {
    if (currentTime < 12) return { text: 'Good morning', icon: <Sun className="w-6 h-6" /> };
    if (currentTime < 18) return { text: 'Good afternoon', icon: <Sunset className="w-6 h-6" /> };
    return { text: 'Good evening', icon: <Moon className="w-6 h-6" /> };
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
      <div className="fixed top-40 left-10 opacity-15 pointer-events-none">
        <Star className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="fixed bottom-40 right-20 opacity-10 pointer-events-none">
        <TrendingUp className="w-7 h-7 text-indigo-500 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className={`max-w-7xl mx-auto mb-8 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/20 to-blue-100/30 rounded-full blur-xl" />
          
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left side - Greeting */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-500">
                      {greeting.icon}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {greeting.text}{currentUser?.name ? `, ${currentUser.name}` : ''}
                    </h1>
                    <span className="text-2xl">👋</span>
                  </div>
                  <p className="text-gray-600 text-base max-w-lg">
                    Welcome back to your invoice dashboard. Here's an overview of your business today.
                  </p>
                </div>
              </div>

              {/* Right side - Quick stats */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats?.totalInvoices || 0}
                  </p>
                  <p className="text-xs text-blue-600">Invoices</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    ${(stats?.totalRevenue || 0).toFixed(0)}
                  </p>
                  <p className="text-xs text-green-600">Total earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className={`max-w-7xl mx-auto mb-8 transition-all duration-1000 delay-300 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
              <p className="text-gray-600">Track your business performance and growth</p>
            </div>
          </div>
        </div>

        <DashboardStats stats={stats} />
      </div>

      {/* Content Grid */}
      <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 relative group">
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <InvoiceList />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 relative group">
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-600">Latest updates and changes</p>
                  </div>
                </div>
              </div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className={`max-w-7xl mx-auto mt-8 transition-all duration-1000 delay-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ready to create your next invoice?</h3>
                <p className="text-violet-100 text-sm">Streamline your billing process with our modern tools</p>
              </div>
            </div>
            
            <button className="group bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Create Invoice
                <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default Dashboard;
