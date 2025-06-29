import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/invoices';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import InvoiceList from '../components/dashboard/InvoiceList';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-violet-200 to-indigo-100 px-4">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-10 transition-all duration-300">
      {/* Header */}
      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-700 to-indigo-600">
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''} 👋
        </h1>
        <p className="text-base text-purple-500 mt-2">
          Here’s what’s happening with your invoices today.
        </p>
      </header>

      {/* Stats */}
      <section className="mb-10">
        <div className="bg-white border border-purple-100 rounded-3xl shadow-md hover:shadow-xl p-6 sm:p-8 transition-all duration-300">
          <DashboardStats stats={stats} />
        </div>
      </section>

      {/* Invoices and Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-indigo-100 rounded-3xl shadow-md hover:shadow-xl p-6 transition-all duration-300">
            <InvoiceList />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-pink-100 rounded-3xl shadow-md hover:shadow-xl p-6 transition-all duration-300">
            <RecentActivity />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
