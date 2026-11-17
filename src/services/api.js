/**
 * Service API cơ bản bọc fetch API của trình duyệt.
 * - Tự động đính kèm Token xác thực (Authorization: Bearer <token>) nếu có trong localStorage.
 * - Tự động parse JSON và chuẩn hóa thông báo lỗi từ backend.
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://product-manager-7zlr.onrender.com/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Nếu server trả về lỗi, lấy message từ response hoặc fallback thông điệp mặc định
      const errorMessage =
        (data && data.message) ||
        (data && data.errors && data.errors.map((e) => e.msg).join(', ')) ||
        `Lỗi hệ thống (${response.status})`;

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Nếu là lỗi mạng không thể kết nối tới server
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến máy chủ Backend (hãy kiểm tra xem server backend đã chạy chưa).');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) =>
    request(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default api;

