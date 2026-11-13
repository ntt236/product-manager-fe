import api from './api';

export const addressService = {
  getAll: async () => {
    return await api.get('/addresses');
  },
  create: async (data) => {
    return await api.post('/addresses', data);
  },
  update: async (id, data) => {
    return await api.put(`/addresses/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/addresses/${id}`);
  },
};

export default addressService;

