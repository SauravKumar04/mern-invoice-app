import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import InvoicePDF from './InvoicePDF';
import { deleteInvoice } from '../../api/invoices';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const statusColors = {
  Draft: 'bg-yellow-100 text-yellow-800 ring-yellow-300',
  Sent: 'bg-blue-100 text-blue-800 ring-blue-300',
  Paid: 'bg-green-100 text-green-800 ring-green-300',
};

const InvoiceTable = ({ invoices, onDelete }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500 italic select-none">
        No invoices found
      </div>
    );
  }

  const handleDelete = async (id, number) => {
    const confirmed = window.confirm(`Are you sure you want to delete invoice #${number}?`);
    if (!confirmed) return;

    try {
      await deleteInvoice(id);
      toast.success(`Invoice #${number} deleted`);
      if (onDelete) onDelete(id);
    } catch (err) {
      toast.error('Failed to delete invoice');
    }
  };

  return (
    <div className="w-full">
      {/* 👇 Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-[750px] w-full divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Invoice #', 'Client', 'Due Date', 'Amount', 'Status', 'Actions'].map((title, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                    title === 'Actions' ? 'text-right' : ''
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-[150px]">
                  <div className="truncate" title={invoice.clientName}>
                    {invoice.clientName}
                  </div>
                  <div className="text-xs text-gray-500 truncate" title={invoice.clientEmail}>
                    {invoice.clientEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                      statusColors[invoice.status] || 'bg-gray-100 text-gray-800 ring-gray-300'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-2 items-end sm:items-center">
                    <InvoicePDF invoiceId={invoice._id} />
                    <Link
                      to={`/invoices/view/${invoice._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold transition"
                    >
                      <FaEye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <Link
                      to={`/invoices/edit/${invoice._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 text-xs font-semibold transition"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 👇 Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-purple-600 font-semibold">#{invoice.invoiceNumber}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ring-1 ring-inset ${
                  statusColors[invoice.status] || 'bg-gray-100 text-gray-800 ring-gray-300'
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Client:</strong> {invoice.clientName}
            </p>
            <p className="text-xs text-gray-500 mb-2 truncate">{invoice.clientEmail}</p>
            <p className="text-sm text-gray-700">
              <strong>Due:</strong> {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
            </p>
            <p className="text-sm text-gray-900 font-semibold">
              <strong>Total:</strong> ${invoice.total.toFixed(2)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <InvoicePDF invoiceId={invoice._id} />
              <Link
                to={`/invoices/view/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200"
              >
                <FaEye className="w-3.5 h-3.5" />
                View
              </Link>
              <Link
                to={`/invoices/edit/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded hover:bg-violet-700"
              >
                <FaEdit className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
              >
                <FaTrash className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTable;
