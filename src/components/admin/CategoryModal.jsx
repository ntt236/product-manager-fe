import { X } from 'lucide-react';
import Alert from '../common/Alert';

export default function CategoryModal({
  isOpen,
  modalMode,
  formData,
  formError,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            {modalMode === 'create' ? 'Tạo danh mục mới' : 'Cập nhật danh mục'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {formError && <Alert type="error" message={formError} />}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Tên danh mục:
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Áo sơ mi nam, Phụ kiện..."
              className="input-minimal text-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
              Mô tả ngắn:
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
              placeholder="Mô tả nhóm sản phẩm..."
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

