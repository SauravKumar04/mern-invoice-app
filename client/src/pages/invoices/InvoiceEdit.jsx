import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceForm from '../../components/invoices/InvoiceForm';
import { getInvoiceById, updateInvoice } from '../../api/invoices';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import {
  ArrowLeft,
  Edit3,
  Save,
  Sparkles,
  FileText,
  Star,
  Receipt,
  CheckCircle,
  Calendar,
  User,
  Building
} from 'lucide-react';

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(id); // returns { invoice, company }
        setInvoice(data.invoice);
      } catch (error) {
        toast.error('Failed to load invoice');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await updateInvoice(id, values);
      toast.success('Invoice updated successfully!');
      navigate(`/invoices/view/${response.invoice._id}`);
    } catch (error) {
      toast.error('Failed to update invoice');
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-sm text-gray-500 mt-2">Preparing invoice for editing</p>
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
          <p className="text-gray-500 mb-6">The invoice you're trying to edit doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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

      {/* Header Section */}
      <div className={`bg-white border-b border-gray-200 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Navigation and Title */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(`/invoices/view/${id}`)}
              className="group p-2 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
            </button>
            
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Edit Invoice</h1>
              <p className="text-gray-600 mt-1">Update invoice details and information</p>
            </div>
          </div>

          {/* Invoice Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-full blur-xl" />
            <div className="relative z-10 flex items-center gap-6">
              
              {/* Invoice Icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {invoice.invoiceNumber?.slice(-2) || "##"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center">
                  <Edit3 className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              
              {/* Invoice Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-blue-900">Invoice #{invoice.invoiceNumber}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Editing Mode
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Client: {invoice.clientName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Status: {invoice.status}</span>
                  </div>
                </div>
              </div>

              {/* Save Indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Save className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-700">Auto-save</p>
                  <p className="text-xs text-green-600">Changes saved automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className={`transition-all duration-1000 delay-300 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <InvoiceForm 
          initialValues={{
            ...invoice,
            issueDate: invoice.issueDate ? new Date(invoice.issueDate) : new Date(),
            dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
            template: invoice.template || 'invoiceTemplate'
          }} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default InvoiceEdit;
