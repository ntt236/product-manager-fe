import api from './api';

export const categoryService = {
  /**
   * Lấy danh sách toàn bộ danh mục sản phẩm
   */
  getAll: async () => {
    return await api.get('/categories');
  },

  /**
   * Lấy chi tiết danh mục theo ID
   * @param {number|string} id
   */
  getById: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  /**
   * Thêm danh mục mới (Chỉ Admin / Manager)
   * @param {{ name: string, description?: string }} data
   */
  create: async (data) => {
    return await api.post('/categories', data);
  },

  /**
   * Cập nhật danh mục (Chỉ Admin / Manager)
   * @param {number|string} id
   * @param {{ name?: string, description?: string }} data
   */
  update: async (id, data) => {
    return await api.put(`/categories/${id}`, data);
  },

  /**
   * Xóa danh mục (Chỉ Admin)
   * @param {number|string} id
   */
  delete: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};

export default categoryService;
