import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../../api/invoices';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import InvoiceTable from '../../components/invoices/InvoiceTable';
import Loader from '../../components/ui/Loader';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', due: '' });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices(filters);
        setInvoices(data);
      } catch (error) {
        toast.error('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white/90 border border-purple-100 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-violet-800 tracking-tight">Invoices</h1>
          <Link
            to="/invoices/create"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 shadow-md transition"
          >
            + Create Invoice
          </Link>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <select
              name="due"
              value={filters.due}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">All</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming (7 days)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          <InvoiceTable
            invoices={invoices}
            onDelete={(id) => setInvoices((prev) => prev.filter((inv) => inv._id !== id))}
          />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
