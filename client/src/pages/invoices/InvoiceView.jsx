import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getInvoiceById, sendInvoiceEmail } from "../../api/invoices";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import InvoicePDF from "../../components/invoices/InvoicePDF";
import TemplatePDFDownload from "../../components/invoices/TemplatePDFDownload";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit3, 
  Mail, 
  Download,
  Sparkles,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  MapPin,
  Phone,
  Globe,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Send,
  Eye,
  TrendingUp
} from "lucide-react";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      toast.success("Invoice sent via email successfully!");
    } catch (error) {
      toast.error("Failed to send invoice email");
    } finally {
      setSending(false);
    }
  };

  const statusStyles = {
    Draft: {
      bg: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: <Clock className="w-4 h-4" />
    },
    Sent: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <Send className="w-4 h-4" />
    },
    Paid: {
      bg: "bg-gradient-to-r from-green-50 to-green-100",
      text: "text-green-700",
      border: "border-green-200",
      icon: <CheckCircle className="w-4 h-4" />
    },
  };

  const calculateTotal = () => {
    if (!invoice) return 0;
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (invoice.tax / 100);
    const discountAmount = subtotal * (invoice.discount / 100);
    return subtotal + taxAmount - discountAmount;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative">
            <Loader size="lg" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading invoice...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your invoice details</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice not found</h3>
          <p className="text-gray-500 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/invoices')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = statusStyles[invoice.status] || statusStyles.Draft;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
      <div className="fixed top-40 left-10 opacity-15 pointer-events-none">
        <Star className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="fixed bottom-20 right-20 opacity-10 pointer-events-none">
        <Receipt className="w-7 h-7 text-indigo-500 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/invoices')}
              className="group p-2 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
            </button>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Invoice #{invoice.invoiceNumber}</h1>
              <p className="text-gray-600 mt-1">Detailed view and management</p>
            </div>
          </div>

          {/* Invoice Status Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {invoice.invoiceNumber?.slice(-2) || "##"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    {statusStyle.icon}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {statusStyle.icon}
                      {invoice.status}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Issued {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Due {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <TemplatePDFDownload 
                  invoiceId={id} 
                  invoiceNumber={invoice.invoiceNumber}
                  currentTemplate={invoice.template}
                />
                <InvoicePDF invoiceId={id} />
                
                <button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Send Email
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
                
                <Link
                  to={`/invoices/edit/${id}`}
                  className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    Edit Invoice
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          
          {/* Company Information */}
          <div className={`transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">From</h3>
                    <p className="text-sm text-gray-600">Your company details</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{company?.name || "Your Company"}</h4>
                  </div>
                  
                  {company?.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <span className="text-sm">{company.address}</span>
                    </div>
                  )}
                  
                  {company?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{company.phone}</span>
                    </div>
                  )}
                  
                  {company?.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{company.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className={`transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Bill To</h3>
                    <p className="text-sm text-gray-600">Client information</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{invoice.clientName}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{invoice.clientEmail}</span>
                  </div>
                  
                  {invoice.clientAddress && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <span className="text-sm">{invoice.clientAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className={`mb-8 transition-all duration-1000 delay-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            
            {/* Items Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Invoice Items</h3>
                  <p className="text-sm text-gray-600">{invoice.items.length} items</p>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      { key: "description", label: "Description", icon: <FileText className="w-4 h-4" /> },
                      { key: "quantity", label: "Qty" },
                      { key: "price", label: "Price", icon: <DollarSign className="w-4 h-4" /> },
                      { key: "total", label: "Total", icon: <TrendingUp className="w-4 h-4" /> }
                    ].map((header, i) => (
                      <th
                        key={header.key}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          {header.icon}
                          {header.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-6 space-y-4">
              {invoice.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="font-medium text-gray-900 mb-2">{item.description}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Qty:</span>
                      <div className="font-medium text-gray-900">{item.quantity}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-medium text-gray-900">${item.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary and Notes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Invoice Summary */}
          <div className={`transition-all duration-1000 delay-900 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Summary</h3>
                    <p className="text-sm text-gray-600">Invoice calculations</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax ({invoice.tax}%)</span>
                    <span className="font-medium text-gray-900">
                      ${(invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0) * (invoice.tax / 100)).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount ({invoice.discount}%)</span>
                    <span className="font-medium text-gray-900">
                      -${(invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0) * (invoice.discount / 100)).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Additional Info */}
          <div className={`transition-all duration-1000 delay-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="space-y-6">
              
              {/* Notes */}
              {invoice.notes && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Notes</h3>
                        <p className="text-sm text-gray-600">Additional information</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{invoice.notes}</p>
                  </div>
                </div>
              )}

              {/* Invoice Details */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Details</h3>
                      <p className="text-sm text-gray-600">Invoice information</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {statusStyle.icon}
                        {invoice.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Due Date</span>
                      <span className="font-medium text-gray-900">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
