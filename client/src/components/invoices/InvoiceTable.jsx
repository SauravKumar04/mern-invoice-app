import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import InvoicePDF from "./InvoicePDF";
import { deleteInvoice } from "../../api/invoices";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle
} from "lucide-react";

const statusStyles = {
  Draft: {
    bg: "bg-gradient-to-r from-gray-50 to-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    icon: <FileText className="w-3 h-3" />
  },
  Sent: {
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <Clock className="w-3 h-3" />
  },
  Paid: {
    bg: "bg-gradient-to-r from-green-50 to-green-100",
    text: "text-green-700",
    border: "border-green-200",
    icon: <CheckCircle className="w-3 h-3" />
  },
};

const InvoiceTable = ({ invoices, onDelete }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
        <p className="text-gray-500 text-center max-w-md">
          You haven't created any invoices yet. Create your first invoice to get started.
        </p>
        <Link
          to="/invoices/create"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          Create First Invoice
        </Link>
      </div>
    );
  }

  const handleDelete = async (id, number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete invoice #${number}?`
    );
    if (!confirmed) return;

    try {
      await deleteInvoice(id);
      toast.success(`Invoice #${number} deleted`);
      if (onDelete) onDelete(id);
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  };

  const calculateAmount = (invoice) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const taxAmount = subtotal * (invoice.tax / 100);
    const discountAmount = subtotal * (invoice.discount / 100);
    return subtotal + taxAmount - discountAmount;
  };

  return (
    <div className="w-full">
      {/* 👇 Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                { key: "invoice", label: "Invoice", icon: <FileText className="w-4 h-4" /> },
                { key: "client", label: "Client", icon: <User className="w-4 h-4" /> },
                { key: "date", label: "Due Date", icon: <Calendar className="w-4 h-4" /> },
                { key: "amount", label: "Amount", icon: <DollarSign className="w-4 h-4" /> },
                { key: "status", label: "Status" },
                { key: "actions", label: "Actions", align: "right" },
              ].map((header, i) => (
                <th
                  key={header.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    header.align === "right" ? "text-right" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {header.icon}
                    {header.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((invoice, index) => {
              const amount = calculateAmount(invoice);
              const statusStyle = statusStyles[invoice.status] || statusStyles.Draft;
              
              return (
                <tr
                  key={invoice._id}
                  className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">
                          {invoice.invoiceNumber?.slice(-2) || "##"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{invoice.invoiceNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(invoice.createdAt || Date.now()), "MMM dd")}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="max-w-[200px]">
                      <div className="text-sm font-medium text-gray-900 truncate" title={invoice.clientName}>
                        {invoice.clientName}
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={invoice.clientEmail}>
                        {invoice.clientEmail}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.icon}
                      {invoice.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <InvoicePDF invoiceId={invoice._id} />
                      
                      <Link
                        to={`/invoices/view/${invoice._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-all duration-200 border border-blue-200 hover:border-blue-300"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      
                      <Link
                        to={`/invoices/edit/${invoice._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition-all duration-200 border border-purple-200 hover:border-purple-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 👇 Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {invoices.map((invoice, index) => {
          const amount = calculateAmount(invoice);
          const statusStyle = statusStyles[invoice.status] || statusStyles.Draft;
          
          return (
            <div
              key={invoice._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {invoice.invoiceNumber?.slice(-2) || "##"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        #{invoice.invoiceNumber}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Created {format(new Date(invoice.createdAt || Date.now()), "MMM dd")}
                      </p>
                    </div>
                  </div>
                  
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    {statusStyle.icon}
                    {invoice.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Client Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {invoice.clientName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {invoice.clientEmail}
                    </p>
                  </div>
                </div>

                {/* Due Date & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ${amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <InvoicePDF invoiceId={invoice._id} />
                  
                  <Link
                    to={`/invoices/view/${invoice._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium rounded-lg transition-all duration-200 border border-blue-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  
                  <Link
                    to={`/invoices/edit/${invoice._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium rounded-lg transition-all duration-200 border border-purple-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(invoice._id, invoice.invoiceNumber)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium rounded-lg transition-all duration-200 border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvoiceTable;
