import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Plus } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  // Address create form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [creatingAddress, setCreatingAddress] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      setLoading(true);
      try {
        const res = await addressService.getAll();
        if (res && res.data) {
          setAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        setError('Không thể tải danh sách địa chỉ nhận hàng');
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !addressLine.trim() || !city.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại, địa chỉ và thành phố.');
      return;
    }
    setCreatingAddress(true);
    try {
      const res = await addressService.create({
        receiver_name: recipientName.trim(),
        recipient_name: recipientName.trim(),
        phone: phone.trim(),
        street_address: addressLine.trim(),
        address_line: addressLine.trim(),
        province: city.trim(),
        district: city.trim(),
        city: city.trim(),
        is_default: addresses.length === 0,
      });
      if (res && res.data) {
        setAddresses((prev) => [res.data, ...prev]);
        setSelectedAddressId(res.data.id);
        setShowNewAddress(false);
        setRecipientName('');
        setPhone('');
        setAddressLine('');
        setCity('');
      }
    } catch (err) {
      alert(err.message || 'Không thể tạo địa chỉ mới');
    } finally {
      setCreatingAddress(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError('Vui lòng chọn hoặc thêm địa chỉ nhận hàng');
      return;
    }
    if (!cart?.items || cart.items.length === 0) {
      setError('Giỏ hàng của bạn đang trống');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await orderService.checkout({
        shipping_address_id: selectedAddressId,
        note: note.trim() || undefined,
      });
      if (res && res.data) {
        setSuccessOrder(res.data);
        await clearCart();
      }
    } catch (err) {
      setError(err.message || 'Thanh toán thất bại, vui lòng kiểm tra lại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải dữ liệu thanh toán..." />
      </div>
    );
  }

  if (successOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="badge-minimal bg-emerald-950/80 text-emerald-300 border-emerald-800">
            Đặt hàng thành công
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
            Cảm ơn bạn đã mua hàng!
          </h1>
          <p className="text-xs text-neutral-400">
            Mã đơn hàng: <span className="font-mono text-neutral-200">#{successOrder.id}</span> • Tổng thanh toán:{' '}
            <span className="font-mono text-neutral-200">
              {Number(successOrder.total_amount).toLocaleString('vi-VN')} ₫
            </span>
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <Link to="/orders" className="btn-primary text-xs">
            Xem lịch sử đơn hàng
          </Link>
          <Link to="/products" className="btn-secondary text-xs">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <p className="text-sm text-neutral-400">Giỏ hàng của bạn đang trống.</p>
        <Link to="/products" className="btn-primary text-xs inline-flex">
          Khám phá sản phẩm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Hoàn tất đơn hàng
          </span>
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white">
            Thanh toán & Giao nhận
          </h1>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="btn-secondary !py-2 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Mua thêm
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
                  Địa chỉ nhận hàng
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm địa chỉ mới
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">
                Bạn chưa lưu địa chỉ nào. Vui lòng bấm "Thêm địa chỉ mới" bên trên.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`cursor-pointer rounded-lg border p-4 flex flex-col justify-between transition ${
                      selectedAddressId === addr.id
                        ? 'border-neutral-400 bg-neutral-800/80 shadow-md'
                        : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping_address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-neutral-100"
                        />
                        <span className="text-xs font-semibold text-neutral-200">
                          {addr.receiver_name || addr.recipient_name}
                        </span>
                      </div>
                      {addr.is_default && (
                        <span className="badge-minimal bg-neutral-800 text-[9px] text-neutral-400 border-neutral-700">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 font-mono">{addr.phone}</p>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {addr.street_address || addr.address_line}
                      {addr.ward ? `, ${addr.ward}` : ''}
                      {addr.district && addr.district !== (addr.province || addr.city) ? `, ${addr.district}` : ''}
                      {`, ${addr.province || addr.city}`}
                    </p>
                  </label>
                ))}
              </div>
            )}

            {showNewAddress && (
              <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Thêm thông tin nhận hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Họ và tên người nhận"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="input-minimal text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-minimal text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Địa chỉ chi tiết (Số nhà, tên đường)"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="input-minimal text-xs sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Tỉnh / Thành phố"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-minimal text-xs sm:col-span-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(false)}
                    className="btn-secondary !py-1.5 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAddress}
                    disabled={creatingAddress}
                    className="btn-primary !py-1.5 text-xs"
                  >
                    {creatingAddress ? 'Đang lưu...' : 'Lưu địa chỉ'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Ghi chú cho đơn hàng
            </h2>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lời nhắn gửi tới người giao hàng hoặc hướng dẫn đặc biệt..."
              className="input-minimal text-xs resize-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-6 h-fit">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-100 pb-3 border-b border-neutral-800">
            Tóm tắt kiện hàng ({items.length})
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-neutral-800/60">
            {items.map((item) => {
              const itemName = item.product_name || item.name || 'Sản phẩm';
              const unitPrice = parseFloat(item.product_price ?? item.price ?? 0);
              const quantity = parseInt(item.quantity, 10) || 1;
              const itemSubtotal = parseFloat(item.subtotal) || unitPrice * quantity;

              return (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-12 h-14 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={itemName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-500">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-neutral-200 truncate">{itemName}</h4>
                    <p className="text-[11px] font-mono text-neutral-400">
                      {quantity} x {Number(unitPrice).toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-neutral-200">
                    {Number(itemSubtotal).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-neutral-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Tạm tính hàng hóa:</span>
              <span className="font-mono text-neutral-200">
                {Number(subtotal).toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Phí vận chuyển chuẩn:</span>
              <span className="font-mono text-emerald-400 uppercase text-[10px]">Miễn phí</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Phương thức thanh toán:</span>
              <span className="text-neutral-300">Thanh toán khi nhận hàng (COD)</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-800">
              <span>Tổng thanh toán:</span>
              <span className="font-mono text-base">{Number(subtotal).toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting || addresses.length === 0}
            className="w-full btn-primary py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {submitting ? 'Đang khởi tạo đơn hàng...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
