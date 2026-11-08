import { X } from 'lucide-react';
import Alert from '../common/Alert';

export default function ProductModal({
  isOpen,
  modalMode,
  formData,
  formErrors,
  categories,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {modalMode === 'create' ? 'Thêm sản phẩm mới' : 'Cập nhật thông tin sản phẩm'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {formErrors.general && <Alert type="error" message={formErrors.general} />}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Tên sản phẩm:
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Áo khoác Blazer đen tối giản"
              className="input-minimal text-xs"
            />
            {formErrors.name && (
              <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.name}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Đơn giá (VNĐ):
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => onChange({ ...formData, price: e.target.value })}
                placeholder="Ví dụ: 850000"
                className="input-minimal text-xs"
              />
              {formErrors.price && (
                <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.price}</span>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Danh mục:
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => onChange({ ...formData, category_id: e.target.value })}
                className="input-minimal text-xs uppercase tracking-wider bg-neutral-900 border-neutral-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  Số lượng tồn kho:
                </label>
                {formData.has_variants && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    ({formData.variant_count || 'Các'} biến thể)
                  </span>
                )}
              </div>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => onChange({ ...formData, stock_quantity: e.target.value })}
                readOnly={formData.has_variants}
                className={`input-minimal text-xs ${
                  formData.has_variants ? 'opacity-80 bg-neutral-800/60 cursor-not-allowed' : ''
                }`}
              />
              {formData.has_variants && (
                <span className="text-[10px] text-neutral-400 block mt-1">
                  💡 Tồn kho được tính từ tổng các Size/Màu. Chỉnh sửa chi tiết tại nút <strong>"Biến thể"</strong>.
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Phân loại giới tính:
              </label>
              <select
                value={formData.gender || 'unisex'}
                onChange={(e) => onChange({ ...formData, gender: e.target.value })}
                className="input-minimal text-xs bg-neutral-900 border-neutral-800"
              >
                <option value="unisex">Unisex (Phi giới tính)</option>
                <option value="men">Nam (Men)</option>
                <option value="women">Nữ (Women)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Thương hiệu (Brand):
              </label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => onChange({ ...formData, brand: e.target.value })}
                placeholder="VD: Monokro Studio"
                className="input-minimal text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                URL hình ảnh:
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => onChange({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="input-minimal text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Mô tả chi tiết:
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
              placeholder="Chất liệu, phom dáng và xuất xứ..."
              className="input-minimal text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2 text-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !py-2 text-xs"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

