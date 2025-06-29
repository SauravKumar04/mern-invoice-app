import React from "react";
import { format } from "date-fns";

const InvoiceItem = ({ invoice }) => {
  const statusColors = {
    Draft: "bg-yellow-100 text-yellow-800 ring-yellow-300",
    Sent: "bg-blue-100 text-blue-800 ring-blue-300",
    Paid: "bg-green-100 text-green-800 ring-green-300",
  };

  return (
    <div
      className="bg-white border border-violet-100 rounded-2xl shadow-md p-4 sm:p-6 mb-6
                 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1
                 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      {/* Left: Invoice number + client */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-semibold text-violet-900 truncate">
          {invoice.invoiceNumber}
        </h3>
        <p className="text-sm text-violet-600 truncate">{invoice.clientName}</p>
      </div>

      {/* Status badge */}
      <div className="sm:ml-6 flex-shrink-0">
        <span
          className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold
                      ring-1 ring-inset ${statusColors[invoice.status]}`}
          aria-label={`Status: ${invoice.status}`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm w-full sm:w-auto">
        <div>
          <p className="text-violet-500 uppercase tracking-wide font-semibold">
            Issue Date
          </p>
          <p className="font-medium text-violet-800">
            {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-violet-500 uppercase tracking-wide font-semibold">
            Due Date
          </p>
          <p className="font-medium text-violet-800">
            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-violet-500 uppercase tracking-wide font-semibold">
            Amount
          </p>
          <p className="font-medium text-violet-800">
            ${invoice.total.toFixed(2)}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1 truncate">
          <p className="text-violet-500 uppercase tracking-wide font-semibold">
            Client Email
          </p>
          <p
            className="font-medium text-violet-800 truncate"
            title={invoice.clientEmail}
          >
            {invoice.clientEmail}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 sm:ml-8">
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-md
                     border border-violet-300 text-violet-700 hover:border-violet-500 hover:text-violet-900
                     focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 transition"
        >
          View
        </button>
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-md
                     bg-violet-600 text-white hover:bg-violet-700
                     focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 transition"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default InvoiceItem;
