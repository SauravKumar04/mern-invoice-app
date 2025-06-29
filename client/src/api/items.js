import api from './axios';

export const getItemTemplates = async () => {
  const response = await api.get('/api/items');
  return response.data;
};

export const createItemTemplate = async (data) => {
  const response = await api.post('/api/items', data);
  return response.data;
};

export const deleteItemTemplate = async (id) => {
  const response = await api.delete(`/api/items/${id}`);
  return response.data;
};