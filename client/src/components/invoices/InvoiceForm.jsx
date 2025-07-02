import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';

const InvoiceForm = ({ initialValues, onSubmit, isSubmitting }) => {
  const [clientEmailError, setClientEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const calculateTotal = (items, tax, discount) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={(values) => {
            const errors = {};
            if (!values.clientName) errors.clientName = 'Required';
            if (!values.clientEmail) {
              errors.clientEmail = 'Required';
            } else if (!validateEmail(values.clientEmail)) {
              errors.clientEmail = 'Invalid email';
            }
            return errors;
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form className="space-y-6 text-sm">
              {/* Invoice Details Section */}
              <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-violet-800 mb-4">Invoice Details</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Invoice Number
                    </label>
                    <TextField
                      name="invoiceNumber"
                      value={values.invoiceNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Status
                    </label>
                    <Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Sent">Sent</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Issue Date
                    </label>
                    <DatePicker
                      value={values.issueDate}
                      onChange={(date) => setFieldValue('issueDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Due Date
                    </label>
                    <DatePicker
                      value={values.dueDate}
                      onChange={(date) => setFieldValue('dueDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                    />
                  </div>
                </div>
              </div>

              {/* Client Information Section */}
              <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-violet-800 mb-4">Client Information</h2>
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Client Name *
                    </label>
                    <TextField
                      name="clientName"
                      value={values.clientName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.clientName && !!errors.clientName}
                      helperText={touched.clientName && errors.clientName}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Client Email *
                    </label>
                    <TextField
                      name="clientEmail"
                      value={values.clientEmail}
                      onChange={(e) => {
                        handleChange(e);
                        if (!validateEmail(e.target.value)) {
                          setClientEmailError('Invalid email format');
                        } else {
                          setClientEmailError('');
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.clientEmail && (!!errors.clientEmail || !!clientEmailError)}
                      helperText={(touched.clientEmail && errors.clientEmail) || clientEmailError}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-violet-700 mb-1">
                      Client Address
                    </label>
                    <TextField
                      name="clientAddress"
                      value={values.clientAddress}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section - Mobile Responsive */}
              <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-violet-800 mb-4">Items</h2>
                <FieldArray name="items">
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      {values.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                          {/* Mobile: Stacked layout, Desktop: Grid layout */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                            
                            {/* Description - Full width on mobile, 5 cols on desktop */}
                            <div className="sm:col-span-2 lg:col-span-5">
                              <label className="block text-sm font-semibold text-violet-700 mb-1">
                                Description
                              </label>
                              <TextField
                                name={`items.${index}.description`}
                                value={item.description}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Item description"
                              />
                            </div>

                            {/* Quantity */}
                            <div className="lg:col-span-2">
                              <label className="block text-sm font-semibold text-violet-700 mb-1">
                                Quantity
                              </label>
                              <TextField
                                name={`items.${index}.quantity`}
                                type="number"
                                value={item.quantity}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputProps={{ min: 0, step: 1 }}
                              />
                            </div>

                            {/* Price */}
                            <div className="lg:col-span-3">
                              <label className="block text-sm font-semibold text-violet-700 mb-1">
                                Price ($)
                              </label>
                              <TextField
                                name={`items.${index}.price`}
                                type="number"
                                value={item.price}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </div>

                            {/* Total - Mobile: Full width, Desktop: 1 col */}
                            <div className="lg:col-span-1">
                              <label className="block text-sm font-semibold text-violet-700 mb-1">
                                Total
                              </label>
                              <div className="p-2 bg-violet-50 rounded border text-sm font-medium text-violet-900 text-center lg:text-left">
                                ${(item.quantity * item.price).toFixed(2)}
                              </div>
                            </div>

                            {/* Remove button - Mobile: Full width, Desktop: 1 col */}
                            <div className="lg:col-span-1 flex justify-center lg:justify-start">
                              {values.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200 text-sm font-medium"
                                  title="Remove item"
                                >
                                  <Trash2 size={16} />
                                  <span className="sm:hidden lg:inline">Remove</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Item Button */}
                      <button
                        type="button"
                        onClick={() => push({ description: '', quantity: 1, price: 0 })}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-violet-300 text-sm font-medium rounded-lg text-violet-800 bg-violet-100 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
                      >
                        <Plus size={16} />
                        Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Summary Section - Mobile Responsive */}
              <div className="bg-white rounded-lg shadow-sm border border-violet-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-violet-800 mb-4">Summary</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                  
                  {/* Tax and Discount inputs */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-violet-700 mb-1">
                        Tax (%)
                      </label>
                      <TextField
                        name="tax"
                        type="number"
                        value={values.tax}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-violet-700 mb-1">
                        Discount (%)
                      </label>
                      <TextField
                        name="discount"
                        type="number"
                        value={values.discount}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-violet-700">Subtotal:</span>
                        <span className="text-sm">${values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-violet-600">Tax:</span>
                        <span className="text-sm">${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.tax / 100)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-violet-600">Discount:</span>
                        <span className="text-sm">${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.discount / 100)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg mt-3 pt-3 border-t border-violet-200 text-violet-800">
                        <span>Total:</span>
                        <span>${calculateTotal(values.items, values.tax, values.discount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-violet-700 mb-1">
                    Notes
                  </label>
                  <TextField
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Additional notes or terms..."
                  />
                </div>
              </div>

              {/* Action Buttons - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-violet-200">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 border border-violet-300 rounded-md shadow-sm text-sm font-medium text-violet-700 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Invoice'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </LocalizationProvider>
  );
};

export default InvoiceForm;
