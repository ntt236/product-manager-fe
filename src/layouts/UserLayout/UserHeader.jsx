import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  ShoppingBag,
  LogOut,
  Package,
  Menu,
  X,
  MapPin,
  ShieldCheck,
  Search,
  User,
  ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Bộ sưu tập', to: '/products' },
  { label: 'Nam', to: '/men' },
  { label: 'Nữ', to: '/women' },
  { label: 'Giày & Túi', to: '/shoes' },
  { label: 'Phụ kiện', to: '/accessories' },
];

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, isAdmin, isManager, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Staff Bar for Admin / Manager */}
      {(isAdmin || isManager) && (
        <aside className="bg-neutral-950 border-b border-neutral-800 text-neutral-300 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-minimal bg-neutral-800 text-neutral-300 border-neutral-700">
                Staff Mode
              </span>
              <span className="text-neutral-400 hidden sm:inline text-xs">
                Đang truy cập với quyền {isAdmin ? 'Quản trị viên' : 'Quản lý'}
              </span>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white uppercase tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảng quản trị &rarr;
            </Link>
          </div>
        </aside>
      )}

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center font-bold text-neutral-950 text-base tracking-tighter transition group-hover:scale-95">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-widest text-white uppercase leading-none">
                  Monokro
                </span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1 font-mono">
                  Contemporary Fashion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.16em] font-medium transition py-1 relative whitespace-nowrap ${
                      isActive
                        ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-100'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Button */}
            <Link
              to="/products"
              className="p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
              title="Tìm kiếm sản phẩm"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Account / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-700 transition text-neutral-200 text-xs font-medium"
                >
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="max-w-[110px] truncate hidden sm:inline-block">
                    {user?.name || 'Tài khoản'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Popover */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-2 z-50 text-neutral-200 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-neutral-800">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'manager' ? 'Quản lý' : 'Thành viên'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
                      >
                        <Package className="w-4 h-4 text-neutral-400" />
                        <span>Đơn hàng của tôi</span>
                      </Link>

                      <Link
                        to="/addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
                      >
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <span>Sổ địa chỉ</span>
                      </Link>

                      {(isAdmin || isManager) && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-neutral-800/60 transition font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Bảng quản trị</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-neutral-800 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-neutral-800/60 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-900 transition whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary text-xs !py-1.5 !px-3 whitespace-nowrap">
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Shopping Bag Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-900 transition flex items-center gap-2 border border-neutral-800"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-neutral-100 text-neutral-950 font-mono text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest font-medium text-neutral-300 hover:text-white py-1.5"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs text-neutral-300 hover:text-white py-2"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Giỏ hàng
                </span>
                {totalItems > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-950 font-mono text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white py-2"
                  >
                    <Package className="w-4 h-4" />
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white py-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Sổ địa chỉ
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất ({user?.name})
                  </button>
                </>
              ) : (
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300 border border-neutral-800 rounded-lg"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold uppercase tracking-wider bg-white text-neutral-950 rounded-lg"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
