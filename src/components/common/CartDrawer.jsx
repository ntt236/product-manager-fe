import { useCart } from '../../contexts/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, totalItems, subtotal } = useCart();

  if (!isOpen) return null;

  const items = cart?.items || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-neutral-300" />
              <h2 className="text-base font-semibold tracking-wide text-neutral-100 uppercase">
                Giỏ hàng ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-800/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mb-3 stroke-[1.2]" />
                <p className="text-sm text-neutral-400">Giỏ hàng của bạn đang trống</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-200 underline hover:text-white"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemName = item.product_name || item.name || 'Sản phẩm';
                const unitPrice = parseFloat(item.unit_price ?? item.product_price ?? item.price ?? 0);
                const quantity = parseInt(item.quantity, 10) || 1;
                const itemImage = item.product_image || item.image_url;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-16 h-20 rounded-md bg-neutral-800 border border-neutral-700/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-neutral-500 uppercase">No img</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-200 truncate">{itemName}</h3>
                      
                      {(item.size || item.color) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                          {item.color && <span>{item.color}</span>}
                          {item.size && item.color && <span>•</span>}
                          {item.size && <span>Size {item.size}</span>}
                        </div>
                      )}

                      <p className="text-xs font-mono text-neutral-300 mt-0.5">
                        {Number(unitPrice).toLocaleString('vi-VN')} ₫
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-700 rounded-md bg-neutral-800/60">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="p-1 text-neutral-400 hover:text-neutral-100 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-medium text-neutral-200">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="p-1 text-neutral-400 hover:text-neutral-100 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/90 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Tạm tính:</span>
                <span className="text-base font-semibold font-mono text-neutral-100">
                  {Number(subtotal).toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary w-full py-2.5 text-center text-xs"
                >
                  Xem giỏ hàng
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full py-2.5 text-center text-xs flex items-center justify-center gap-1"
                >
                  Thanh toán <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
