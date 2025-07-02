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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-violet-600 font-medium">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Edit Invoice
          </h1>
          <p className="mt-2 text-violet-100">
            Update the invoice details below
          </p>
        </div>
      </div>

      {/* Form */}
      <InvoiceForm 
        initialValues={invoice} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default InvoiceEdit;
