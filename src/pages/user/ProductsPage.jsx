import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProductsPage({ title = 'Tất cả sản phẩm', targetCategoryName = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const size = searchParams.get('size') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoryService.getAll();
        if (res && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        // Ignored
      }
    }
    fetchCategories();
  }, []);

  const resolvedCategoryId = (() => {
    const fromUrl = searchParams.get('category_id');
    if (fromUrl) return fromUrl;

    if (targetCategoryName && categories.length > 0) {
      const target = targetCategoryName.toLowerCase().trim();

      const found = categories.find((c) => {
        const catName = c.name.toLowerCase().trim();
        if (catName === target) return true;

        if (target === 'men') {
          return !catName.includes('women') && (catName.includes('men') || catName.includes('nam'));
        }
        if (target === 'women') {
          return catName.includes('women') || catName.includes('nữ') || catName.includes('nu');
        }
        if (target === 'shoes') {
          return catName.includes('shoe') || catName.includes('giày') || catName.includes('dep');
        }
        if (target === 'accessories') {
          return catName.includes('access') || catName.includes('phụ kiện') || catName.includes('kien');
        }

        const wordRegex = new RegExp(`\\b${target}\\b`, 'i');
        return wordRegex.test(catName) || catName.includes(target);
      });

      return found ? found.id : '';
    }
    return '';
  })();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await productService.getAll({
        page,
        limit: 8,
        search,
        category_id: resolvedCategoryId || undefined,
        size: size || undefined,
        sort: sort || undefined,
      });

      if (res && res.data) {
        setProducts(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(
        err.status === 401
          ? 'Backend hiện đang yêu cầu xác thực để xem danh sách sản phẩm. Vui lòng đăng nhập.'
          : err.message || 'Không thể tải danh sách sản phẩm.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, resolvedCategoryId, size, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('category_id', val);
    } else {
      params.delete('category_id');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSizeChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('size', val);
    } else {
      params.delete('size');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="mb-8 pb-4 border-b border-neutral-800">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          Bộ sưu tập
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1.5 text-xs text-neutral-400">
          Tìm thấy <span className="font-mono text-neutral-200">{pagination.total}</span> sản phẩm
          {targetCategoryName && ` thuộc nhóm ${targetCategoryName}`}
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      <ProductFilter
        search={search}
        onSearchChange={handleSearchChange}
        categories={categories}
        selectedCategory={resolvedCategoryId}
        onCategoryChange={handleCategoryChange}
        selectedSize={size}
        onSizeChange={handleSizeChange}
        selectedSort={sort}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      {loading ? (
        <div className="my-20">
          <LoadingSpinner text="Đang tải dữ liệu sản phẩm..." />
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3 border-t border-neutral-800 pt-6">
              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="btn-secondary !py-2 text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Trước
              </button>
              <span className="text-xs font-mono text-neutral-400 px-3">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="btn-secondary !py-2 text-xs flex items-center gap-1.5"
              >
                Sau <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="my-20 text-center space-y-2">
          <p className="text-sm font-medium text-neutral-400">
            {targetCategoryName
              ? `Chưa có sản phẩm nào thuộc bộ sưu tập "${targetCategoryName}".`
              : 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.'}
          </p>
          <p className="text-xs text-neutral-400">
            Hãy thử chọn kích cỡ khác hoặc đặt lại bộ lọc.
          </p>
        </div>
      )}
    </div>
  );
}
