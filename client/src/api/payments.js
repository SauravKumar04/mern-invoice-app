import api from './axios';

// Send payment QR code via email
export const sendPaymentQRCode = async (invoiceId, data) => {
  try {
    const response = await api.post(`/api/payments/${invoiceId}/send-qr`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Generate and download payment QR code
export const downloadPaymentQRCode = async (invoiceId, paymentMethod = 'multiple') => {
  try {
    const response = await api.get(`/api/payments/${invoiceId}/qr-code`, {
      params: { paymentMethod },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};