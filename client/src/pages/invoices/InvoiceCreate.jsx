import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../../components/invoices/InvoiceForm';
import { createInvoice } from '../../api/invoices';
import { toast } from 'react-toastify';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialValues = {
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    tax: 0,
    discount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Draft',
    notes: '',
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const invoice = await createInvoice(values);
      toast.success('Invoice created successfully!');
      navigate(`/invoices/view/${invoice.invoice._id}`);
    } catch (error) {
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/90 border border-purple-200 shadow-xl rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-violet-700 mb-8 tracking-tight">
          Create New Invoice
        </h1>

        <div className="border-t border-gray-200 mb-6" />

        <InvoiceForm 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
};

export default InvoiceCreate;
