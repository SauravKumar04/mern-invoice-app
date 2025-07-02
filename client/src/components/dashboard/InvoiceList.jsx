import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getInvoices, deleteInvoice } from "../../api/invoices";
import { toast } from "react-toastify";
import { Eye, Edit3, Trash2, FileText, ArrowRight, DollarSign } from "lucide-react";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      try {
        const all = await getInvoices();
        const sorted = all
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setInvoices(sorted);
      } catch (error) {
        toast.error("Failed to load recent invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id);
        toast.success("Invoice deleted");
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      } catch (error) {
        toast.error("Failed to delete invoice");
      }
    }
  };

  const statusConfig = {
    Draft: { 
      bg: "bg-yellow-50", 
      text: "text-yellow-700", 
      border: "border-yellow-200",
      dot: "bg-yellow-400"
    },
    Sent: { 
      bg: "bg-blue-50", 
      text: "text-blue-700", 
      border: "border-blue-200",
      dot: "bg-blue-400"
    },
    Paid: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-200",
      dot: "bg-green-400"
    },
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
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
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl text-white shadow-lg">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Recent Invoices</h2>
          <p className="text-sm text-gray-500">Latest invoice activity</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200">
            <tr>
              {[
                "Invoice",
                "Client",
                "Date",
                "Amount",
                "Status",
                "Actions",
              ].map((title, i) => (
                <th
                  key={i}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 ${
                    title === "Actions" ? "text-right" : ""
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {invoices.map((invoice, index) => (
              <tr
                key={invoice._id}
                className="hover:bg-gray-50 transition-colors duration-200 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="font-semibold text-gray-800">
                      #{invoice.invoiceNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{invoice.clientName}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">
                      {invoice.clientEmail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(invoice.dueDate), "MMM dd")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-800">
                      {(
                        invoice.items.reduce(
                          (sum, item) => sum + item.quantity * item.price,
                          0
                        ) +
                        invoice.items.reduce(
                          (sum, item) => sum + item.quantity * item.price,
                          0
                        ) *
                          (invoice.tax / 100) -
                        invoice.items.reduce(
                          (sum, item) => sum + item.quantity * item.price,
                          0
                        ) *
                          (invoice.discount / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                    statusConfig[invoice.status]?.bg || "bg-gray-50"
                  } ${
                    statusConfig[invoice.status]?.text || "text-gray-700"
                  } ${
                    statusConfig[invoice.status]?.border || "border-gray-200"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      statusConfig[invoice.status]?.dot || "bg-gray-400"
                    }`} />
                    <span className="text-xs font-semibold">{invoice.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      to={`/invoices/view/${invoice._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <Link
                      to={`/invoices/edit/${invoice._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {invoices.map((invoice, index) => (
          <div
            key={invoice._id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                <h3 className="font-bold text-gray-800">
                  #{invoice.invoiceNumber}
                </h3>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                statusConfig[invoice.status]?.bg || "bg-gray-50"
              } ${
                statusConfig[invoice.status]?.text || "text-gray-700"
              } ${
                statusConfig[invoice.status]?.border || "border-gray-200"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  statusConfig[invoice.status]?.dot || "bg-gray-400"
                }`} />
                {invoice.status}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-medium text-gray-600">Client:</span>{" "}
                <span className="text-gray-800">{invoice.clientName}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">Date:</span>{" "}
                <span className="text-gray-800">
                  {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-600 text-sm">Amount:</span>
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-gray-800">
                  {(
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    ) +
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    ) *
                      (invoice.tax / 100) -
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    ) *
                      (invoice.discount / 100)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/invoices/view/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </Link>
              <Link
                to={`/invoices/edit/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg hover:bg-violet-100 transition-colors duration-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(invoice._id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No invoices yet</h3>
          <p className="text-gray-500 mb-4">Create your first invoice to get started</p>
          <Link
            to="/invoices/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-colors duration-200"
          >
            Create Invoice
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Footer */}
      {invoices.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {invoices.length} of recent invoices
          </p>
          <Link
            to="/invoices"
            className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors duration-200 group"
          >
            View all invoices
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
