import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getEffectiveColorCode } from '../../utils/colorUtils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearCart, totalItems, subtotal } = useCart();

  const items = cart?.items || [];

  if (loading && !cart) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải giỏ hàng..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Giỏ hàng của bạn
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-neutral-400" />
            Danh sách sản phẩm ({totalItems})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn dọn sạch giỏ hàng?')) {
                clearCart();
              }
            }}
            className="text-xs text-neutral-400 hover:text-rose-400 transition uppercase flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa toàn bộ</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      {items.length === 0 ? (
        <div className="my-20 max-w-md mx-auto text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-center mx-auto text-neutral-500">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white">
              Giỏ hàng đang trống
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Bạn chưa chọn sản phẩm nào vào giỏ hàng. Hãy khám phá những bộ sưu tập mới nhất của chúng tôi.
            </p>
          </div>
          <Link to="/products" className="btn-primary text-xs inline-flex py-3 px-6">
            Khám phá bộ sưu tập ngay <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Item List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 divide-y divide-neutral-800/80 overflow-hidden">
              {items.map((item) => {
                const itemName = item.product_name || item.name || 'Sản phẩm';
                const unitPrice = parseFloat(item.unit_price ?? item.product_price ?? item.price ?? 0);
                const quantity = parseInt(item.quantity, 10) || 1;
                const itemSubtotal = parseFloat(item.subtotal) || unitPrice * quantity;
                const itemImage = item.product_image || item.image_url;

                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-neutral-900/90 transition"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-20 h-24 rounded-lg bg-neutral-800 border border-neutral-700/50 overflow-hidden flex-shrink-0">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500 uppercase">
                            No img
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="text-sm font-semibold text-neutral-100 hover:text-white truncate block transition"
                        >
                          {itemName}
                        </Link>
                        
                        {/* Variant Size and Color Badge */}
                        {(item.size || item.color) && (
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            {item.color && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-neutral-600 inline-block"
                                  style={{ backgroundColor: getEffectiveColorCode(item.color_code, item.color) }}
                                />
                                <span>{item.color}</span>
                              </span>
                            )}
                            {item.size && item.color && <span>•</span>}
                            {item.size && <span>Size {item.size}</span>}
                          </div>
                        )}

                        <p className="text-xs font-mono text-neutral-300">
                          {Number(unitPrice).toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-800/80">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="px-2.5 py-1.5 text-neutral-400 hover:text-white transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium text-neutral-100">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="px-2.5 py-1.5 text-neutral-400 hover:text-white transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal of item */}
                      <span className="text-sm font-mono font-bold text-white min-w-[100px] text-right">
                        {Number(itemSubtotal).toLocaleString('vi-VN')} ₫
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back link */}
            <div className="pt-2">
              <Link
                to="/products"
                className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tiếp tục chọn thêm sản phẩm khác</span>
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout (1 Col) */}
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white pb-3 border-b border-neutral-800">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Số lượng sản phẩm:</span>
                  <span className="font-mono text-neutral-200">{totalItems} món</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tạm tính hàng hóa:</span>
                  <span className="font-mono text-neutral-200">
                    {Number(subtotal).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Phí giao hàng:</span>
                  <span className="font-mono text-emerald-400 uppercase text-[10px]">Miễn phí</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Thuế VAT:</span>
                  <span className="text-neutral-400">Đã bao gồm</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-3 border-t border-neutral-800">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="font-mono text-lg">{Number(subtotal).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 group"
              >
                <span>Chuyển tới thanh toán</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Badges */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-3 text-neutral-400 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>Bảo hành chính hãng & kiểm định nguồn gốc</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Truck className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>Miễn phí vận chuyển toàn quốc cho mọi đơn hàng</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <RotateCcw className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span>Đổi trả thuận tiện trong vòng 30 ngày</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
