import { useState, useEffect } from 'react';
import addressService from '../../services/addressService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressService.getAll();
      if (res && res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải sổ địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !addressLine.trim() || !city.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại, địa chỉ và thành phố.');
      return;
    }
    setSaving(true);
    try {
      await addressService.create({
        receiver_name: recipientName.trim(),
        recipient_name: recipientName.trim(),
        phone: phone.trim(),
        street_address: addressLine.trim(),
        address_line: addressLine.trim(),
        province: city.trim(),
        district: city.trim(),
        city: city.trim(),
        is_default: isDefault,
      });
      setShowModal(false);
      setRecipientName('');
      setPhone('');
      setAddressLine('');
      setCity('');
      setIsDefault(false);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || 'Không thể thêm địa chỉ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await addressService.delete(id);
      await fetchAddresses();
    } catch (err) {
      alert(err.message || 'Không thể xóa địa chỉ');
    }
  };

  if (loading) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải danh sách địa chỉ..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Tài khoản
          </span>
          <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-neutral-400" />
            Sổ địa chỉ nhận hàng
          </h1>
          <p className="mt-1.5 text-xs text-neutral-400">
            Quản lý địa chỉ giao hàng để thanh toán nhanh chóng hơn.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary !py-2 text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm địa chỉ mới
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="my-16 text-center space-y-4">
          <MapPin className="w-12 h-12 text-neutral-600 mx-auto stroke-[1.2]" />
          <p className="text-sm text-neutral-400">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
          <button onClick={() => setShowModal(true)} className="btn-secondary text-xs">
            Thêm ngay địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col justify-between hover:border-neutral-700 transition space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-100">
                    {addr.receiver_name || addr.recipient_name}
                  </span>
                  {addr.is_default && (
                    <span className="badge-minimal bg-neutral-800 text-[10px] text-neutral-300 border-neutral-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mặc định
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1 font-mono">{addr.phone}</p>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  {addr.street_address || addr.address_line}
                  {addr.ward ? `, ${addr.ward}` : ''}
                  {addr.district && addr.district !== (addr.province || addr.city) ? `, ${addr.district}` : ''}
                  {`, ${addr.province || addr.city}`}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex justify-end">
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-neutral-500 hover:text-rose-400 p-1 transition"
                  title="Xóa địa chỉ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 shadow-2xl">
            <h2 className="text-base font-semibold uppercase tracking-wider text-white">
              Thêm địa chỉ nhận hàng mới
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Họ tên người nhận:
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="input-minimal text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="input-minimal text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Địa chỉ chi tiết (Số nhà, đường/phố):
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Ví dụ: 123 Đường Lê Lợi, Phường Bến Nghé"
                  className="input-minimal text-xs sm:col-span-2"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Tỉnh / Thành phố:
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ví dụ: TP. Hồ Chí Minh"
                  className="input-minimal text-xs sm:col-span-2"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-neutral-100"
                />
                Đặt làm địa chỉ nhận hàng mặc định
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary !py-2 text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary !py-2 text-xs"
                >
                  {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

