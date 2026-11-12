import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    if (!isAuthenticated) {
      throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng');
    }
    setLoading(true);
    try {
      const res = await cartService.addItem(productId, quantity, variantId);
      if (res && res.data) {
        setCart(res.data);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }
    setLoading(true);
    try {
      const res = await cartService.updateItem(itemId, quantity);
      if (res && res.data) {
        setCart(res.data);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const res = await cartService.removeItem(itemId);
      if (res && res.data) {
        setCart(res.data);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  const totalItems =
    cart?.totalItems ??
    cart?.total_items ??
    (cart?.items?.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0) || 0);

  const subtotal =
    cart?.totalAmount ??
    cart?.subtotal ??
    (cart?.items?.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.subtotal) ||
          (parseFloat(item.unit_price ?? item.product_price ?? item.price ?? 0) *
            (parseInt(item.quantity, 10) || 1))),
      0
    ) || 0);

  const value = {
    cart,
    loading,
    totalItems,
    subtotal: Number(subtotal) || 0,
    isOpen,
    setIsOpen,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
