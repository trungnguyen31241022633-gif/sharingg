import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ExternalLink, X, BookOpen, GraduationCap, Code,
  Compass, Tag, CheckCircle2, UserCircle2, LogIn, ShieldCheck,
} from 'lucide-react';
import { getAllCourses, type Course } from './data';
import { getCurrentUser, logout, addHistory, refreshUser, isAdmin, type User } from './auth';
import AuthModal from './AuthModal';
import HistoryModal from './HistoryModal';
import AdminPanel from './AdminPanel';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [courses, setCourses] = useState<Course[]>(() => getAllCourses());

  const reloadCourses = useCallback(() => setCourses(getAllCourses()), []);

  // Load user from localStorage on mount
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    COURSES.forEach(c => c.hashtags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.hashtags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = selectedTag ? course.hashtags.includes(selectedTag) : true;
      return matchSearch && matchTag;
    });
  }, [search, selectedTag]);

  const handleOpenCourse = (course: Course) => {
    // Track history
    if (user) {
      addHistory(course.id, course.title);
      setUser(refreshUser());
    }

    if (course.type === 'modal' || course.type === 'form') {
      setSelectedCourse(course);
    } else {
      window.open(course.link, '_blank');
    }
  };

  const handleOpenById = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (course) handleOpenCourse(course);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen dreamy-bg selection:bg-purple-200 flex flex-col">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl"
        />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-slate-800 text-sm">🎓 Học Liệu Tổng Hợp</span>
          <div>
            {user ? (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm transition-colors"
              >
                <UserCircle2 size={18} />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors shadow-sm"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <header className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight"
          >
            Học Liệu<span className="text-purple-600"> Tổng Hợp 🎓</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Tổng hợp tài liệu và lộ trình học tập chất lượng cao dành cho bạn.
          </motion.p>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto group"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm tên khóa học hoặc hashtag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl glass border-white/50 focus:ring-4 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all text-slate-700 placeholder:text-slate-400 shadow-lg shadow-purple-900/5 text-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTag === null
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/50 text-slate-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                Tất cả
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/50 text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </motion.div>
          </div>
        </header>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleOpenCourse(course)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40">
            <div className="bg-white/50 inline-block p-6 rounded-full mb-4">
              <Search size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium italic">Không tìm thấy khóa học nào phù hợp.</p>
          </motion.div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-200/50 glass">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-4">
            &copy; {new Date().getFullYear()} Học Liệu Tổng Hợp. Nền tảng chia sẻ tài liệu học tập cộng đồng.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <span className="hover:text-purple-500 transition-colors cursor-pointer">Về chúng tôi</span>
            <span className="hover:text-purple-500 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-purple-500 transition-colors cursor-pointer">Liên hệ báo lỗi</span>
          </div>
        </div>
      </footer>

      {/* Course detail modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-white"
            >
              <div className="p-8">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-4 text-purple-600 font-semibold uppercase tracking-wider text-xs">
                  <CategoryIcon category={selectedCourse.category} />
                  <span>{selectedCourse.category}</span>
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 pr-8 leading-tight">
                  {selectedCourse.title}
                </h3>

                {selectedCourse.description && (
                  <p className="text-slate-600 mb-6 leading-relaxed">{selectedCourse.description}</p>
                )}

                <div className="space-y-4">
                  {selectedCourse.type === 'modal' && selectedCourse.subLinks && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Compass size={16} /> Danh sách đường dẫn liên quan:
                      </p>
                      {selectedCourse.subLinks.map((sub, i) => (
                        <a
                          key={i}
                          href={sub.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all group shadow-sm"
                        >
                          <span className="text-slate-700 font-medium group-hover:text-purple-700">{sub.label}</span>
                          <ExternalLink size={18} className="text-slate-400 group-hover:text-purple-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      ))}
                    </div>
                  )}

                  {selectedCourse.type === 'form' && (
                    <a
                      href={selectedCourse.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                    >
                      <span>Mở Form Đăng Ký</span>
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth modal */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={u => { setUser(u); setShowAuth(false); }}
          />
        )}
      </AnimatePresence>

      {/* History modal */}
      <AnimatePresence>
        {showHistory && user && (
          <HistoryModal
            user={user}
            onClose={() => setShowHistory(false)}
            onLogout={handleLogout}
            onOpenCourse={handleOpenById}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="glass-card group h-full flex flex-col cursor-pointer rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-pink-100 text-pink-600">
          <CategoryIcon category={course.category} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-pink-500">{course.category}</span>
      </div>

      <h3 className="text-xl font-display font-semibold text-slate-800 mb-4 leading-tight group-hover:text-purple-600 transition-colors">
        {course.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
        {course.hashtags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-500 transition-colors text-xs font-semibold uppercase tracking-wider">
          {course.type === 'external' ? (
            <><ExternalLink size={14} /><span>Link Drive</span></>
          ) : course.type === 'modal' ? (
            <><BookOpen size={14} /><span>Xem chi tiết</span></>
          ) : (
            <><CheckCircle2 size={14} /><span>Đăng ký Form</span></>
          )}
        </div>
        <motion.div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
          <Compass size={16} />
        </motion.div>
      </div>

      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
    </motion.div>
  );
}

function CategoryIcon({ category }: { category: Course['category'] }) {
  switch (category) {
    case 'Môn học': return <BookOpen size={16} />;
    case 'Chứng chỉ': return <GraduationCap size={16} />;
    case 'Kỹ năng': return <Code size={16} />;
    default: return <Tag size={16} />;
  }
}
