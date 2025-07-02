import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../api/invoices';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { FileText, Send, CheckCircle, FilePlus, Activity, Clock, ArrowRight } from 'lucide-react';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getInvoices();
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setActivity(sorted);
      } catch (error) {
        toast.error('Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getActivityConfig = (status) => {
    switch (status) {
      case 'Draft':
        return {
          icon: <FilePlus className="w-5 h-5" />,
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-200',
          dotColor: 'bg-yellow-400'
        };
      case 'Sent':
        return {
          icon: <Send className="w-5 h-5" />,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          dotColor: 'bg-blue-400'
        };
      case 'Paid':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200',
          dotColor: 'bg-green-400'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5" />,
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const getActivityMessage = (invoice) => {
    const config = getActivityConfig(invoice.status);
    if (invoice.status === 'Draft') return {
      title: `Created invoice #${invoice.invoiceNumber}`,
      subtitle: `For ${invoice.clientName}`,
      config
    };
    if (invoice.status === 'Sent') return {
      title: `Sent invoice #${invoice.invoiceNumber}`,
      subtitle: `To ${invoice.clientName}`,
      config
    };
    if (invoice.status === 'Paid') return {
      title: `Payment received for #${invoice.invoiceNumber}`,
      subtitle: `From ${invoice.clientName}`,
      config
    };
    return {
      title: `Updated invoice #${invoice.invoiceNumber}`,
      subtitle: `For ${invoice.clientName}`,
      config
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest invoice updates</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activity.length > 0 ? (
          activity.map((invoice, index) => {
            const { title, subtitle, config } = getActivityMessage(invoice);
            return (
              <div
                key={invoice._id}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border ${config.bgColor} ${config.borderColor} ${config.iconColor} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
                      <span className="text-xs text-gray-400 font-medium">
                        {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Additional info on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recent activity</h3>
            <p className="text-gray-500 mb-4">Invoice activities will appear here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activity.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {activity.length} recent activities
          </p>
          <button className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors duration-200 group">
            View all activity
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
