import api from './axios';

export const getCompanyInfo = async () => {
  const response = await api.get('/api/company');
  return response.data;
};

export const setCompanyInfo = async (data) => {
  const response = await api.post('/api/company', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};