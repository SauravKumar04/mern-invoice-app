import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import {
  ArrowUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShouldAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!stats) return null;

  const statusMap = {
    Draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
    Sent: { color: 'bg-purple-100 text-purple-800', label: 'Sent' },
    Paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
  };

  const cardBase =
    'bg-white/80 backdrop-blur-md border border-purple-100 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center text-center min-h-[160px]';

  const iconWrapper =
    'p-3 rounded-xl flex items-center justify-center shadow-inner bg-white ring-2 ring-purple-200 group-hover:ring-purple-400 transition duration-300';

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Total Invoices */}
      <div className={`${cardBase} group`}>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={iconWrapper}>
            <DocumentTextIcon className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Total Invoices</p>
          <p className="text-3xl font-bold text-purple-900">
            {shouldAnimate && <CountUp end={stats.totalInvoices} duration={1.2} />}
          </p>
        </div>
      </div>

      {/* Total Revenue */}
      <div className={`${cardBase} group`}>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={`${iconWrapper} bg-green-100 ring-green-200`}>
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-purple-900">
            {shouldAnimate && (
              <>
                $<CountUp end={stats.totalRevenue} duration={1.5} decimals={2} />
              </>
            )}
          </p>
        </div>
      </div>

      {/* Invoices This Month */}
      <div className={`${cardBase} group`}>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={`${iconWrapper} bg-indigo-100 ring-indigo-200`}>
            <ArrowUpIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm font-semibold text-gray-500">This Month</p>
          <p className="text-3xl font-bold text-purple-900">
            {shouldAnimate && <CountUp end={stats.invoicesThisMonth} duration={1.2} />}
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className={cardBase}>
        <div className="w-full text-center">
          <p className="text-sm font-semibold text-gray-500 mb-4">Status Breakdown</p>
          <div className="space-y-3">
            {stats.statusBreakdown.map((status, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm px-4"
              >
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-xs shadow-sm ${
                    statusMap[status._id]?.color || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {statusMap[status._id]?.label || status._id}
                </span>
                <span className="font-semibold text-gray-800">
                  {shouldAnimate && <CountUp end={status.count} duration={1} />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
