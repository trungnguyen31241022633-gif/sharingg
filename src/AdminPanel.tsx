import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Trash2, Users, BookOpen, ShieldCheck,
  Link as LinkIcon, Tag, Save, ChevronDown,
} from 'lucide-react';
import {
  getAllUsers, addCustomCourse, deleteCustomCourse, getCustomCourses,
  type User, type CustomCourse,
} from './auth';

interface Props {
  onClose: () => void;
  onCoursesChanged: () => void;
}

type Tab = 'courses' | 'users';

const CATEGORIES = ['Môn học', 'Chứng chỉ', 'Kỹ năng', 'Khác'] as const;
type Category = typeof CATEGORIES[number];

export default function AdminPanel({ onClose, onCoursesChanged }: Props) {
  const [tab, setTab] = useState<Tab>('courses');
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>(() => getCustomCourses());
  const [users] = useState<User[]>(() => getAllUsers());

  // Form state
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>('Môn học');
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleSubmit = () => {
    setFormError('');
    if (!title.trim()) { setFormError('Vui lòng nhập tên khóa học.'); return; }
    if (!link.trim()) { setFormError('Vui lòng nhập link.'); return; }
    if (tags.length === 0) { setFormError('Vui lòng thêm ít nhất một hashtag.'); return; }

    addCustomCourse({ title: title.trim(), link: link.trim(), hashtags: tags, category });
    setCustomCourses(getCustomCourses());
    onCoursesChanged();
    setTitle(''); setLink(''); setTags([]); setTagInput(''); setCategory('Môn học');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 shrink-0" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
              <p className="text-xs text-slate-400">Quản lý nội dung & tài khoản</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 w-fit">
            {([['courses', '📚 Khóa học'], ['users', '👤 Tài khoản']] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === t ? 'bg-white shadow-sm text-violet-700' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'courses' && (
            <div className="p-6 space-y-8">
              {/* Add form */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-violet-500" /> Thêm khóa học mới
                </h3>
                <div className="space-y-3">
                  {/* Title */}
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-50">
                    <BookOpen size={15} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Tên khóa học"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-50">
                    <LinkIcon size={15} className="text-slate-400 shrink-0" />
                    <input
                      type="url"
                      placeholder="Link (https://...)"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Hashtags */}
                  <div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-50">
                        <Tag size={15} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Thêm hashtag rồi nhấn Enter"
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                          className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors text-sm font-semibold"
                      >
                        + Thêm
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tags.map(t => (
                          <span
                            key={t}
                            className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors"
                            onClick={() => setTags(prev => prev.filter(x => x !== t))}
                            title="Click để xóa"
                          >
                            #{t} ×
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as Category)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-50 cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  <AnimatePresence>
                    {formError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg"
                      >
                        {formError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-200 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {saved ? <><span>✅</span> Đã lưu!</> : <><Save size={16} /> Thêm khóa học</>}
                  </button>
                </div>
              </div>

              {/* Custom course list */}
              <div>
                <h3 className="font-semibold text-slate-600 text-sm mb-3 flex items-center gap-2">
                  <BookOpen size={14} /> Khóa học đã thêm ({customCourses.length})
                </h3>
                {customCourses.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6 bg-slate-50 rounded-2xl">
                    Chưa có khóa học tùy chỉnh nào.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customCourses.map(c => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-violet-200 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{c.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.hashtags.map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-600">#{t}</span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 truncate">{c.link}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="p-6">
              <h3 className="font-semibold text-slate-600 text-sm mb-4 flex items-center gap-2">
                <Users size={14} /> Danh sách tài khoản ({users.length})
              </h3>
              {users.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8 bg-slate-50 rounded-2xl">
                  Chưa có tài khoản nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {users.map(u => (
                    <div
                      key={u.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-violet-200 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm truncate">{u.name}</p>
                          {u.email.toLowerCase().includes('admin') || u.id === 'admin_root' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold shrink-0">Admin</span>
                          ) : null}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Đăng ký: {formatDate(u.createdAt)} · {u.history.length} lịch sử
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
