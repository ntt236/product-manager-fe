import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import { Package, Ban, Eye, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-950/60 text-amber-300 border-amber-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-950/60 text-blue-300 border-blue-800' },
  processing: { label: 'Đang chuẩn bị', color: 'bg-blue-950/60 text-blue-300 border-blue-800' },
  shipping: { label: 'Đang vận chuyển', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' },
  shipped: { label: 'Đang vận chuyển', color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800' },
  delivered: { label: 'Đã hoàn thành', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-rose-950/60 text-rose-300 border-rose-800' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId}?`)) return;
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      }
    } catch (err) {
      alert(err.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải lịch sử đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="mb-8 pb-4 border-b border-neutral-800">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          Tài khoản khách hàng
        </span>
        <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
          <Package className="w-6 h-6 text-neutral-400" />
          Đơn hàng của tôi
        </h1>
        <p className="mt-1.5 text-xs text-neutral-400">
          Theo dõi hành trình, kiểm tra tình trạng và xem chi tiết sản phẩm các đơn hàng đã đặt.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {orders.length === 0 ? (
        <div className="my-16 text-center space-y-4">
          <Package className="w-12 h-12 text-neutral-600 mx-auto stroke-[1.2]" />
          <p className="text-sm text-neutral-400">Bạn chưa có đơn đặt hàng nào trong hệ thống.</p>
          <Link to="/products" className="btn-primary text-xs inline-flex">
            Khám phá mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = STATUS_MAP[order.status] || {
              label: order.status,
              color: 'bg-neutral-800 text-neutral-300 border-neutral-700',
            };
            const isCancellable = ['pending', 'processing'].includes(order.status);
            const items = order.items || [];
            const addr = order.shipping_address || order.shipping_address_snapshot || {};
            const recipientName = addr.receiver_name || addr.recipient_name || '';
            const phone = addr.phone || '';
            const fullAddress = [
              addr.street_address || addr.address_line,
              addr.ward,
              addr.district,
              addr.province || addr.city,
            ]
              .filter(Boolean)
              .join(', ');

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5 hover:border-neutral-700 transition"
              >
                {/* Header row: Order ID, Code, Date, Status, Total */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      #{order.id}
                    </span>
                    {order.order_code && (
                      <span className="font-mono text-xs text-neutral-400">
                        ({order.order_code})
                      </span>
                    )}
                    <span className="text-neutral-600">•</span>
                    <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge-minimal ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-base font-bold font-mono text-white">
                      {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>

                {/* Items list preview */}
                {items.length > 0 && (
                  <div className="space-y-3 pt-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Danh sách sản phẩm ({items.length}):
                    </div>
                    <div className="divide-y divide-neutral-800/60 rounded-xl bg-neutral-950/40 border border-neutral-800/70 overflow-hidden">
                      {items.map((it) => {
                        const unitPrice = parseFloat(it.price || it.unit_price || it.price_snapshot || 0);
                        const qty = parseInt(it.quantity, 10) || 1;
                        const size = it.size || it.size_snapshot;
                        const color = it.color || it.color_snapshot;
                        const productName = it.product_name || it.product_name_snapshot || 'Sản phẩm thời trang';

                        return (
                          <div
                            key={it.id || `${it.product_id}-${it.variant_id}`}
                            className="p-3.5 flex items-center justify-between gap-4 text-xs hover:bg-neutral-900/50 transition"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Product Thumbnail */}
                              <div className="w-12 h-14 rounded bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700/60">
                                <img
                                  src={
                                    it.image_url ||
                                    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80'
                                  }
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80';
                                  }}
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="text-neutral-100 font-semibold truncate text-xs sm:text-sm">
                                  {productName}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {size && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                                      Size: {size}
                                    </span>
                                  )}
                                  {color && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                                      {it.color_code && (
                                        <span
                                          className="w-2 h-2 rounded-full border border-neutral-600 inline-block"
                                          style={{ backgroundColor: it.color_code }}
                                        />
                                      )}
                                      Màu: {color}
                                    </span>
                                  )}
                                  <span className="font-mono text-neutral-400 text-[11px]">
                                    x{qty}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-semibold text-white text-xs sm:text-sm">
                                {Number(unitPrice * qty).toLocaleString('vi-VN')} ₫
                              </span>
                              {qty > 1 && (
                                <div className="font-mono text-[10px] text-neutral-400">
                                  {unitPrice.toLocaleString('vi-VN')} ₫ / cái
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Snapshot Info */}
                {fullAddress && (
                  <div className="text-xs text-neutral-400 bg-neutral-900/80 p-3.5 rounded-xl border border-neutral-800/80 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-neutral-200 font-medium">
                        {recipientName} {phone && <span className="font-mono text-neutral-400">({phone})</span>}
                      </div>
                      <div className="text-neutral-400">{fullAddress}</div>
                    </div>
                  </div>
                )}

                {/* Card Footer: Notes & Action Buttons */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                  {order.note ? (
                    <span className="text-[11px] text-amber-300/80 italic">
                      Ghi chú: "{order.note}"
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Giao hàng tiêu chuẩn (Miễn phí)
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 ml-auto">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(order)}
                      className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Xem chi tiết đơn
                    </button>

                    {/* Cancel Order Button */}
                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="btn-danger !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Order Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
        onCancelOrder={handleCancelOrder}
        isCancelling={cancellingId === (selectedOrder && selectedOrder.id)}
      />
    </div>
  );
}
