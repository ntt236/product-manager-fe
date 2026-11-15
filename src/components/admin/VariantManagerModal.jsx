import { useState, useEffect, useCallback } from 'react';
import variantService from '../../services/variantService';
import { X, Plus, Trash2, Layers, Wand2 } from 'lucide-react';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';
import { resolveColorCode, getEffectiveColorCode } from '../../utils/colorUtils';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const SHOE_SIZES = ['37', '38', '39', '40', '41', '42', '43', '44', '45'];

const COLOR_PRESETS = [
  { name: 'Đen', code: '#171717' },
  { name: 'Trắng', code: '#FFFFFF' },
  { name: 'Vàng', code: '#FACC15' },
  { name: 'Đỏ', code: '#EF4444' },
  { name: 'Xanh Navy', code: '#1E3A8A' },
  { name: 'Be', code: '#F5F5DC' },
  { name: 'Xám', code: '#737373' },
  { name: 'Hồng', code: '#F472B6' },
];

export default function VariantManagerModal({ isOpen, onClose, product, onVariantChanged }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'single' | 'bulk'
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Single variant form state
  const [singleForm, setSingleForm] = useState({
    size: 'M',
    color: 'Đen',
    color_code: '#171717',
    sku: '',
    price_override: '',
    stock_quantity: 20,
  });

  // Bulk matrix generator state
  const [bulkMode, setBulkMode] = useState('clothing'); // 'clothing' | 'shoes'
  const [selectedBulkSizes, setSelectedBulkSizes] = useState(['M', 'L']);
  const [bulkColors, setBulkColors] = useState('Đen, Trắng');
  const [bulkStock, setBulkStock] = useState(25);

  const loadVariants = useCallback(async () => {
    if (!product?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await variantService.getByProductId(product.id);
      if (res && res.data) {
        setVariants(res.data);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách biến thể.');
    } finally {
      setLoading(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (isOpen && product?.id) {
      loadVariants();
      setActiveTab('list');
      setError('');
      setSuccess('');
    }
  }, [isOpen, product?.id, loadVariants]);

  // Handle color name input with auto color_code detection
  const handleColorInputChange = (colorVal) => {
    const autoCode = resolveColorCode(colorVal);
    setSingleForm((prev) => ({
      ...prev,
      color: colorVal,
      color_code: autoCode !== '#737373' ? autoCode : prev.color_code,
    }));
  };

  const handleSelectColorPreset = (preset) => {
    setSingleForm((prev) => ({
      ...prev,
      color: preset.name,
      color_code: preset.code,
    }));
  };

  // Adjust bulk sizes when bulk mode switches
  const handleBulkModeSwitch = (mode) => {
    setBulkMode(mode);
    if (mode === 'clothing') {
      setSelectedBulkSizes(['S', 'M', 'L', 'XL']);
    } else {
      setSelectedBulkSizes(['39', '40', '41', '42']);
    }
  };

  const toggleBulkSize = (size) => {
    if (selectedBulkSizes.includes(size)) {
      setSelectedBulkSizes(selectedBulkSizes.filter((s) => s !== size));
    } else {
      setSelectedBulkSizes([...selectedBulkSizes, size]);
    }
  };

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!singleForm.size || !singleForm.color) {
      setError('Vui lòng nhập Size và Màu sắc.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const finalColorCode = singleForm.color_code || resolveColorCode(singleForm.color);
      await variantService.createVariant(product.id, {
        size: singleForm.size,
        color: singleForm.color,
        color_code: finalColorCode,
        sku: singleForm.sku || `${product.id}-${singleForm.size}-${singleForm.color}`.toUpperCase(),
        price_override: singleForm.price_override ? parseFloat(singleForm.price_override) : null,
        stock_quantity: parseInt(singleForm.stock_quantity, 10) || 0,
      });
      setSuccess('Thêm biến thể thành công!');
      await loadVariants();
      if (onVariantChanged) onVariantChanged();
      setActiveTab('list');
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo biến thể.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBulk = async (e) => {
    e.preventDefault();
    const colors = bulkColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (selectedBulkSizes.length === 0 || colors.length === 0) {
      setError('Vui lòng chọn ít nhất 1 size và 1 màu sắc.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    // Generate matrix variants with true resolved color codes
    const generatedVariants = [];
    for (const size of selectedBulkSizes) {
      for (const color of colors) {
        const code = resolveColorCode(color);
        generatedVariants.push({
          size,
          color,
          color_code: code,
          stock_quantity: parseInt(bulkStock, 10) || 20,
          sku: `${product.id}-${size}-${color}`.toUpperCase(),
        });
      }
    }

    try {
      const res = await variantService.createBulkVariants(product.id, generatedVariants);
      setSuccess(`Đã tạo thành công ma trận ${res.count || generatedVariants.length} biến thể!`);
      await loadVariants();
      if (onVariantChanged) onVariantChanged();
      setActiveTab('list');
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo ma trận biến thể.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Bạn có chắc muốn xóa biến thể này?')) return;
    try {
      await variantService.deleteVariant(variantId);
      setSuccess('Đã xóa biến thể.');
      await loadVariants();
      if (onVariantChanged) onVariantChanged();
    } catch (err) {
      setError(err.message || 'Không thể xóa biến thể.');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                Quản lý biến thể (Size & Màu)
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Sản phẩm: <span className="text-neutral-200">{product.name}</span> (ID: #{product.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-900 px-5 pt-3 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 transition border-b-2 uppercase tracking-wider ${
              activeTab === 'list'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Danh sách biến thể ({variants.length})
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`pb-2.5 transition border-b-2 uppercase tracking-wider ${
              activeTab === 'single'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            + Thêm biến thể đơn
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-2.5 transition border-b-2 uppercase tracking-wider flex items-center gap-1.5 ${
              activeTab === 'bulk'
                ? 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            Tạo ma trận Size tự động
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="px-5 pt-3">
            <Alert type="error" message={error} />
          </div>
        )}
        {success && (
          <div className="px-5 pt-3">
            <Alert type="success" message={success} />
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: LIST OF VARIANTS */}
          {activeTab === 'list' && (
            <div>
              {loading ? (
                <div className="py-12">
                  <LoadingSpinner text="Đang tải danh sách biến thể..." />
                </div>
              ) : variants.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Layers className="w-10 h-10 text-neutral-600 mx-auto stroke-[1.2]" />
                  <p className="text-xs text-neutral-400">
                    Sản phẩm này chưa có biến thể kích cỡ (Size) hoặc màu sắc nào.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('single')}
                      className="btn-secondary !py-1.5 text-xs"
                    >
                      Thêm thủ công
                    </button>
                    <button
                      onClick={() => setActiveTab('bulk')}
                      className="btn-primary !py-1.5 text-xs flex items-center gap-1"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Tạo tự động theo ma trận
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-neutral-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Kích cỡ (Size)</th>
                        <th className="px-3.5 py-2.5">Màu sắc</th>
                        <th className="px-3.5 py-2.5">Tồn kho</th>
                        <th className="px-3.5 py-2.5">Mã SKU</th>
                        <th className="px-3.5 py-2.5">Giá ghi đè</th>
                        <th className="px-3.5 py-2.5 text-right">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 font-mono">
                      {variants.map((v) => {
                        const displayColorCode = getEffectiveColorCode(v.color_code, v.color);

                        return (
                          <tr key={v.id} className="hover:bg-neutral-800/40 transition">
                            <td className="px-3.5 py-2.5 font-bold text-white">
                              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-xs">
                                {v.size}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 flex items-center gap-2 font-sans">
                              <span
                                className="w-3 h-3 rounded-full border border-neutral-600 shrink-0 inline-block"
                                style={{ backgroundColor: displayColorCode }}
                              />
                              <span className="text-neutral-200">{v.color}</span>
                            </td>
                            <td className="px-3.5 py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] ${
                                  v.stock_quantity > 0
                                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50'
                                    : 'text-rose-400 bg-rose-950/40 border border-rose-800/50'
                                }`}
                              >
                                {v.stock_quantity} cái
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-neutral-400 text-[11px]">
                              {v.sku || '—'}
                            </td>
                            <td className="px-3.5 py-2.5 text-neutral-300">
                              {v.price_override
                                ? `${Number(v.price_override).toLocaleString('vi-VN')} ₫`
                                : 'Theo giá gốc'}
                            </td>
                            <td className="px-3.5 py-2.5 text-right font-sans">
                              <button
                                onClick={() => handleDeleteVariant(v.id)}
                                className="p-1 rounded text-neutral-500 hover:text-rose-400 transition"
                                title="Xóa biến thể"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SINGLE VARIANT FORM */}
          {activeTab === 'single' && (
            <form onSubmit={handleCreateSingle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Kích cỡ (Size):
                  </label>
                  <input
                    type="text"
                    required
                    value={singleForm.size}
                    onChange={(e) => setSingleForm({ ...singleForm, size: e.target.value })}
                    placeholder="VD: S, M, L, XL hoặc 39, 40, 41"
                    className="input-minimal text-xs"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['S', 'M', 'L', 'XL', '39', '40', '41', '42'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSingleForm({ ...singleForm, size: sz })}
                        className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 hover:text-white"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Màu sắc:
                  </label>
                  <input
                    type="text"
                    required
                    value={singleForm.color}
                    onChange={(e) => handleColorInputChange(e.target.value)}
                    placeholder="VD: Vàng, Đen, Trắng, Be, Xám"
                    className="input-minimal text-xs"
                  />
                  {/* Color Preset Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {COLOR_PRESETS.map((cp) => (
                      <button
                        key={cp.name}
                        type="button"
                        onClick={() => handleSelectColorPreset(cp)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 transition"
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-neutral-600 inline-block"
                          style={{ backgroundColor: cp.code }}
                        />
                        <span>{cp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Mã màu (Hex):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={singleForm.color_code || '#FACC15'}
                      onChange={(e) => setSingleForm({ ...singleForm, color_code: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={singleForm.color_code}
                      onChange={(e) => setSingleForm({ ...singleForm, color_code: e.target.value })}
                      placeholder="#FACC15"
                      className="input-minimal text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Số lượng tồn:
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={singleForm.stock_quantity}
                    onChange={(e) => setSingleForm({ ...singleForm, stock_quantity: e.target.value })}
                    className="input-minimal text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Giá ghi đè (tùy chọn):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleForm.price_override}
                    onChange={(e) => setSingleForm({ ...singleForm, price_override: e.target.value })}
                    placeholder="Để trống nếu bằng giá gốc"
                    className="input-minimal text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Mã SKU định danh (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={singleForm.sku}
                  onChange={(e) => setSingleForm({ ...singleForm, sku: e.target.value })}
                  placeholder={`Mặc định: ${product.id}-${singleForm.size}-${singleForm.color}`}
                  className="input-minimal text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="btn-secondary !py-2 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-2 text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Đang tạo...' : 'Lưu biến thể'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BULK MATRIX GENERATOR */}
          {activeTab === 'bulk' && (
            <form onSubmit={handleCreateBulk} className="space-y-5">
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Bộ tạo ma trận tự động (Size &times; Màu sắc)
                </p>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Công cụ này tự động nhân ma trận giữa các kích cỡ đã chọn và danh sách màu sắc, tự động gán mã màu (Color Code) thực tế chính xác và gán tồn kho tức thời.
                </p>
              </div>

              {/* Mode switch */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  1. Chọn định dạng nhóm sản phẩm:
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleBulkModeSwitch('clothing')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium uppercase tracking-wider transition ${
                      bulkMode === 'clothing'
                        ? 'border-white bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Quần áo (XS - 3XL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkModeSwitch('shoes')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium uppercase tracking-wider transition ${
                      bulkMode === 'shoes'
                        ? 'border-white bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Giày dép (Size 37 - 45)
                  </button>
                </div>
              </div>

              {/* Size checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  2. Chọn các kích cỡ muốn tạo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(bulkMode === 'clothing' ? CLOTHING_SIZES : SHOE_SIZES).map((sz) => {
                    const isChecked = selectedBulkSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleBulkSize(sz)}
                        className={`min-w-10 py-1.5 px-3 rounded-lg border text-xs font-mono font-semibold transition ${
                          isChecked
                            ? 'border-white bg-white text-neutral-950 shadow-sm'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  3. Danh sách màu sắc (cách nhau bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  required
                  value={bulkColors}
                  onChange={(e) => setBulkColors(e.target.value)}
                  placeholder="VD: Đen, Trắng, Vàng, Xám, Be"
                  className="input-minimal text-xs"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.name}
                      type="button"
                      onClick={() => {
                        const current = bulkColors
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean);
                        if (!current.includes(cp.name)) {
                          setBulkColors([...current, cp.name].join(', '));
                        }
                      }}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 hover:text-white"
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: cp.code }}
                      />
                      <span>+{cp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Default stock per variant */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  4. Số lượng tồn kho cho mỗi biến thể:
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  className="input-minimal text-xs font-mono max-w-[200px]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">
                  Sẽ tạo:{' '}
                  <span className="text-white font-bold">
                    {selectedBulkSizes.length *
                      bulkColors
                        .split(',')
                        .map((c) => c.trim())
                        .filter(Boolean).length}
                  </span>{' '}
                  biến thể
                </span>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="btn-secondary !py-2 text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary !py-2 text-xs flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{submitting ? 'Đang tạo ma trận...' : 'Tạo ma trận biến thể'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
