import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import variantService from '../../services/variantService';
import reviewService from '../../services/reviewService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import ReviewSection from '../../components/product/ReviewSection';
import { getEffectiveColorCode } from '../../utils/colorUtils';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowLeft,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError('');
      try {
        const [prodRes, varRes] = await Promise.all([
          productService.getById(id),
          variantService.getByProductId(id).catch(() => ({ data: [] })),
        ]);

        if (prodRes && prodRes.data) {
          setProduct(prodRes.data);
        } else {
          setError('Không tìm thấy thông tin sản phẩm.');
        }

        const fetchedVariants =
          (varRes && varRes.data && varRes.data.length > 0)
            ? varRes.data
            : (prodRes?.data?.variants || []);

        if (fetchedVariants && fetchedVariants.length > 0) {
          setVariants(fetchedVariants);
          const first = fetchedVariants[0];
          setSelectedVariant(first);
          setSelectedSize(first.size);
          setSelectedColor(first.color);
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi tải chi tiết sản phẩm.');
      } finally {
        setLoading(false);
      }
    }

    async function fetchReviews() {
      try {
        setLoadingReviews(true);
        const res = await reviewService.getByProductId(id);
        if (res && res.data) {
          setReviews(res.data);
          setAvgRating(res.averageRating || 0);
          setReviewCount(res.count || 0);
        }
      } catch (err) {
        // Ignored
      } finally {
        setLoadingReviews(false);
      }
    }

    if (id) {
      fetchDetail();
      fetchReviews();
    }
  }, [id]);

  // Handle variant selection
  const availableSizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean);
  const availableColors = Array.from(new Set(variants.map((v) => v.color))).filter(Boolean);

  const handleSelectSize = (sz) => {
    setSelectedSize(sz);
    const matched = variants.find((v) => v.size === sz && v.color === selectedColor) ||
      variants.find((v) => v.size === sz);
    if (matched) {
      setSelectedVariant(matched);
      setSelectedColor(matched.color);
    }
  };

  const handleSelectColor = (col) => {
    setSelectedColor(col);
    const matched = variants.find((v) => v.color === col && v.size === selectedSize) ||
      variants.find((v) => v.color === col);
    if (matched) {
      setSelectedVariant(matched);
      setSelectedSize(matched.size);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const stock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
    if (stock <= 0) return;

    try {
      setAdding(true);
      const variantId = selectedVariant ? selectedVariant.id : null;
      await addToCart(product.id, quantity, variantId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.message || 'Không thể thêm sản phẩm');
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewService.createReview(id, {
        rating: newRating,
        comment: newComment,
      });
      setNewComment('');
      const res = await reviewService.getByProductId(id);
      if (res && res.data) {
        setReviews(res.data);
        setAvgRating(res.averageRating || 0);
        setReviewCount(res.count || 0);
      }
    } catch (err) {
      alert(err.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="my-24">
        <LoadingSpinner text="Đang tải dữ liệu sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto my-20 max-w-md px-4 text-center space-y-4">
        <Alert type="error" message={error || 'Sản phẩm không tồn tại'} />
        <button onClick={() => navigate('/products')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  // Current price and stock based on variant
  const currentPrice = selectedVariant?.price_override ?? product.price;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = currentStock <= 0;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(currentPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400">
        <Link to="/" className="hover:text-white transition">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-white transition">
          Bộ sưu tập
        </Link>
        <span>/</span>
        <span className="text-neutral-200 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: Product Image */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden relative aspect-[3/4] max-h-[620px] flex items-center justify-center">
          <img
            src={
              selectedVariant?.image_url ||
              product.image_url ||
              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {isOutOfStock && (
            <span className="absolute top-4 left-4 badge-minimal bg-rose-950/90 text-rose-300 border-rose-800 px-3 py-1">
              Hết hàng
            </span>
          )}
        </div>

        {/* Right: Info & Fashion Options */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="badge-minimal bg-neutral-800 text-neutral-300 border-neutral-700">
                {product.category_name || 'Thời trang Unisex'}
              </span>
              {product.gender && (
                <span className="badge-minimal bg-neutral-900 text-neutral-400 border-neutral-800 uppercase">
                  {product.gender}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(avgRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-neutral-300">
                {avgRating > 0 ? avgRating : '5.0'}
              </span>
              <span className="text-xs text-neutral-400">({reviewCount} nhận xét)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4 py-4 border-y border-neutral-800">
            <span className="text-3xl font-bold font-mono text-white">{formattedPrice}</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-md border font-mono ${
                !isOutOfStock
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60'
                  : 'bg-rose-950/50 text-rose-300 border-rose-800/60'
              }`}
            >
              {!isOutOfStock ? `Còn ${currentStock} sản phẩm` : 'Tạm hết hàng'}
            </span>
          </div>

          {/* Fashion Variants: Color swatch */}
          {availableColors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-neutral-300 font-medium">
                  Màu sắc:
                </span>
                <span className="text-neutral-400 font-mono">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((color) => {
                  const matched = variants.find((v) => v.color === color);
                  const isSelected = selectedColor === color;
                  const swatchColor = getEffectiveColorCode(matched?.color_code, color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleSelectColor(color)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition ${
                        isSelected
                          ? 'border-white bg-neutral-800 text-white shadow-sm'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-600 inline-block"
                        style={{ backgroundColor: swatchColor }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fashion Variants: Size buttons */}
          {availableSizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-neutral-300 font-medium">
                  Kích cỡ (Size):
                </span>
                <span className="text-neutral-400 font-mono">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSelectSize(sz)}
                      className={`min-w-11 py-2 px-3 rounded-lg border text-xs font-mono font-semibold transition ${
                        isSelected
                          ? 'border-white bg-white text-neutral-950 shadow-md'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Chi tiết sản phẩm
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line font-light">
              {product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-neutral-400">Số lượng:</span>
                <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-mono text-neutral-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock || 99, q + 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className="flex-1 btn-primary py-3.5 text-xs flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    Đã thêm vào giỏ hàng
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {adding ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
                  </>
                )}
              </button>
              <button onClick={() => navigate('/products')} className="btn-secondary py-3.5">
                Xem sản phẩm khác
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-neutral-400 text-center">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-neutral-800/60 bg-neutral-900/40">
              <Truck className="w-4 h-4 text-neutral-300" />
              <span className="text-[11px] font-medium text-neutral-300">Giao 24-48h</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-neutral-800/60 bg-neutral-900/40">
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
              <span className="text-[11px] font-medium text-neutral-300">Chính hãng 100%</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-neutral-800/60 bg-neutral-900/40">
              <RotateCcw className="w-4 h-4 text-neutral-300" />
              <span className="text-[11px] font-medium text-neutral-300">Đổi trả 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection
        reviews={reviews}
        avgRating={avgRating}
        reviewCount={reviewCount}
        loadingReviews={loadingReviews}
        isAuthenticated={isAuthenticated}
        newRating={newRating}
        setNewRating={setNewRating}
        newComment={newComment}
        setNewComment={setNewComment}
        submittingReview={submittingReview}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
}
