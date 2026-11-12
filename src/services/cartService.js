import api from './api';

export const cartService = {
  getCart: async () => {
    return await api.get('/cart');
  },
  addItem: async (productId, quantity = 1, variantId = null) => {
    return await api.post('/cart/items', {
      product_id: productId,
      variant_id: variantId,
      quantity,
    });
  },
  updateItem: async (itemId, quantity) => {
    return await api.put(`/cart/items/${itemId}`, { quantity });
  },
  removeItem: async (itemId) => {
    return await api.delete(`/cart/items/${itemId}`);
  },
  clearCart: async () => {
    return await api.delete('/cart');
  },
};

export default cartService;
