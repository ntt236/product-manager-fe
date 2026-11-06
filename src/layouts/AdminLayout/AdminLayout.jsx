import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Package, ShoppingBag, ExternalLink, LogOut, Sparkles } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
      isActive
        ? 'bg-neutral-800 text-white border border-neutral-700/60'
        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
    }`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-neutral-100 flex items-center justify-center font-bold text-neutral-950 text-sm">
              M
            </div>
            <span className="text-sm font-semibold tracking-tight text-white uppercase">
              Monokro Quản trị
            </span>
            <span className="badge-minimal bg-neutral-800 text-neutral-300 border-neutral-700 text-[10px]">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="btn-secondary !py-1.5 text-xs flex items-center gap-1.5"
          >
            <span>Xem cửa hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="hidden sm:flex flex-col text-right pl-4 border-l border-neutral-800">
            <span className="text-xs font-medium text-neutral-200">{user?.name}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-60 flex-shrink-0 space-y-6 hidden md:block">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              Quản lý danh mục
            </div>
            <NavLink to="/admin/products" className={navItemClass}>
              <Package className="w-4 h-4" />
              <span>Sản phẩm & Danh mục</span>
            </NavLink>
            <NavLink to="/admin/orders" className={navItemClass}>
              <ShoppingBag className="w-4 h-4" />
              <span>Quản lý Đơn hàng</span>
            </NavLink>
          </div>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gợi ý vận hành
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Theo dõi và cập nhật trạng thái đơn hàng thường xuyên để khách hàng nhận được thông báo kịp thời.
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
