import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getInvoiceById, sendInvoiceEmail } from "../../api/invoices";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import InvoicePDF from "../../components/invoices/InvoicePDF";
import { format } from "date-fns";

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(id);
        setInvoice(data.invoice);
        setCompany(data.company);
      } catch (error) {
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleSendEmail = async () => {
    setSending(true);
    try {
      await sendInvoiceEmail(id);
      toast.success("Invoice sent via email");
    } catch (error) {
      toast.error("Failed to send invoice email");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-purple-100">
      {/* Top header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">
            Invoice #{invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-purple-500">
            Issued on {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <InvoicePDF invoiceId={id} />
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
          <Link
            to={`/invoices/edit/${id}`}
            className="px-4 py-2 rounded-md bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Sender & Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-purple-900 mb-2">From</h2>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-1">
            <p className="font-medium text-purple-800">{company?.name || "Your Company"}</p>
            <p className="text-sm text-purple-700">{company?.address}</p>
            <p className="text-sm text-purple-700">{company?.phone}</p>
            <p className="text-sm text-purple-700">{company?.website}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-purple-900 mb-2">Bill To</h2>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-1">
            <p className="font-medium text-purple-800">{invoice.clientName}</p>
            <p className="text-sm text-purple-700">{invoice.clientEmail}</p>
            <p className="text-sm text-purple-700">{invoice.clientAddress}</p>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Invoice Items</h2>
        <div className="overflow-x-auto border border-purple-200 rounded-lg">
          <table className="min-w-full divide-y divide-purple-200 text-sm">
            <thead className="bg-purple-50">
              <tr>
                {["Description", "Qty", "Price", "Total"].map((title, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left font-semibold text-purple-700 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {invoice.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-purple-900">{item.description}</td>
                  <td className="px-6 py-4 text-purple-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-purple-700">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-purple-900 font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full sm:w-1/2 md:w-1/3 bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
          <div className="flex justify-between text-sm text-purple-800">
            <span>Subtotal</span>
            <span>
              $
              {invoice.items
                .reduce((sum, item) => sum + item.quantity * item.price, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-purple-800">
            <span>Tax ({invoice.tax}%)</span>
            <span>
              $
              {(
                invoice.items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                ) *
                  (invoice.tax / 100)
              ).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-purple-800">
            <span>Discount ({invoice.discount}%)</span>
            <span>
              $
              {(
                invoice.items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                ) *
                  (invoice.discount / 100)
              ).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold text-purple-900 border-t border-purple-200">
            <span>Total</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">Notes</h2>
          <p className="text-sm text-purple-700 bg-purple-50 p-4 rounded-md border border-purple-200">
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="border-t border-purple-200 pt-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-purple-700">
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
