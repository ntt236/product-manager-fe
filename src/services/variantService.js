import api from './api';

export const variantService = {
  getByProductId: async (productId) => {
    return await api.get(`/products/${productId}/variants`);
  },
  createVariant: async (productId, data) => {
    return await api.post(`/products/${productId}/variants`, data);
  },
  createBulkVariants: async (productId, variants) => {
    return await api.post(`/products/${productId}/variants/bulk`, { variants });
  },
  updateVariant: async (variantId, data) => {
    return await api.put(`/products/variants/${variantId}`, data);
  },
  deleteVariant: async (variantId) => {
    return await api.delete(`/products/variants/${variantId}`);
  },
};

export default variantService;
