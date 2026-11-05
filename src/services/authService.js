import api from './api';

export const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {{ name: string, email: string, password: string }} data
   */
  register: async ({ name, email, password }) => {
    return await api.post('/auth/register', { name, email, password });
  },

  /**
   * Đăng nhập
   * @param {{ email: string, password: string }} data
   */
  login: async ({ email, password }) => {
    return await api.post('/auth/login', { email, password });
  },

  /**
   * Lấy thông tin người dùng hiện tại theo Token
   */
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Đăng xuất
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Backend JWT là stateless nên nếu logout lỗi mạng vẫn xóa token ở client
    }
  },
};

export default authService;

