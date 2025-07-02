import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShouldAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!stats) return null;

  const statusStyles = {
    Draft: {
      bg: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: <Clock className="w-4 h-4" />,
      dot: "bg-gray-400"
    },
    Sent: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <FileText className="w-4 h-4" />,
      dot: "bg-blue-400"
    },
    Paid: {
      bg: "bg-gradient-to-r from-green-50 to-green-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-4 h-4" />,
      dot: "bg-green-400"
    },
  };

  // Calculate growth percentages (mock data for demo)
  const growthData = {
    totalInvoices: { value: 15, isPositive: true },
    totalRevenue: { value: 23, isPositive: true },
    invoicesThisMonth: { value: 8, isPositive: true },
    avgInvoiceValue: { value: -3, isPositive: false }
  };

  const avgInvoiceValue = stats.totalInvoices > 0 ? stats.totalRevenue / stats.totalInvoices : 0;

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invoices */}
        <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {growthData.totalInvoices.isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  growthData.totalInvoices.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growthData.totalInvoices.value}%
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                {shouldAnimate && <CountUp end={stats.totalInvoices} duration={1.2} />}
              </p>
              <p className="text-xs text-gray-500 mt-2">All time invoices</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {growthData.totalRevenue.isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  growthData.totalRevenue.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growthData.totalRevenue.value}%
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                {shouldAnimate && (
                  <>
                    $<CountUp end={stats.totalRevenue} duration={1.5} decimals={2} />
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total earnings</p>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {growthData.invoicesThisMonth.isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  growthData.invoicesThisMonth.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growthData.invoicesThisMonth.value}%
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {shouldAnimate && <CountUp end={stats.invoicesThisMonth} duration={1.2} />}
              </p>
              <p className="text-xs text-gray-500 mt-2">Monthly invoices</p>
            </div>
          </div>
        </div>

        {/* Average Invoice Value */}
        <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {growthData.avgInvoiceValue.isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  growthData.avgInvoiceValue.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(growthData.avgInvoiceValue.value)}%
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Invoice</p>
              <p className="text-3xl font-bold text-gray-900">
                {shouldAnimate && (
                  <>
                    $<CountUp end={avgInvoiceValue} duration={1.3} decimals={0} />
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">Average value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Invoice Status Breakdown</h3>
            <p className="text-sm text-gray-600">Current status distribution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.statusBreakdown.map((status, idx) => {
            const statusStyle = statusStyles[status._id] || statusStyles.Draft;
            const percentage = stats.totalInvoices > 0 ? 
              Math.round((status.count / stats.totalInvoices) * 100) : 0;
            
            return (
              <div
                key={idx}
                className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${statusStyle.bg} ${statusStyle.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {statusStyle.icon}
                    <span className={`font-semibold text-sm ${statusStyle.text}`}>
                      {status._id}
                    </span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {shouldAnimate && <CountUp end={status.count} duration={1} />}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {percentage}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                        status._id === 'Draft' ? 'bg-gray-400' :
                        status._id === 'Sent' ? 'bg-blue-400' : 'bg-green-400'
                      }`}
                      style={{ 
                        width: shouldAnimate ? `${percentage}%` : '0%',
                        transitionDelay: `${idx * 200}ms`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-600">Total Invoices</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {shouldAnimate && <CountUp end={stats.totalInvoices} duration={1.5} />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
