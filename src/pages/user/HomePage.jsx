import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw, ShoppingBag, ArrowUpRight } from 'lucide-react';
import productService from '../../services/productService';
import { useCart } from '../../contexts/CartContext';

const EDITORIAL_CATEGORIES = [
  {
    title: 'Bộ sưu tập Nam',
    subtitle: 'Tailored Minimalist & Essentials',
    link: '/men',
    img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bộ sưu tập Nữ',
    subtitle: 'Contemporary Silhouettes',
    link: '/women',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Giày dép & Túi xách',
    subtitle: 'Crafted Leather & Footwear',
    link: '/shoes',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Phụ kiện tối giản',
    subtitle: 'Refined Details',
    link: '/accessories',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await productService.getAll({ limit: 4 });
        if (res && res.data) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleQuickAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingId(product.id);
      await addToCart(product.id, 1);
    } catch (err) {
      alert(err.message || 'Không thể thêm sản phẩm');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-20 py-6 font-sans">
      {/* 1. Hero Section: Contemporary Editorial Fashion */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl border border-neutral-800/80 bg-neutral-950 p-8 sm:p-14 md:p-20 overflow-hidden min-h-[540px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1c20_1px,transparent_1px),linear-gradient(to_bottom,#1c1c20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)] opacity-35 pointer-events-none" />

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/80 text-xs font-mono uppercase tracking-widest text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              Campaign 2026 • Contemporary Editorial
            </div>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono hidden sm:inline">
              Unisex Fashion Line
            </span>
          </div>

          {/* Main Statement */}
          <div className="relative z-10 my-10 max-w-3xl space-y-5">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.04]">
              Bản sắc tối giản.
              <br />
              <span className="text-neutral-400">Thời trang phi giới tính.</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Định hình phong cách sống hiện đại qua những đường cắt chuẩn mực, vật liệu cao cấp và sự cân bằng hoàn hảo giữa thẩm mỹ tối giản và công năng ứng dụng.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="relative z-10 flex flex-wrap gap-4 pt-2">
            <Link to="/products" className="btn-primary py-3.5 px-6">
              Khám phá toàn bộ bộ sưu tập <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/men" className="btn-secondary py-3.5 px-5">
              Thời trang Nam
            </Link>
            <Link to="/women" className="btn-secondary py-3.5 px-5">
              Thời trang Nữ
            </Link>
            <Link to="/shoes" className="btn-secondary py-3.5 px-5">
              Giày & Phụ kiện
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Editorial Category Grid (Contemporary Lookbook) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Danh mục tuyển chọn
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-1">
              Phân nhóm bộ sưu tập
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white flex items-center gap-1.5 transition font-mono"
          >
            Tất cả danh mục <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDITORIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 flex flex-col justify-end p-6"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  {cat.subtitle}
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-neutral-200 transition flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Thiết kế nổi bật
            </span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mt-1">
              Sản phẩm đáng chú ý trong mùa
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white flex items-center gap-1.5 transition font-mono"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-neutral-800 rounded-xl" />
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950 p-3.5 hover:border-neutral-700 transition duration-300"
              >
                <Link to={`/products/${p.id}`} className="block relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-wider text-neutral-600">
                      Chưa có hình
                    </div>
                  )}
                  {p.stock_quantity <= 0 && (
                    <span className="absolute top-2.5 left-2.5 badge-minimal bg-rose-950/80 text-rose-300 border-rose-800">
                      Hết hàng
                    </span>
                  )}
                </Link>

                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span className="uppercase">{p.category_name || 'Thời trang'}</span>
                    <span className="text-neutral-200 font-semibold">
                      {Number(p.price).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <Link
                    to={`/products/${p.id}`}
                    className="block font-medium text-sm text-neutral-200 group-hover:text-white truncate transition"
                  >
                    {p.name}
                  </Link>
                </div>

                <button
                  onClick={(e) => handleQuickAdd(e, p)}
                  disabled={p.stock_quantity <= 0 || addingId === p.id}
                  className="mt-3.5 w-full btn-secondary !py-2.5 text-[11px] flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {addingId === p.id ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Brand Standards / Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 space-y-3">
            <Truck className="w-6 h-6 text-neutral-300 stroke-[1.5]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-100">
              Giao hàng hỏa tốc toàn quốc
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Đóng gói bảo mật theo tiêu chuẩn cao cấp, bảo đảm sản phẩm đến tay khách hàng nguyên vẹn và chuẩn phom dáng trong 24-48 giờ.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 space-y-3">
            <Shield className="w-6 h-6 text-neutral-300 stroke-[1.5]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-100">
              Vật liệu tự nhiên bền vững
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Tuyển chọn các dòng vải cotton, linen, da thuộc cao cấp. Đường kim mũi chỉ đạt tiêu chuẩn may đo xuất khẩu.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 space-y-3">
            <RefreshCw className="w-6 h-6 text-neutral-300 stroke-[1.5]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-100">
              Đổi trả thuận tiện 30 ngày
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Hỗ trợ đổi kích cỡ hoặc hoàn trả nhanh chóng nếu sản phẩm chưa vừa ý, mang lại sự an tâm tuyệt đối khi mua sắm online.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
