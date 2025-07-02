import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../../api/invoices';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import InvoiceTable from '../../components/invoices/InvoiceTable';
import Loader from '../../components/ui/Loader';
import { 
  PlusCircle, 
  FileText, 
  Search, 
  Filter, 
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', due: '' });
  const [searchTerm, setSearchTerm] = useState('');
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

  // Calculate statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Sent').length,
    draft: invoices.filter(inv => inv.status === 'Draft').length,
    totalAmount: invoices.reduce((sum, inv) => {
      const amount = inv.items.reduce((itemSum, item) => itemSum + item.quantity * item.price, 0);
      return sum + (amount + amount * (inv.tax / 100) - amount * (inv.discount / 100));
    }, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading your invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title & Subtitle */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Invoice Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <Link
            to="/invoices/create"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create New Invoice
            <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Invoices */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12% from last month</span>
            </div>
          </div>

          {/* Paid */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.paid}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}% completion rate
              </span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">Needs attention</span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">${stats.totalAmount.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+8% revenue growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">All Invoices</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {invoices.length} invoices
                </span>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">All Status</option>
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="due"
                      value={filters.due}
                      onChange={handleFilterChange}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">All Dates</option>
                      <option value="overdue">Overdue</option>
                      <option value="upcoming">Due Soon</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            <InvoiceTable
              invoices={invoices.filter(invoice => 
                invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onDelete={(id) => setInvoices((prev) => prev.filter((inv) => inv._id !== id))}
            />
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-20 pointer-events-none">
        <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default Invoices;
