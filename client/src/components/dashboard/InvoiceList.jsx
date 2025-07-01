import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getInvoices, deleteInvoice } from "../../api/invoices";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

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

  const statusColors = {
    Draft: "bg-yellow-100 text-yellow-800",
    Sent: "bg-purple-100 text-purple-800",
    Paid: "bg-green-100 text-green-800",
  };

  return (
    <div className="bg-white shadow-md border border-purple-200 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>
      </div>

      {/* ✅ Desktop Table */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              {[
                "Invoice #",
                "Client",
                "Issue Date",
                "Due Date",
                "Amount",
                "Status",
                "Actions",
              ].map((title, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-left font-semibold ${
                    title === "Actions" ? "text-right" : ""
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <tr
                key={invoice._id}
                className="hover:bg-purple-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {invoice.clientName}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 font-semibold text-purple-700 whitespace-nowrap">
                  $
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      statusColors[invoice.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                  <Link
                    to={`/invoices/view/${invoice._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <Link
                    to={`/invoices/edit/${invoice._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs font-medium hover:bg-purple-700 transition"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile View */}
      <div className="sm:hidden px-4 py-4 space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-purple-700 font-semibold text-sm">
                #{invoice.invoiceNumber}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  statusColors[invoice.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-sm text-gray-800">
              <strong>Client:</strong> {invoice.clientName}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Issue:</strong>{" "}
              {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Due:</strong>{" "}
              {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
            </p>
            <p className="text-sm text-purple-700 font-bold">
              <strong>Total:</strong> $
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
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to={`/invoices/view/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200"
              >
                <FaEye className="w-3.5 h-3.5" />
                View
              </Link>
              <Link
                to={`/invoices/edit/${invoice._id}`}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700"
              >
                <FaEdit className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(invoice._id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
              >
                <FaTrash className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-4 bg-gray-50 text-right">
        <Link
          to="/invoices"
          className="text-purple-600 hover:text-purple-800 text-sm font-medium transition"
        >
          View all invoices →
        </Link>
      </div>
    </div>
  );
};

export default InvoiceList;
