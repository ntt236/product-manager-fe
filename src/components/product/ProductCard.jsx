import { useState } from 'react';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  const hasVariants = product.variant_count > 0 || (product.available_sizes && product.available_sizes.length > 0);
  const totalStock = hasVariants
    ? Math.max(parseInt(product.stock_quantity, 10) || 0, parseInt(product.total_variant_stock, 10) || 0)
    : (parseInt(product.stock_quantity, 10) || 0);
  const isOutOfStock = totalStock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message || 'Không thể thêm sản phẩm');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 transition duration-200 hover:border-neutral-700 hover:bg-neutral-900">
      <div className="relative">
        <Link
          to={`/products/${product.id}`}
          className="block aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-800/80"
        >
          <img
            src={
              product.image_url ||
              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'
            }
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>

        {isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 badge-minimal bg-rose-950/80 text-rose-300 border-rose-800 backdrop-blur-sm">
            Hết hàng
          </span>
        )}
      </div>

      <div className="mt-3.5 space-y-1.5 flex-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span className="uppercase tracking-wider font-mono">
            {product.category_name || 'Uncategorized'}
          </span>
          <span className="font-mono text-neutral-300 font-medium">{formattedPrice}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="block text-sm font-medium text-neutral-100 group-hover:text-white line-clamp-1 transition"
        >
          {product.name}
        </Link>

        {/* Fashion Sizes & Variant indicators */}
        {product.available_sizes && product.available_sizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {/* <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono mr-0.5">Size:</span>
            {product.available_sizes.slice(0, 5).map((sz) => (
              <span
                key={sz}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-800 border border-neutral-700/60 text-neutral-300"
              >
                {sz}
              </span>
            ))} */}
            {product.available_sizes.length > 5 && (
              <span className="text-[10px] text-neutral-400 font-mono">+{product.available_sizes.length - 5}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className="flex-1 btn-secondary !py-2 text-[11px] flex items-center justify-center gap-1.5"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã thêm</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
              <span>{adding ? 'Đang thêm...' : 'Thêm giỏ'}</span>
            </>
          )}
        </button>

        <Link
          to={`/products/${product.id}`}
          className="p-2 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          title="Xem chi tiết"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

