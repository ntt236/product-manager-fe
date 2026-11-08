import api from './api';

export const productService = {
  /**
   * Lấy danh sách sản phẩm có tìm kiếm và phân trang
   * @param {{ page?: number, limit?: number, search?: string, category_id?: number|string }} params
   */
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return await api.get(endpoint);
  },

  /**
   * Lấy chi tiết một sản phẩm theo ID
   * @param {number|string} id
   */
  getById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  /**
   * Thêm mới sản phẩm (Dành cho Admin / Manager)
   * @param {{ name: string, description?: string, price: number, image_url?: string, category_id: number }} data
   */
  create: async (data) => {
    return await api.post('/products', data);
  },

  /**
   * Cập nhật thông tin sản phẩm (Dành cho Admin / Manager)
   * @param {number|string} id
   * @param {{ name?: string, description?: string, price?: number, image_url?: string, category_id?: number }} data
   */
  update: async (id, data) => {
    return await api.put(`/products/${id}`, data);
  },

  /**
   * Xóa sản phẩm theo ID (Chỉ Admin)
   * @param {number|string} id
   */
  delete: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};

export default productService;

