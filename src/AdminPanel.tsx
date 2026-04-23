import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Trash2, Users, BookOpen, Tag, Link2,
  ChevronDown, ShieldCheck, Clock, Hash,
} from 'lucide-react';
import {
  getAllUsers, addCustomCourse, deleteCustomCourse, getCustomCourses,
  type User, type CustomCourse,
} from './auth';

interface Props {
  onClose: () => void;
  onCoursesChanged: () => void;
}

type Tab = 'courses' | 'accounts';

const CATEGORIES = ['Môn học', 'Chứng chỉ', 'Kỹ năng', 'Khác'] as const;

export default function AdminPanel({ onClose, onCoursesChanged }: Props) {
  const [tab, setTab] = useState<Tab>('courses');
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Add course form state
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Môn học');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    setCustomCourses(getCustomCourses());
    setUsers(getAllUsers());
  }, []);

  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !hashtags.includes(t)) setHashtags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleAddCourse = () => {
    setAddError('');
    if (!title.trim()) { setAddError('Vui lòng nhập tên khóa học.'); return; }
    if (!link.trim()) { setAddError('Vui lòng nhập link.'); return; }
    if (hashtags.length === 0) { setAddError('Thêm ít nhất 1 hashtag.'); return; }
    try { new URL(link); } catch { setAddError('Link không hợp lệ (phải bắt đầu bằng https://).'); return; }

    addCustomCourse({ title: title.trim(), link: link.trim(), hashtags, category });
    setCustomCourses(getCustomCourses());
    onCoursesChanged();

    // Reset form
    setTitle(''); setLink(''); setHashtags([]); setTagInput(''); setCategory('Môn học');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2500);
  };

  const handleDelete = (id: string) => {
    deleteCustomCourse(id);
    setCustomCourses(getCustomCourses());
    onCoursesChanged();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 shrink-0" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg leading-tight">Admin Panel</h2>
              <p className="text-xs text-slate-400">Quản lý khóa học & tài khoản</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 shrink-0 px-6">
          {([['courses', BookOpen, 'Khóa học'], ['accounts', Users, 'Tài khoản']] as const).map(
            ([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  tab === key
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="p-6 space-y-6"
              >
                {/* Add course form */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
                  <p className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Plus size={16} className="text-rose-500" /> Thêm khóa học mới
                  </p>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Tên khóa học *</label>
                    <input
                      type="text"
                      placeholder="VD: Môn Quản trị học"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                    />
                  </div>

                  {/* Link */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Link2 size={12} /> Link Drive / URL *</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Danh mục *</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value as typeof CATEGORIES[number])}
                        className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all pr-8"
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><Hash size={12} /> Hashtag *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="VD: QTRI (không cần #)"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag(); } }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 transition-all"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hashtags.map(t => (
                          <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
                            #{t}
                            <button onClick={() => setHashtags(prev => prev.filter(x => x !== t))} className="hover:text-rose-900">
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {addError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">
                        {addError}
                      </motion.p>
                    )}
                    {addSuccess && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-xl font-medium">
                        ✅ Đã thêm khóa học thành công!
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleAddCourse}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-rose-200"
                  >
                    ➕ Thêm khóa học
                  </button>
                </div>

                {/* Custom courses list */}
                {customCourses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Khóa học đã thêm ({customCourses.length})
                    </p>
                    {customCourses.map(c => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{c.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{c.link}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">{c.category}</span>
                            {c.hashtags.map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">#{t}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {customCourses.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">Chưa có khóa học nào được thêm thủ công.</p>
                )}
              </motion.div>
            )}

            {tab === 'accounts' && (
              <motion.div
                key="accounts"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="p-6 space-y-3"
              >
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tất cả tài khoản ({users.length})
                </p>
                {users.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-8">Chưa có tài khoản nào được đăng ký.</p>
                )}
                {users.map(u => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                        u.id === 'admin_root'
                          ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                          : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
                          {u.id === 'admin_root' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold shrink-0">ADMIN</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pl-12">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Tạo: {formatDate(u.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={11} /> {u.history.length} khóa đã xem
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
