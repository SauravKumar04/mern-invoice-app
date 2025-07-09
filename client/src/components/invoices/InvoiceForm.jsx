import React, { useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { toast } from 'react-toastify';
import TemplateSelector from './TemplateSelector';
import CustomDatePicker from './CustomDatePicker';
import { 
  Trash2, 
  Plus, 
  Save, 
  X,
  FileText,
  User,
  Mail,
  MapPin,
  DollarSign,
  Percent,
  Calculator,
  Calendar,
  Hash,
  Clock,
  Receipt,
  CreditCard,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  ShoppingCart,
  Package,
  Tag,
  TrendingUp
} from 'lucide-react';

const InvoiceForm = ({ initialValues, onSubmit, isSubmitting }) => {
  const [clientEmailError, setClientEmailError] = useState('');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
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
            if (!values.template) errors.template = 'Required';
            return errors;
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form className="space-y-8">
              
              {/* Invoice Details Section */}
              <div className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                        <p className="text-gray-600">Basic invoice information</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <Hash className="w-4 h-4 text-gray-500" />
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: 'rgb(249 250 251)',
                              '&:hover fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                            },
                          }}
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <CheckCircle className="w-4 h-4 text-gray-500" />
                          Status
                        </label>
                        <Select
                          name="status"
                          value={values.status}
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: 'rgb(249 250 251)',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                            },
                          }}
                        >
                          <MenuItem value="Draft">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              Draft
                            </div>
                          </MenuItem>
                          <MenuItem value="Sent">
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4 text-blue-500" />
                              Sent
                            </div>
                          </MenuItem>
                          <MenuItem value="Paid">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Paid
                            </div>
                          </MenuItem>
                        </Select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          Issue Date
                        </label>
                        <CustomDatePicker
                          value={values.issueDate}
                          onChange={(date) => setFieldValue('issueDate', date)}
                          placeholder="Select issue date"
                          icon={Calendar}
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                          Due Date
                        </label>
                        <CustomDatePicker
                          value={values.dueDate}
                          onChange={(date) => setFieldValue('dueDate', date)}
                          placeholder="Select due date"
                          icon={AlertCircle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information Section */}
              <div className={`transition-all duration-1000 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Client Information</h3>
                        <p className="text-gray-600">Bill to details</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <User className="w-4 h-4 text-gray-500" />
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: 'rgb(249 250 251)',
                              '&:hover fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                            },
                          }}
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <Mail className="w-4 h-4 text-gray-500" />
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: 'rgb(249 250 251)',
                              '&:hover fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                            },
                          }}
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: 'rgb(249 250 251)',
                              '&:hover fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'rgb(59 130 246)',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Selection Section */}
              <TemplateSelector
                selectedTemplate={values.template}
                onTemplateChange={(template) => setFieldValue('template', template)}
              />

              {/* Items Section */}
              <div className={`transition-all duration-1000 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Invoice Items</h3>
                        <p className="text-gray-600">Products and services</p>
                      </div>
                    </div>
                    
                    <FieldArray name="items">
                      {({ remove, push }) => (
                        <div className="space-y-6">
                          {values.items.map((item, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                              
                              {/* Item Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium text-gray-700">Item #{index + 1}</span>
                                </div>
                                
                                {values.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="group p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                                  </button>
                                )}
                              </div>

                              {/* Item Fields */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                                
                                {/* Description */}
                                <div className="sm:col-span-2 lg:col-span-5">
                                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Package className="w-4 h-4 text-gray-500" />
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
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'white',
                                        '&:hover fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                      },
                                    }}
                                  />
                                </div>

                                {/* Quantity */}
                                <div className="lg:col-span-2">
                                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Hash className="w-4 h-4 text-gray-500" />
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
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'white',
                                        '&:hover fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                      },
                                    }}
                                  />
                                </div>

                                {/* Price */}
                                <div className="lg:col-span-3">
                                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
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
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: 'white',
                                        '&:hover fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: 'rgb(59 130 246)',
                                        },
                                      },
                                    }}
                                  />
                                </div>

                                {/* Total */}
                                <div className="lg:col-span-2">
                                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    Total
                                  </label>
                                  <div className="h-10 px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg flex items-center justify-center text-sm font-bold text-green-700">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Add Item Button */}
                          <button
                            type="button"
                            onClick={() => push({ description: '', quantity: 1, price: 0 })}
                            className="group w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-xl text-purple-600 hover:text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 transition-all duration-200 transform hover:scale-[1.02]"
                          >
                            <div className="p-2 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-colors duration-200">
                              <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">Add New Item</span>
                            <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className={`transition-all duration-1000 delay-600 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                        <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Summary & Calculations</h3>
                        <p className="text-gray-600">Tax, discount, and totals</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      
                      {/* Tax and Discount */}
                      <div className="xl:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <Percent className="w-4 h-4 text-gray-500" />
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
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  backgroundColor: 'rgb(249 250 251)',
                                  '&:hover fieldset': {
                                    borderColor: 'rgb(59 130 246)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(59 130 246)',
                                  },
                                },
                              }}
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <Tag className="w-4 h-4 text-gray-500" />
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
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  backgroundColor: 'rgb(249 250 251)',
                                  '&:hover fieldset': {
                                    borderColor: 'rgb(59 130 246)',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(59 130 246)',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Notes & Terms
                          </label>
                          <TextField
                            name="notes"
                            value={values.notes}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Additional notes, terms, or payment instructions..."
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'rgb(249 250 251)',
                                '&:hover fieldset': {
                                  borderColor: 'rgb(59 130 246)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgb(59 130 246)',
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Total Calculation */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-100/50 rounded-full blur-lg" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-blue-900">Invoice Total</h4>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-700">Subtotal:</span>
                              <span className="font-medium text-blue-900">
                                ${values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-700">Tax ({values.tax}%):</span>
                              <span className="font-medium text-blue-900">
                                ${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.tax / 100)).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-700">Discount ({values.discount}%):</span>
                              <span className="font-medium text-blue-900">
                                -${(values.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (values.discount / 100)).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="border-t border-blue-200 pt-3 mt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-blue-900">Total:</span>
                                <span className="text-2xl font-bold text-blue-900">
                                  ${calculateTotal(values.items, values.tax, values.discount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`transition-all duration-1000 delay-800 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving Invoice...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                            Save Invoice
                            <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
  );
};

export default InvoiceForm;
