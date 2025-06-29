import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceForm from '../../components/invoices/InvoiceForm';
import { getInvoiceById, updateInvoice } from '../../api/invoices';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(id); // returns { invoice, company }
        setInvoice(data.invoice);
      } catch (error) {
        toast.error('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/90 border border-purple-200 shadow-xl rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-violet-700 mb-8 tracking-tight">
          Edit Invoice
        </h1>

        <div className="border-t border-gray-200 mb-6" />

        <InvoiceForm 
          initialValues={invoice} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default InvoiceEdit;
