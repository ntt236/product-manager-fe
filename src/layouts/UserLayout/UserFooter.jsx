import { Link } from 'react-router-dom';

export default function UserFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center font-bold text-neutral-950 text-xs">
                M
              </div>
              <span className="text-sm font-semibold tracking-tight text-neutral-100 uppercase">
                Monokro
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Thiết kế tối giản, chất liệu cao cấp. Tôn vinh phong cách sống tinh tế và sự chuẩn mực trong từng đường may.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Bộ sưu tập
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-neutral-200 transition">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/men" className="hover:text-neutral-200 transition">
                  Bộ sưu tập Nam
                </Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-neutral-200 transition">
                  Bộ sưu tập Nữ
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="hover:text-neutral-200 transition">
                  Phụ kiện tối giản
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Chăm sóc khách hàng
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="hover:text-neutral-200 transition">
                  Kiểm tra đơn hàng
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-neutral-200 transition">
                  Sổ địa chỉ nhận hàng
                </Link>
              </li>
              <li>
                <span className="text-neutral-400">Chính sách đổi trả trong 30 ngày</span>
              </li>
              <li>
                <span className="text-neutral-400">Hướng dẫn chọn kích cỡ (Size guide)</span>
              </li>
            </ul>
          </div>

          {/* Store & Philosophy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-3">
              Về Monokro
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Chúng tôi theo đuổi triết lý thiết kế tối giản, tập trung vào form dáng vượt thời gian và sự thoải mái tối đa cho người mặc.
            </p>
            <div className="mt-3 text-neutral-400 text-[11px]">
              Giao hàng hỏa tốc • Hỗ trợ 24/7
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Monokro Studio. All rights reserved.</p>
          <p className="text-neutral-400">Đơn giản • Tinh tế • Bền vững</p>
        </div>
      </div>
    </footer>
  );
}
