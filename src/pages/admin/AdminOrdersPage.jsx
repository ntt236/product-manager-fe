import { useState, useEffect, useMemo } from 'react';
import orderService from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import {
  ShoppingBag,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  User,
  Search,
  ChevronRight,
  Ban,
  CheckCircle2,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang chuẩn bị' },
  { value: 'shipping', label: 'Đang vận chuyển' },
  { value: 'delivered', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy đơn' },
];

const STATUS_THEME = {
  pending: {
    label: 'Chờ xử lý',
    badge: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    dot: 'bg-amber-400',
  },
  confirmed: {
    label: 'Đã xác nhận',
    badge: 'bg-blue-950/60 text-blue-300 border-blue-800/80',
    dot: 'bg-blue-400',
  },
  processing: {
    label: 'Đang chuẩn bị',
    badge: 'bg-sky-950/60 text-sky-300 border-sky-800/80',
    dot: 'bg-sky-400',
  },
  shipping: {
    label: 'Đang vận chuyển',
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80',
    dot: 'bg-indigo-400',
  },
  delivered: {
    label: 'Đã hoàn thành',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    label: 'Đã hủy',
    badge: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    dot: 'bg-rose-400',
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrdersAdmin();
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert(err.message || 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = async (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);

    // Fallback: If order has no items pre-loaded, fetch full detail
    if (!order.items || order.items.length === 0) {
      try {
        const res = await orderService.getOrderById(order.id);
        if (res && res.data) {
          setSelectedOrder(res.data);
        }
      } catch (e) {
        // Keep existing
      }
    }
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedOrder(null);
  };

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const code = (order.order_code || '').toLowerCase();
        const id = String(order.id);
        const userName = (order.user_name || '').toLowerCase();
        const userEmail = (order.user_email || '').toLowerCase();

        const addr = order.shipping_address || order.shipping_address_snapshot || {};
        const receiver = (addr.receiver_name || addr.recipient_name || '').toLowerCase();
        const phone = (addr.phone || '').toLowerCase();
        const city = (addr.province || addr.city || '').toLowerCase();

        const matches =
          code.includes(query) ||
          id.includes(query) ||
          userName.includes(query) ||
          userEmail.includes(query) ||
          receiver.includes(query) ||
          phone.includes(query) ||
          city.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải dữ liệu đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-12">
      {/* Header bar */}
      <div className="pb-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Fulfillment Console
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-neutral-400" />
            Quản trị Toàn bộ Đơn hàng
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Theo dõi, xử lý và cập nhật tiến độ hoàn tất đơn hàng trên toàn hệ thống.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn-secondary !py-2.5 !px-4 text-xs flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-neutral-400" />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Filter and Search Bar */}
      <div className="space-y-3.5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition border ${
              statusFilter === 'all'
                ? 'bg-white text-black font-bold border-white shadow-sm'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            Tất cả ({statusCounts.all || 0})
          </button>

          {STATUS_OPTIONS.map((opt) => {
            const count = statusCounts[opt.value] || 0;
            const isSelected = statusFilter === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-800 text-white font-bold border-neutral-600 shadow-sm'
                    : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, người nhận, số điện thoại..."
            className="input-minimal pl-10 pr-4 text-xs w-full bg-neutral-900/80 border-neutral-800"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-400 space-y-3">
          <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto stroke-[1.2]" />
          <p className="text-sm">Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusMeta = STATUS_THEME[order.status] || {
              label: order.status,
              badge: 'bg-neutral-800 text-neutral-300 border-neutral-700',
              dot: 'bg-neutral-400',
            };

            const addr = order.shipping_address || order.shipping_address_snapshot || {};
            const recipientName = addr.receiver_name || addr.recipient_name || 'Khách hàng';
            const phone = addr.phone || '';
            const fullAddress = [
              addr.street_address || addr.address_line,
              addr.ward,
              addr.district,
              addr.province || addr.city,
            ]
              .filter(Boolean)
              .join(', ');

            const items = order.items || [];
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-neutral-800/80 bg-neutral-900/70 p-5 sm:p-6 space-y-4 hover:border-neutral-700 transition shadow-lg shadow-black/20"
              >
                {/* 1. TOP DOCKET STRIP: IDs, Date, Status Selector & Total Price */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-neutral-800/80">
                  {/* Left: Code, Internal ID, Date, Customer */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-neutral-300 bg-neutral-800/90 border border-neutral-700/80 px-2.5 py-0.5 rounded">
                        #{order.id}
                      </span>

                      <span className="font-mono text-sm font-extrabold tracking-wide text-white">
                        {order.order_code || `ORD-${order.id}`}
                      </span>

                      <span className="text-neutral-600">•</span>

                      <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-300">
                      <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>
                        Khách đặt:{' '}
                        <strong className="text-white font-medium">
                          {order.user_name || `Tài khoản #${order.user_id}`}
                        </strong>
                      </span>
                      {order.user_email && (
                        <span className="text-neutral-500 font-mono text-[11px]">
                          ({order.user_email})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions, Price & Status Controls */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800/60">
                    {/* Total Amount Pill */}
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Tổng thanh toán
                      </span>
                      <span className="font-mono text-lg font-bold text-white whitespace-nowrap">
                        {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>

                    {/* View Detail Modal Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(order)}
                      className="btn-secondary !py-2 !px-3.5 text-xs whitespace-nowrap flex items-center gap-1.5 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem chi tiết</span>
                    </button>

                    {/* Status Select dropdown or Terminal State Badge */}
                    <div className="relative shrink-0">
                      {order.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg border bg-rose-950/60 text-rose-300 border-rose-800/80 cursor-not-allowed">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>Đã hủy (Khóa đơn)</span>
                        </span>
                      ) : order.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg border bg-emerald-950/60 text-emerald-300 border-emerald-800/80 cursor-default">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã giao thành công</span>
                        </span>
                      ) : (
                        <div className="relative shrink-0">
                          <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs uppercase font-mono tracking-wider font-semibold py-2 pl-3 pr-8 rounded-lg border appearance-none cursor-pointer transition whitespace-nowrap ${
                              statusMeta.badge
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
                          >
                            {STATUS_OPTIONS.filter((opt) => opt.value !== 'delivered').map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-neutral-900 text-neutral-100 font-sans normal-case"
                              >
                                {opt.label}
                              </option>
                            ))}
                            <option
                              value="delivered"
                              className="bg-neutral-900 text-neutral-100 font-sans normal-case"
                            >
                              Đã hoàn thành
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-400">
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. SHIPPING & DESTINATION STRIP */}
                {fullAddress && (
                  <div className="text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="text-neutral-200 font-semibold flex items-center gap-2">
                        <span>{recipientName}</span>
                        {phone && (
                          <span className="font-mono text-neutral-400 font-normal">
                            ({phone})
                          </span>
                        )}
                      </div>
                      <div className="text-neutral-400 leading-relaxed truncate">
                        {fullAddress}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ORDER ITEMS PREVIEW STRIP */}
                {items.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Sản phẩm trong kiện ({items.length}):</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((it) => {
                        const size = it.size || it.size_snapshot;
                        const color = it.color || it.color_snapshot;
                        const price = parseFloat(it.price || it.unit_price || it.price_snapshot || 0);
                        const productName = it.product_name || it.product_name_snapshot || 'Sản phẩm thời trang';

                        return (
                          <div
                            key={it.id || `${it.product_id}-${it.variant_id}`}
                            className="flex items-center gap-3 text-xs bg-neutral-950/50 p-2.5 rounded-xl border border-neutral-800/70 hover:border-neutral-700 transition"
                          >
                            <img
                              src={
                                it.image_url ||
                                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={productName}
                              className="w-10 h-12 object-cover rounded bg-neutral-800 shrink-0 border border-neutral-700/50"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80';
                              }}
                            />

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="text-neutral-100 font-medium truncate text-xs">
                                {productName}
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                                {size && (
                                  <span className="bg-neutral-800/80 px-1.5 py-0.2 rounded border border-neutral-700/60">
                                    {size}
                                  </span>
                                )}
                                {color && (
                                  <span className="bg-neutral-800/80 px-1.5 py-0.2 rounded border border-neutral-700/60 inline-flex items-center gap-1">
                                    {it.color_code && (
                                      <span
                                        className="w-1.5 h-1.5 rounded-full inline-block"
                                        style={{ backgroundColor: it.color_code }}
                                      />
                                    )}
                                    {color}
                                  </span>
                                )}
                                <span>x{it.quantity}</span>
                              </div>
                            </div>

                            <div className="font-mono text-right text-xs text-neutral-200 font-semibold whitespace-nowrap shrink-0">
                              {Number(price * it.quantity).toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. CUSTOMER NOTE */}
                {order.note && (
                  <div className="pt-2 border-t border-neutral-800/70 text-[11px] text-amber-300/85 italic flex items-center gap-1.5">
                    <span className="font-mono uppercase font-semibold text-[10px] text-amber-400 not-italic">
                      Ghi chú:
                    </span>
                    <span>"{order.note}"</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
