import { useState, useEffect, useCallback } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import CategoryManager from '../../components/admin/CategoryManager';
import ProductTable from '../../components/admin/ProductTable';
import ProductModal from '../../components/admin/ProductModal';
import VariantManagerModal from '../../components/admin/VariantManagerModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Package, FolderTree, Plus, Search, RefreshCw } from 'lucide-react';

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    stock_quantity: 100,
    gender: 'unisex',
    brand: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAll();
      if (res && res.data) setCategories(res.data);
    } catch (e) {
      // Ignored
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadProducts = useCallback(
    async (pageToLoad = 1) => {
      setLoading(true);
      try {
        const res = await productService.getAll({
          page: pageToLoad,
          limit: 10,
          search: search.trim() || undefined,
          category_id: selectedCategory || undefined,
        });

        if (res && res.data) {
          setProducts(res.data);
          if (res.pagination) setPagination(res.pagination);
        }
      } catch (err) {
        setAlert({
          type: 'error',
          message: err.message || 'Không thể tải danh sách sản phẩm.',
        });
      } finally {
        setLoading(false);
      }
    },
    [search, selectedCategory]
  );

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts(1);
    }
  }, [loadProducts, activeTab]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: categories[0]?.id || '',
      stock_quantity: 100,
      gender: 'unisex',
      brand: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setModalMode('edit');
    setEditingId(p.id);

    const hasVariants =
      (p.available_sizes && p.available_sizes.length > 0) ||
      parseInt(p.variant_count, 10) > 0;
    const effectiveStock = hasVariants
      ? Math.max(parseInt(p.stock_quantity, 10) || 0, parseInt(p.total_variant_stock, 10) || 0)
      : (parseInt(p.stock_quantity, 10) || 0);

    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      image_url: p.image_url || '',
      category_id: p.category_id || categories[0]?.id || '',
      stock_quantity: effectiveStock,
      gender: p.gender || 'unisex',
      brand: p.brand || '',
      has_variants: hasVariants,
      variant_count: p.variant_count || p.available_sizes?.length || 0,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên sản phẩm không được để trống';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Giá sản phẩm phải là số dương';
    }
    if (!formData.category_id) errors.category_id = 'Vui lòng chọn danh mục';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        image_url: formData.image_url.trim() || undefined,
        category_id: Number(formData.category_id),
        stock_quantity: Number(formData.stock_quantity) || 0,
        gender: formData.gender || 'unisex',
        brand: formData.brand.trim() || undefined,
      };

      if (modalMode === 'create') {
        await productService.create(payload);
        setAlert({ type: 'success', message: 'Tạo sản phẩm mới thành công!' });
      } else {
        await productService.update(editingId, payload);
        setAlert({ type: 'success', message: 'Cập nhật sản phẩm thành công!' });
      }
      setIsModalOpen(false);
      loadProducts(pagination.page);
    } catch (err) {
      setFormErrors({ general: err.message || 'Lỗi khi lưu sản phẩm' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productService.delete(deleteTarget.id);
      setAlert({ type: 'success', message: `Đã xóa sản phẩm "${deleteTarget.name}" thành công!` });
      setDeleteTarget(null);
      loadProducts(pagination.page);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Không thể xóa sản phẩm' });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'products'
              ? 'bg-neutral-800 text-white border border-neutral-700/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Quản lý Sản phẩm</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
            activeTab === 'categories'
              ? 'bg-neutral-800 text-white border border-neutral-700/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Quản lý Danh mục ({categories.length})</span>
        </button>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      {activeTab === 'categories' ? (
        <CategoryManager
          onCategoryUpdated={() => {
            loadCategories();
            loadProducts(pagination.page);
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-minimal pl-9 text-xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-minimal text-xs uppercase tracking-wider bg-neutral-900 border-neutral-800 max-w-[160px]"
              >
                <option value="">Tất cả DM</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadProducts(1)}
                className="btn-secondary !py-2 text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tải lại
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="btn-primary !py-2 text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Thêm sản phẩm
              </button>
            </div>
          </div>

          {loading ? (
            <div className="my-16">
              <LoadingSpinner text="Đang tải dữ liệu sản phẩm..." />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 border border-neutral-800 rounded-xl bg-neutral-900/40 space-y-3">
              <p className="text-sm text-neutral-400">Không tìm thấy sản phẩm nào.</p>
              <button onClick={handleOpenCreateModal} className="btn-primary text-xs">
                + Thêm sản phẩm ngay
              </button>
            </div>
          ) : (
            <ProductTable
              products={products}
              pagination={pagination}
              onEdit={handleOpenEditModal}
              onDelete={setDeleteTarget}
              onManageVariants={(p) => setVariantModalProduct(p)}
              onPageChange={(p) => loadProducts(p)}
            />
          )}

          <ProductModal
            isOpen={isModalOpen}
            modalMode={modalMode}
            formData={formData}
            formErrors={formErrors}
            categories={categories}
            isSubmitting={isSubmitting}
            onClose={() => setIsModalOpen(false)}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
          />

          <VariantManagerModal
            isOpen={!!variantModalProduct}
            product={variantModalProduct}
            onClose={() => setVariantModalProduct(null)}
            onVariantChanged={() => loadProducts(pagination.page)}
          />

          <ConfirmDeleteModal
            isOpen={!!deleteTarget}
            title="Xác nhận xóa sản phẩm?"
            message={`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${deleteTarget?.name}"?`}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

