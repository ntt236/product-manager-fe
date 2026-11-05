import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Lock, Mail, User, ArrowUpRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (apiError) setApiError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Vui lòng cung cấp họ và tên.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email không đúng định dạng.';
    if (!form.password || form.password.length < 6)
      next.password = 'Mật khẩu phải tối thiểu 6 ký tự.';
    if (form.password !== form.confirmPassword)
      next.confirmPassword = 'Mật khẩu xác nhận không khớp.';

    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Khởi tạo tài khoản không thành công, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold block">
          Thành viên mới
        </span>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
          Tạo tài khoản
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Đăng ký để lưu địa chỉ giao nhận, theo dõi lịch sử đơn hàng và nhận những ưu đãi dành riêng cho bạn.
        </p>
      </div>

      {apiError && <Alert type="error" message={apiError} />}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="uppercase tracking-wider text-neutral-300 text-[11px] block font-medium">
            Họ và tên
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Nguyễn Văn A"
              className="input-minimal pl-10 text-xs py-3"
              required
            />
          </div>
          {errors.name && (
            <span className="text-[10px] text-rose-400 mt-1 block">{errors.name}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="uppercase tracking-wider text-neutral-300 text-[11px] block font-medium">
            Địa chỉ Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="nhap.email@domain.com"
              className="input-minimal pl-10 text-xs py-3"
              required
            />
          </div>
          {errors.email && (
            <span className="text-[10px] text-rose-400 mt-1 block">{errors.email}</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 text-[11px] block font-medium">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="≥ 6 ký tự"
                className="input-minimal pl-10 text-xs py-3"
                required
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-rose-400 mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 text-[11px] block font-medium">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Xác nhận"
                className="input-minimal pl-10 text-xs py-3"
                required
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] text-rose-400 mt-1 block">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4 group"
        >
          <span>{isSubmitting ? 'Đang khởi tạo...' : 'Hoàn tất đăng ký'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      {/* Switcher */}
      <div className="pt-6 border-t border-neutral-900 flex items-center justify-between text-xs">
        <span className="text-neutral-400">Đã sở hữu tài khoản?</span>
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-semibold text-neutral-200 hover:text-white transition uppercase tracking-wider"
        >
          <span>Đăng nhập ngay</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
