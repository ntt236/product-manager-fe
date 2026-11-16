import { X, MapPin, Phone, User, Package, Calendar, CheckCircle2, Clock, Truck, ShieldCheck, Ban, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-amber-950/60 text-amber-300 border-amber-800',
    stepIndex: 1,
    desc: 'Đơn hàng đang chờ hệ thống và cửa hàng xác nhận.',
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'bg-blue-950/60 text-blue-300 border-blue-800',
    stepIndex: 1,
    desc: 'Đơn hàng đã được xác nhận thành công.',
  },
  processing: {
    label: 'Đang chuẩn bị',
    color: 'bg-blue-950/60 text-blue-300 border-blue-800',
    stepIndex: 2,
    desc: 'Đang đóng gói và hoàn tất kiện hàng tại kho.',
  },
  shipping: {
    label: 'Đang vận chuyển',
    color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
    stepIndex: 3,
    desc: 'Kiện hàng đang trên đường giao tới bạn.',
  },
  shipped: {
    label: 'Đang vận chuyển',
    color: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',
    stepIndex: 3,
    desc: 'Kiện hàng đang trên đường giao tới bạn.',
  },
  delivered: {
    label: 'Đã hoàn thành',
    color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
    stepIndex: 4,
    desc: 'Đơn hàng đã được giao thành công.',
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-rose-950/60 text-rose-300 border-rose-800',
    stepIndex: 0,
    desc: 'Đơn hàng này đã bị hủy.',
  },
};

const STEPS = [
  { id: 1, name: 'Đặt hàng', icon: Clock },
  { id: 2, name: 'Chuẩn bị', icon: Package },
  { id: 3, name: 'Vận chuyển', icon: Truck },
  { id: 4, name: 'Hoàn tất', icon: CheckCircle2 },
];

export default function OrderDetailModal({ order, isOpen, onClose, onCancelOrder, isCancelling }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const status = STATUS_CONFIG[order.status] || {
    label: order.status,
    color: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    stepIndex: 1,
    desc: '',
  };

  const isCancelled = order.status === 'cancelled';
  const isCancellable = ['pending', 'processing'].includes(order.status);

  // Address normalization
  const addr = order.shipping_address || order.shipping_address_snapshot || {};
  const recipientName = addr.receiver_name || addr.recipient_name || 'Khách hàng';
  const phone = addr.phone || '';
  const street = addr.street_address || addr.address_line || '';
  const ward = addr.ward || '';
  const district = addr.district || '';
  const city = addr.province || addr.city || '';
  const fullAddress = [street, ward, district, city].filter(Boolean).join(', ');

  const items = order.items || [];

  const handleCopyCode = () => {
    if (order.order_code) {
      navigator.clipboard.writeText(order.order_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-2xl z-10 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                Chi tiết đơn hàng
              </span>
              <span className="font-mono text-xs font-bold text-neutral-400">#{order.id}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-lg font-bold font-mono tracking-tight text-white">
                {order.order_code || `ORD-${order.id}`}
              </h2>
              {order.order_code && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 text-neutral-400 hover:text-white transition"
                  title="Sao chép mã đơn"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`badge-minimal ${status.color}`}>
              {status.label}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          {/* Order Progress Tracker */}
          <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
            {isCancelled ? (
              <div className="flex items-center gap-3 text-rose-300">
                <Ban className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">Đơn hàng đã bị hủy</div>
                  <div className="text-[11px] text-neutral-400">Đơn hàng không còn hiệu lực thực hiện giao nhận.</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {STEPS.map((step) => {
                    const isDone = step.id <= status.stepIndex;
                    const isCurrent = step.id === status.stepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-white text-black shadow-lg shadow-white/10'
                              : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`mt-2 text-[11px] font-mono uppercase tracking-wider ${
                            isCurrent
                              ? 'text-white font-bold'
                              : isDone
                              ? 'text-neutral-300'
                              : 'text-neutral-500'
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {status.desc && (
                  <p className="mt-3 text-center text-xs text-neutral-400 italic">
                    {status.desc}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Delivery & Order Metadata grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Shipping Info Card */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Địa chỉ giao hàng
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  {recipientName}
                </div>
                {phone && (
                  <div className="flex items-center gap-2 text-neutral-300 font-mono">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    {phone}
                  </div>
                )}
                <div className="text-neutral-400 pl-5 leading-relaxed">
                  {fullAddress || 'Địa chỉ tiêu chuẩn'}
                </div>
              </div>
            </div>

            {/* Order Timestamps & Note */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Thời gian & Ghi chú
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-400">Thời gian đặt: </span>
                  <span className="font-mono text-neutral-200">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Cập nhật lần cuối: </span>
                  <span className="font-mono text-neutral-200">
                    {new Date(order.updated_at || order.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                {order.note ? (
                  <div className="pt-1 text-amber-300/90 text-xs italic bg-neutral-950/60 p-2 rounded border border-neutral-800">
                    "{order.note}"
                  </div>
                ) : (
                  <div className="text-neutral-500 italic text-[11px]">Không có ghi chú thêm.</div>
                )}
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>Sản phẩm trong đơn ({items.length})</span>
              <span className="text-[11px] text-neutral-400 font-sans">Chi tiết mặt hàng đã đặt</span>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 divide-y divide-neutral-800/80 overflow-hidden">
              {items.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  Không tìm thấy danh sách chi tiết các mặt hàng.
                </div>
              ) : (
                items.map((it) => {
                  const unitPrice = parseFloat(it.price || it.unit_price || it.price_snapshot || 0);
                  const qty = parseInt(it.quantity, 10) || 1;
                  const lineTotal = parseFloat(it.subtotal) || unitPrice * qty;
                  const size = it.size || it.size_snapshot;
                  const color = it.color || it.color_snapshot;
                  const productName = it.product_name || it.product_name_snapshot || 'Sản phẩm thời trang';

                  return (
                    <div key={it.id || `${it.product_id}-${it.variant_id}`} className="p-4 flex items-center gap-4 hover:bg-neutral-900/60 transition">
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-lg bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700/60">
                        <img
                          src={
                            it.image_url ||
                            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80'
                          }
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {productName}
                        </h4>

                        {/* Fashion Variant Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {size && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                              Size: {size}
                            </span>
                          )}

                          {color && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                              {it.color_code && (
                                <span
                                  className="w-2 h-2 rounded-full border border-neutral-600 inline-block"
                                  style={{ backgroundColor: it.color_code }}
                                />
                              )}
                              Màu: {color}
                            </span>
                          )}

                          <span className="text-neutral-400 font-mono text-[11px]">
                            x{qty}
                          </span>
                        </div>
                      </div>

                      {/* Line Price */}
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm font-bold text-white">
                          {lineTotal.toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400">
                          {unitPrice.toLocaleString('vi-VN')} ₫ / cái
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Tạm tính hàng hóa:</span>
              <span className="font-mono text-neutral-200">
                {Number(order.total_amount).toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Vận chuyển tiêu chuẩn:
              </span>
              <span className="font-mono text-emerald-400 uppercase font-semibold text-[11px]">
                Miễn phí (Free)
              </span>
            </div>
            <div className="border-t border-neutral-800 pt-2.5 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Tổng thanh toán:
              </span>
              <span className="text-xl font-extrabold font-mono text-white tracking-tight">
                {Number(order.total_amount).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-neutral-800 px-6 py-4 bg-neutral-900/60 flex items-center justify-between">
          <div>
            {isCancellable && onCancelOrder && (
              <button
                type="button"
                onClick={() => onCancelOrder(order.id)}
                disabled={isCancelling}
                className="btn-danger !py-2 text-xs flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                {isCancelling ? 'Đang xử lý hủy...' : 'Hủy đơn hàng này'}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary !py-2 text-xs"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

