import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Trash2, Globe, Lock, Link as LinkIcon,
  Tag, Save, ChevronDown, BookOpen, Pencil, Check,
  Upload, Eye, EyeOff,
} from 'lucide-react';
import {
  getMyUserCourses, addUserCourse, deleteUserCourse,
  toggleUserCoursePublic, updateUserCourse,
  type UserCourse, type User,
} from './auth';

interface Props {
  user: User;
  onClose: () => void;
  onCoursesChanged: () => void;
}

const CATEGORIES = ['Môn học', 'Chứng chỉ', 'Kỹ năng', 'Khác'] as const;
type Category = typeof CATEGORIES[number];

type FormState = {
  title: string;
  link: string;
  tagInput: string;
  tags: string[];
  category: Category;
  description: string;
  isPublic: boolean;
};

const emptyForm = (): FormState => ({
  title: '', link: '', tagInput: '', tags: [], category: 'Môn học', description: '', isPublic: false,
});

export default function MyCoursesModal({ user, onClose, onCoursesChanged }: Props) {
  const [courses, setCourses] = useState<UserCourse[]>(() => getMyUserCourses());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [formError, setFormError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const reload = () => {
    const fresh = getMyUserCourses();
    setCourses(fresh);
    onCoursesChanged();
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (c: UserCourse) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      link: c.link,
      tagInput: '',
      tags: [...c.hashtags],
      category: c.category,
      description: c.description ?? '',
      isPublic: c.isPublic,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleAddTag = () => {
    const t = form.tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setForm(f => ({ ...f, tagInput: '' }));
  };

  const handleSubmit = () => {
    setFormError('');
    if (!form.title.trim()) { setFormError('Vui lòng nhập tên tài liệu.'); return; }
    if (!form.link.trim()) { setFormError('Vui lòng nhập link.'); return; }
    if (form.tags.length === 0) { setFormError('Thêm ít nhất một hashtag.'); return; }

    if (editingId) {
      updateUserCourse(editingId, {
        title: form.title.trim(),
        link: form.link.trim(),
        hashtags: form.tags,
        category: form.category,
        description: form.description.trim() || undefined,
        isPublic: form.isPublic,
      });
      setSavedId(editingId);
    } else {
      const created = addUserCourse({
        title: form.title.trim(),
        link: form.link.trim(),
        hashtags: form.tags,
        category: form.category,
        description: form.description.trim() || undefined,
        isPublic: form.isPublic,
      });
      if (created) setSavedId(created.id);
    }

    reload();
    setShowForm(false);
    setForm(emptyForm());
    setEditingId(null);
    setTimeout(() => setSavedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    deleteUserCourse(id);
    reload();
  };

  const handleToggle = (id: string) => {
    toggleUserCoursePublic(id);
    reload();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shrink-0" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Upload size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Kho Tài Liệu Của Tôi</h2>
              <p className="text-xs text-slate-400">Lưu, chia sẻ và quản lý tài liệu cá nhân</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Saved toast */}
          <AnimatePresence>
            {savedId && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-semibold"
              >
                <Check size={16} /> Đã lưu thành công!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add / Edit form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-6 mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    {editingId ? <Pencil size={14} className="text-teal-500" /> : <Plus size={14} className="text-teal-500" />}
                    {editingId ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
                  </h3>

                  {/* Title */}
                  <Field icon={<BookOpen size={14} />} placeholder="Tên tài liệu / khóa học" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />

                  {/* Link */}
                  <Field icon={<LinkIcon size={14} />} placeholder="Link (https://...)" value={form.link} onChange={v => setForm(f => ({ ...f, link: v }))} type="url" />

                  {/* Description (optional) */}
                  <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-50 transition-all">
                    <span className="text-slate-400 mt-0.5 shrink-0"><Pencil size={14} /></span>
                    <textarea
                      placeholder="Mô tả ngắn (không bắt buộc)"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex gap-2">
                      <Field
                        icon={<Tag size={14} />}
                        placeholder="Hashtag, nhấn Enter"
                        value={form.tagInput}
                        onChange={v => setForm(f => ({ ...f, tagInput: v }))}
                        onEnter={handleAddTag}
                        className="flex-1"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-xl bg-teal-100 text-teal-700 hover:bg-teal-200 text-sm font-semibold transition-colors shrink-0"
                      >
                        + Thêm
                      </button>
                    </div>
                    {form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.tags.map(t => (
                          <span
                            key={t}
                            onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}
                            className="flex items-center gap-1 px-2.5 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors"
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
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50 cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                      form.isPublic
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {form.isPublic ? <Globe size={16} /> : <Lock size={16} />}
                    <div className="flex-1 text-left">
                      <p>{form.isPublic ? 'Công khai — mọi người thấy được' : 'Chỉ mình tôi — riêng tư'}</p>
                      <p className="text-xs font-normal opacity-60 mt-0.5">
                        {form.isPublic ? 'Tài liệu hiển thị trên trang chính cho tất cả người dùng.' : 'Chỉ bạn mới thấy tài liệu này trong kho cá nhân.'}
                      </p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.isPublic ? 'bg-emerald-400' : 'bg-slate-300'}`}>
                      <motion.div
                        layout
                        className="w-5 h-5 bg-white rounded-full shadow"
                        animate={{ x: form.isPublic ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </button>

                  {/* Error */}
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

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setShowForm(false); setEditingId(null); }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={15} /> {editingId ? 'Lưu thay đổi' : 'Thêm tài liệu'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add button */}
          {!showForm && (
            <div className="px-6 pt-5">
              <button
                onClick={openAddForm}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-teal-200 text-teal-600 hover:border-teal-400 hover:bg-teal-50 text-sm font-semibold transition-all"
              >
                <Plus size={16} /> Thêm tài liệu mới
              </button>
            </div>
          )}

          {/* Course list */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={13} /> Tài liệu đã lưu ({courses.length})
            </p>

            {courses.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Upload size={36} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm">Bạn chưa lưu tài liệu nào.</p>
                <p className="text-xs mt-1 opacity-70">Nhấn "Thêm tài liệu mới" để bắt đầu.</p>
              </div>
            ) : (
              courses.map(c => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    c.isPublic
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Visibility badge */}
                    <button
                      onClick={() => handleToggle(c.id)}
                      title={c.isPublic ? 'Đang công khai — nhấn để ẩn' : 'Đang riêng tư — nhấn để công khai'}
                      className={`mt-0.5 shrink-0 p-1.5 rounded-lg transition-all ${
                        c.isPublic
                          ? 'bg-emerald-100 text-emerald-600 hover:bg-red-100 hover:text-red-500'
                          : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                    >
                      {c.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{c.title}</p>
                      {c.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.hashtags.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">#{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {c.isPublic ? '🌐 Công khai' : '🔒 Riêng tư'}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatDate(c.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0">
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-teal-100 text-slate-400 hover:text-teal-600 transition-colors"
                        title="Mở link"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => openEditForm(c)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <p className="text-xs text-slate-400 text-center">
            💡 Nhấn vào icon <Globe size={10} className="inline" /> / <Lock size={10} className="inline" /> để đổi chế độ hiển thị nhanh
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  icon, placeholder, value, onChange, type = 'text', onEnter, className = '',
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onEnter?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-50 transition-all ${className}`}>
      <span className="text-slate-400 shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
}
