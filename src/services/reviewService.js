import api from './api';

export const reviewService = {
  getByProductId: async (productId) => {
    return await api.get(`/products/${productId}/reviews`);
  },
  createReview: async (productId, { rating, comment, order_id }) => {
    return await api.post(`/products/${productId}/reviews`, {
      rating,
      comment,
      order_id,
    });
  },
};

export default reviewService;

