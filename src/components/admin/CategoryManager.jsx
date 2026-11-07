import { useState, useEffect, useCallback } from 'react';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';
import CategoryModal from './CategoryModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Plus, Edit2, Trash2, FolderTree, RefreshCw } from 'lucide-react';

export default function CategoryManager({ onCategoryUpdated }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Xóa
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Không thể tải danh sách danh mục.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setEditingId(cat.id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Tên danh mục không được để trống.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (modalMode === 'create') {
        await categoryService.create(formData);
        setAlert({ type: 'success', message: 'Tạo danh mục mới thành công!' });
      } else {
        await categoryService.update(editingId, formData);
        setAlert({ type: 'success', message: 'Cập nhật danh mục thành công!' });
      }
      setIsModalOpen(false);
      loadCategories();
      if (onCategoryUpdated) onCategoryUpdated();
    } catch (err) {
      setFormError(err.message || 'Đã có lỗi xảy ra khi lưu danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.delete(deleteTarget.id);
      setAlert({ type: 'success', message: `Đã xóa danh mục "${deleteTarget.name}" thành công!` });
      setDeleteTarget(null);
      loadCategories();
      if (onCategoryUpdated) onCategoryUpdated();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Không thể xóa danh mục này.',
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-neutral-400" />
            Danh sách Danh mục Sản phẩm
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Tổng cộng: <span className="font-mono text-neutral-200">{categories.length}</span> danh mục
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={loadCategories} className="btn-secondary !py-2 text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
          <button onClick={handleOpenCreateModal} className="btn-primary !py-2 text-xs flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Thêm danh mục
          </button>
        </div>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      {loading ? (
        <div className="my-16">
          <LoadingSpinner text="Đang tải dữ liệu danh mục..." />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border border-neutral-800 rounded-xl bg-neutral-900/40 space-y-3">
          <p className="text-sm text-neutral-400">Chưa có danh mục nào trong hệ thống.</p>
          <button onClick={handleOpenCreateModal} className="btn-primary text-xs">
            + Tạo danh mục đầu tiên
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/90 text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Tên danh mục</th>
                <th className="px-5 py-3">Mô tả</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-900/90 transition">
                  <td className="px-5 py-3.5 text-neutral-400">#{c.id}</td>
                  <td className="px-5 py-3.5 text-neutral-200 font-sans font-medium text-sm">
                    {c.name}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400 font-sans max-w-md truncate">
                    {c.description || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-sans space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition inline-flex items-center gap-1 text-[11px]"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
                      className="p-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition inline-flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add / Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        modalMode={modalMode}
        formData={formData}
        formError={formError}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onChange={setFormData}
        onSubmit={handleFormSubmit}
      />

      {/* Modal Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa danh mục?"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"?`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

