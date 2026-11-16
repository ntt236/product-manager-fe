import api from './api';

export const orderService = {
  checkout: async ({ shipping_address_id, note }) => {
    return await api.post('/orders/checkout', { shipping_address_id, note });
  },
  getMyOrders: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.status) query.append('status', params.status);
    const qs = query.toString();
    return await api.get(qs ? `/orders/my-orders?${qs}` : '/orders/my-orders');
  },
  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },
  cancelOrder: async (id) => {
    return await api.put(`/orders/${id}/cancel`);
  },
  // Admin & Manager
  getAllOrdersAdmin: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.status) query.append('status', params.status);
    if (params.user_id) query.append('user_id', params.user_id);
    const qs = query.toString();
    return await api.get(qs ? `/orders?${qs}` : '/orders');
  },
  updateOrderStatus: async (id, status) => {
    return await api.patch(`/orders/${id}/status`, { status });
  },
};

export default orderService;

