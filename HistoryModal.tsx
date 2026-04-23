import { motion } from 'motion/react';
import { X, Clock, ExternalLink, Trash2, LogOut } from 'lucide-react';
import type { User } from './auth';
import { COURSES } from './data';

interface Props {
  user: User;
  onClose: () => void;
  onLogout: () => void;
  onOpenCourse: (courseId: string) => void;
}

export default function HistoryModal({ user, onClose, onLogout, onOpenCourse }: Props) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
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
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 shrink-0" />

        {/* Header */}
        <div className="p-6 border-b border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock size={14} />
            <span>Lịch sử khóa học ({user.history.length})</span>
          </div>

          {user.history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Bạn chưa mở khóa học nào.</p>
            </div>
          ) : (
            user.history.map((entry) => {
              const course = COURSES.find(c => c.id === entry.courseId);
              return (
                <motion.div
                  key={`${entry.courseId}-${entry.visitedAt}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { onClose(); onOpenCourse(entry.courseId); }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-transparent hover:border-purple-200 cursor-pointer transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                    <ExternalLink size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm leading-snug group-hover:text-purple-700 truncate">
                      {entry.courseTitle}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(entry.visitedAt)}</p>
                    {course && (
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                        {course.category}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </motion.div>
    </div>
  );
}
