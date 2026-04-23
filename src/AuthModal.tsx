import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { login, register, type User } from './auth';

interface Props {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return; }
    if (mode === 'register' && !name) { setError('Vui lòng nhập tên của bạn.'); return; }
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300)); // small delay for UX

    const result = mode === 'login'
      ? login(email, password)
      : register(name, email, password);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
    } else {
      onSuccess(result.user);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400" />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={18} />
          </button>

          {/* Mode toggle */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-white shadow-sm text-purple-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? '🔑 Đăng nhập' : '✨ Tạo tài khoản'}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'login'
                ? 'Đăng nhập để xem lịch sử khóa học của bạn.'
                : 'Lưu lại lịch sử và tiến trình học tập của bạn.'}
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <InputField
                    icon={<UserIcon size={16} />}
                    placeholder="Tên của bạn"
                    value={name}
                    onChange={setName}
                    type="text"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField
              icon={<Mail size={16} />}
              placeholder="Email"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <div className="relative">
              <InputField
                icon={<Lock size={16} />}
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                value={password}
                onChange={setPassword}
                type={showPwd ? 'text' : 'password'}
                onEnter={handleSubmit}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-200 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <><LogIn size={18} /> Đăng nhập</>
              ) : (
                <><UserPlus size={18} /> Tạo tài khoản</>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              Không bắt buộc — bạn vẫn có thể xem khóa học mà không cần đăng nhập.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({
  icon, placeholder, value, onChange, type, onEnter,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  onEnter?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-50 transition-all">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
      />
    </div>
  );
}
