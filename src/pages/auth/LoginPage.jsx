import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Lock, Mail, ArrowUpRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
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
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email không hợp lệ.';
    if (!form.password) next.password = 'Vui lòng nhập mật khẩu.';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      const loggedUser = await login(form.email, form.password);

      const userRole = String(loggedUser.role || loggedUser.role_name || '').toLowerCase();
      const fromPath = location.state?.from?.pathname;

      if (['admin', 'manager'].includes(userRole)) {
        navigate('/admin', { replace: true });
      } else {
        const targetPath = fromPath && !fromPath.startsWith('/admin') ? fromPath : '/';
        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      setApiError(err.message || 'Đăng nhập không thành công, vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold block">
          Chào mừng trở lại
        </span>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
          Đăng nhập
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Đăng nhập vào tài khoản của bạn để tiếp tục trải nghiệm mua sắm và theo dõi đơn hàng.
        </p>
      </div>

      {apiError && <Alert type="error" message={apiError} />}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="uppercase tracking-wider text-neutral-300 text-[11px] font-medium">
              Địa chỉ Email
            </label>
          </div>
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
            <span className="text-[10px] text-rose-400 mt-1 block">
              {errors.email}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="uppercase tracking-wider text-neutral-300 text-[11px] font-medium">
              Mật khẩu
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••••••"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 group"
        >
          <span>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      {/* Switcher */}
      <div className="pt-6 border-t border-neutral-900 flex items-center justify-between text-xs">
        <span className="text-neutral-400">Bạn chưa có tài khoản?</span>
        <Link
          to="/register"
          className="inline-flex items-center gap-1 font-semibold text-neutral-200 hover:text-white transition uppercase tracking-wider"
        >
          <span>Đăng ký thành viên</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
