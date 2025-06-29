import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="border-t border-violet-200 pt-6">
              <h2 className="text-lg font-semibold text-violet-800 mb-4">Client Information</h2>
              <div className="grid grid-cols-1 gap-6">
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

            <div className="border-t border-violet-200 pt-6">
              <h2 className="text-lg font-semibold text-violet-800 mb-4">Items</h2>
              <FieldArray name="items">
                {({ remove, push }) => (
                  <div>
                    {values.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                        <div className="col-span-5">
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
                          />
                        </div>

                        <div className="col-span-2">
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
                          />
                        </div>

                        <div className="col-span-3">
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
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-sm font-semibold text-violet-700 mb-1">
                            Total
                          </label>
                          <div className="text-sm font-medium text-violet-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>

                        <div className="col-span-1">
                          {values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ description: '', quantity: 1, price: 0 })}
                      className="inline-flex items-center px-3 py-1 border border-violet-300 text-sm font-medium rounded text-violet-800 bg-violet-100 hover:bg-violet-200 focus:outline-none"
                    >
                      Add Item
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="border-t border-violet-200 pt-6">
              <h2 className="text-lg font-semibold text-violet-800 mb-4">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  />
                </div>

                <div className="bg-violet-50 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-violet-700">Subtotal:</span>
                    <span>${values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-violet-600">Tax:</span>
                    <span>${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.tax / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-violet-600">Discount:</span>
                    <span>${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.discount / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-violet-200 text-violet-800">
                    <span>Total:</span>
                    <span>${calculateTotal(values.items, values.tax, values.discount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

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
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-violet-200">
              <button
                type="button"
                className="px-4 py-2 border border-violet-300 rounded-md shadow-sm text-sm font-medium text-violet-700 hover:bg-violet-100 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Invoice'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default InvoiceForm;
