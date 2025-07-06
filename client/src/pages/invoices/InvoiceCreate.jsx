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
    issueDate: new Date(),
    dueDate: null,
    status: 'Draft',
    notes: '',
    template: 'invoiceTemplate',
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
    <div className="min-h-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Create New Invoice
          </h1>
          <p className="mt-2 text-violet-100">
            Fill in the details below to create a new invoice
          </p>
        </div>
      </div>

      {/* Form */}
      <InvoiceForm 
        initialValues={initialValues} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default InvoiceCreate;
