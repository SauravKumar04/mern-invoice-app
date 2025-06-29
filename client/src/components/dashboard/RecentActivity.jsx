import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../api/invoices';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { FileText, Send, CheckCircle, FilePlus } from 'lucide-react';

const RecentActivity = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getInvoices();
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setActivity(sorted);
      } catch (error) {
        toast.error('Failed to load activity');
      }
    };

    fetchActivity();
  }, []);

  const getIcon = (status) => {
    switch (status) {
      case 'Draft':
        return <FilePlus className="w-5 h-5 text-yellow-500" />;
      case 'Sent':
        return <Send className="w-5 h-5 text-blue-500" />;
      case 'Paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityMessage = (invoice) => {
    if (invoice.status === 'Draft') return `Created invoice #${invoice.invoiceNumber}`;
    if (invoice.status === 'Sent') return `Sent invoice #${invoice.invoiceNumber}`;
    if (invoice.status === 'Paid') return `${invoice.clientName} paid invoice #${invoice.invoiceNumber}`;
    return `Updated invoice #${invoice.invoiceNumber}`;
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-bold text-purple-700 mb-5">📌 Recent Activity</h2>

      <ul className="space-y-4">
        {activity.length > 0 ? (
          activity.map((invoice) => (
            <li
              key={invoice._id}
              className="flex items-start gap-4 p-4 rounded-xl bg-purple-50/20 hover:bg-purple-100/20 transition-all duration-200 border border-transparent hover:border-purple-200"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 shadow-inner">
                {getIcon(invoice.status)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {getActivityMessage(invoice)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500 italic text-center">No recent activity</li>
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;
