import { Route, Routes, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout/UserLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

import HomePage from '../pages/user/HomePage';
import ProductsPage from '../pages/user/ProductsPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import MyOrdersPage from '../pages/user/MyOrdersPage';
import AddressesPage from '../pages/user/AddressesPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* User & Customer routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage title="Tất cả sản phẩm" />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Fashion Collections */}
        <Route
          path="/men"
          element={<ProductsPage title="Bộ sưu tập Nam" targetCategoryName="Men" />}
        />
        <Route
          path="/women"
          element={<ProductsPage title="Bộ sưu tập Nữ" targetCategoryName="Women" />}
        />
        <Route
          path="/shoes"
          element={<ProductsPage title="Giày dép & Túi xách" targetCategoryName="Shoes" />}
        />
        <Route
          path="/accessories"
          element={<ProductsPage title="Phụ kiện" targetCategoryName="Accessories" />}
        />

        {/* Dedicated Cart Page */}
        <Route path="/cart" element={<CartPage />} />

        {/* Authenticated Checkout, Orders & Addresses */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProductsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
