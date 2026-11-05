import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Editorial Branding Section (Left) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-neutral-800/80 bg-neutral-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1c20_1px,transparent_1px),linear-gradient(to_bottom,#1c1c20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_70%_at_40%_40%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center font-bold text-neutral-950 text-base transition group-hover:scale-95">
              M
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white uppercase block leading-none">
                Monokro
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 block mt-1 uppercase">
                Phong cách sống tối giản
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Middle Editorial Statement */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/80 text-[11px] text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            BỘ SƯU TẬP CAO CẤP 2026
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.08]">
            Hình khối chuẩn mực.
            <br />
            <span className="text-neutral-400">Trải nghiệm thuần khiết.</span>
          </h2>

          <p className="text-neutral-400 text-sm leading-relaxed font-light">
            Monokro loại bỏ những chi tiết rườm rà để tập trung vào chất lượng thủ công, sự tinh tế và tính tiện dụng tối ưu trong từng sản phẩm bạn mặc mỗi ngày.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-900 text-xs text-neutral-400">
            <div className="space-y-1">
              <span className="text-neutral-200 font-semibold block uppercase text-[11px]">Chất liệu cao cấp</span>
              <p className="text-[11px] text-neutral-400">100% sợi tự nhiên tuyển chọn, bền đẹp qua thời gian.</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-200 font-semibold block uppercase text-[11px]">Đặc quyền thành viên</span>
              <p className="text-[11px] text-neutral-400">Miễn phí giao hàng và đổi trả linh hoạt trong 30 ngày.</p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-900 pt-6">
          <span>MONOKRO STUDIO</span>
          <span>THIẾT KẾ ĐƠN GIẢN • ĐẲNG CẤP VƯỢT THỜI GIAN</span>
        </div>
      </div>

      {/* Auth Form Area */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen bg-neutral-950 relative z-10">
        <div className="lg:hidden flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-neutral-100 flex items-center justify-center font-bold text-neutral-950 text-sm">
              M
            </div>
            <span className="text-sm font-semibold tracking-tight text-white uppercase">
              Monokro
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        <div className="my-auto w-full max-w-md mx-auto">
          <Outlet />
        </div>

        <div className="text-center text-[11px] text-neutral-400 pt-8">
          Cam kết bảo mật thông tin khách hàng tuyệt đối.
        </div>
      </div>
    </div>
  );
}
