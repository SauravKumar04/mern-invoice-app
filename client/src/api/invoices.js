import api from './axios';

export const createInvoice = async (data) => {
  const response = await api.post('/api/invoices', data);
  return response.data;
};

export const getInvoices = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/api/invoices?${params}`);
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await api.get(`/api/invoices/${id}`);
  return response.data;
}; 

export const updateInvoice = async (id, data) => {
  const response = await api.put(`/api/invoices/${id}`, data);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await api.delete(`/api/invoices/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/invoices/dashboard/stats');
  return response.data;
};

export const generateInvoicePdf = async (id) => {
  const response = await api.get(`/api/invoices/${id}/pdf-html`, {
    responseType: 'blob'
  });
  return response.data;
};

export const sendInvoiceEmail = async (id) => {
  const response = await api.post(`/api/invoices/${id}/email`);
  return response.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const response = await api.patch(`/api/invoices/${id}/status`, { status });
  return response.data;
};