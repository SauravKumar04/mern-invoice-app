import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Send payment QR code via email
export const sendPaymentQRCode = async (invoiceId, data) => {
  try {
    const response = await axios.post(`/payments/${invoiceId}/send-qr`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Generate and download payment QR code
export const downloadPaymentQRCode = async (invoiceId, paymentMethod = 'multiple') => {
  try {
    const response = await axios.get(`/payments/${invoiceId}/qr-code`, {
      params: { paymentMethod },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};