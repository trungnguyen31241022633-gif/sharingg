import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import {
  Search, ExternalLink, X, BookOpen, GraduationCap, Code,
  Compass, Tag, CheckCircle2, UserCircle2, LogIn, ShieldCheck,
  Upload, Globe, ChevronRight, ChevronLeft, SkipForward,
  HelpCircle, Sparkles,
} from 'lucide-react';
import { getAllCourses, type Course } from './data';
import {
  getCurrentUser, logout, addHistory, refreshUser,
  isAdmin, getPublicUserCourses, type User, type UserCourse,
} from './auth';
import AuthModal from './AuthModal';
import HistoryModal from './HistoryModal';
import AdminPanel from './AdminPanel';
import MyCoursesModal from './MyCoursesModal';

function userCourseToCourse(uc: UserCourse): Course {
  return {
    id: uc.id,
    title: uc.title,
    hashtags: uc.hashtags,
    link: uc.link,
    type: 'external',
    category: uc.category,
    description: uc.description ?? `Chia sẻ bởi ${uc.ownerName}`,
  };
}

// ── Typing text hook ──────────────────────────────────────────────────────────
function useTypingText(messages: string[], speed = 50, pauseMs = 2200) {
  const [display, setDisplay] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const msg = messages[msgIdx];
    if (!erasing) {
      if (charIdx < msg.length) {
        const t = setTimeout(() => setCharIdx(i => i + 1), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setErasing(true), pauseMs);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
        return () => clearTimeout(t);
      } else {
        setErasing(false);
        setMsgIdx(i => (i + 1) % messages.length);
      }
    }
  }, [charIdx, erasing, msgIdx, messages, speed, pauseMs]);

  useEffect(() => {
    setDisplay(messages[msgIdx].slice(0, charIdx));
  }, [charIdx, msgIdx, messages]);

  return display;
}

// ── Tutorial steps ────────────────────────────────────────────────────────────
const TUTORIAL_STEPS = [
  {
    title: 'Chào mừng đến S-Space! 🎓',
    body: 'Đây là nền tảng tổng hợp tài liệu & khóa học học tập cho sinh viên. Mình sẽ dẫn bạn tham quan nhanh nhé!',
    highlight: null as string | null,
    anchor: 'hero',
  },
  {
    title: 'Tìm kiếm khóa học',
    body: 'Dùng thanh tìm kiếm để tìm nhanh theo tên môn học hoặc hashtag — ví dụ: "MOS", "NLKT", "startup"...',
    highlight: 'search-bar',
    anchor: 'search-bar',
  },
  {
    title: 'Lọc theo hashtag',
    body: 'Nhấn vào bất kỳ hashtag nào để lọc khóa học theo chủ đề. Nhấn "Tất cả" để quay lại xem toàn bộ.',
    highlight: 'tag-bar',
    anchor: 'tag-bar',
  },
  {
    title: 'Thẻ khóa học',
    body: 'Mỗi thẻ là một tài liệu hoặc khóa học. Nhấn vào để mở link Drive, xem chi tiết, hoặc điền form đăng ký.',
    highlight: 'course-grid',
    anchor: 'course-grid',
  },
  {
    title: 'Đăng nhập & Lưu lịch sử',
    body: 'Đăng nhập để lưu lịch sử xem, và dùng "Kho của tôi" để thêm tài liệu riêng và chia sẻ cộng đồng.',
    highlight: 'nav-auth',
    anchor: 'nav-auth',
  },
];

// ── Tutorial Overlay ──────────────────────────────────────────────────────────
function TutorialOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (current.anchor) scrollToAnchor(current.anchor);
  }, [step, current.anchor]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      />

      {/* Floating card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 w-[min(92vw,420px)]"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Gradient bar */}
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-400" />

            <div className="p-6">
              {/* Progress dots */}
              <div className="flex gap-1.5 mb-4">
                {TUTORIAL_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ width: i === step ? 24 : 6, opacity: i <= step ? 1 : 0.3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="h-1.5 rounded-full bg-violet-500"
                  />
                ))}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-2">{current.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{current.body}</p>

              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors"
                >
                  <SkipForward size={13} /> Bỏ qua
                </button>

                <div className="flex gap-2">
                  {step > 0 && (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
                    >
                      <ChevronLeft size={15} /> Trước
                    </button>
                  )}
                  <button
                    onClick={() => isLast ? onClose() : setStep(s => s + 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-violet-200 hover:opacity-90 transition-all"
                  >
                    {isLast ? 'Bắt đầu 🚀' : <>Tiếp <ChevronRight size={15} /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Mascot character ──────────────────────────────────────────────────────────
function Mascot({ greeting }: { greeting: string }) {
  const [blink, setBlink] = useState(false);
  const [wave, setWave] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 1000);
    }, 5000);
    setWave(true);
    setTimeout(() => setWave(false), 1000);
    return () => clearInterval(waveInterval);
  }, []);

  return (
    <div className="fixed bottom-6 left-4 z-30 flex flex-col items-start gap-2 pointer-events-none select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {greeting && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl rounded-bl-sm shadow-lg border border-purple-100 px-4 py-2.5 max-w-[200px]"
          >
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              {greeting}
              <span className="inline-block w-0.5 h-3.5 bg-violet-500 ml-0.5 animate-pulse align-middle" />
            </p>
            {/* Tail */}
            <div className="absolute -bottom-2 left-5 w-3 h-3 bg-white border-r border-b border-purple-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character SVG */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16"
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="32" cy="40" rx="18" ry="16" fill="#F97316" />
          {/* Head */}
          <circle cx="32" cy="22" r="16" fill="#FB923C" />
          {/* Cheeks */}
          <ellipse cx="22" cy="26" rx="4" ry="3" fill="#FCA5A5" opacity="0.6" />
          <ellipse cx="42" cy="26" rx="4" ry="3" fill="#FCA5A5" opacity="0.6" />
          {/* Eyes */}
          {blink ? (
            <>
              <rect x="24" y="20" width="8" height="2" rx="1" fill="#1E293B" />
              <rect x="36" y="20" width="8" height="2" rx="1" fill="#1E293B" />
            </>
          ) : (
            <>
              <circle cx="28" cy="21" r="3.5" fill="white" />
              <circle cx="28" cy="21" r="2" fill="#1E293B" />
              <circle cx="38" cy="21" r="3.5" fill="white" />
              <circle cx="38" cy="21" r="2" fill="#1E293B" />
              <circle cx="29" cy="20" r="0.8" fill="white" />
              <circle cx="39" cy="20" r="0.8" fill="white" />
            </>
          )}
          {/* Smile */}
          <path d="M26 29 Q32 35 38 29" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Wave arm */}
          <motion.g
            animate={wave ? { rotate: [0, -30, 20, -30, 0] } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{ transformOrigin: '50px 36px' }}
          >
            <ellipse cx="52" cy="36" rx="6" ry="4" fill="#FB923C" transform="rotate(-20 52 36)" />
          </motion.g>
          {/* Other arm */}
          <ellipse cx="12" cy="38" rx="6" ry="4" fill="#FB923C" transform="rotate(20 12 38)" />
          {/* Feet */}
          <ellipse cx="26" cy="54" rx="5" ry="3" fill="#EA580C" />
          <ellipse cx="38" cy="54" rx="5" ry="3" fill="#EA580C" />
          {/* Cap */}
          <rect x="16" y="8" width="32" height="5" rx="2" fill="#7C3AED" />
          <rect x="24" y="3" width="16" height="7" rx="2" fill="#7C3AED" />
          <rect x="44" y="10" width="8" height="2" rx="1" fill="#A78BFA" />
          <circle cx="48" cy="9" r="2" fill="#A78BFA" />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Animated gradient background ─────────────────────────────────────────────
function AnimatedBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/30" />
      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 40, 80, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)' }}
      />
      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)' }}
      />
      {/* Blob 3 */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
      />
      {/* Blob 4 */}
      <motion.div
        animate={{
          x: [0, -70, 40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
        className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)' }}
      />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMyCourses, setShowMyCourses] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourseIds, setUserCourseIds] = useState<Set<string>>(new Set());

  const greetingMessages = [
    'Xin chào! Hôm nay bạn muốn học gì? 😊',
    'S-Space — học cùng nhau nào! 📚',
    'Khám phá tài liệu mới ngay nào~',
    'Cố lên! Bạn làm được mà! ✨',
  ];
  const greeting = useTypingText(greetingMessages, 55, 2500);

  const reloadCourses = useCallback(() => {
    const base = getAllCourses();
    const shared = getPublicUserCourses();
    setUserCourseIds(new Set(shared.map(c => c.id)));
    const sharedAsCourses = shared.map(userCourseToCourse);
    const ids = new Set(base.map(c => c.id));
    const merged = [...base, ...sharedAsCourses.filter(c => !ids.has(c.id))];
    setCourses(merged);
  }, []);

  useEffect(() => {
    setUser(getCurrentUser());
    reloadCourses();
  }, [reloadCourses]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    courses.forEach(c => c.hashtags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.hashtags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchTag = selectedTag ? course.hashtags.includes(selectedTag) : true;
      return matchSearch && matchTag;
    });
  }, [courses, search, selectedTag]);

  const handleOpenCourse = (course: Course) => {
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
    const course = courses.find(c => c.id === courseId);
    if (course) handleOpenCourse(course);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowHistory(false);
    reloadCourses();
  };

  return (
    <div className="min-h-screen selection:bg-purple-200 flex flex-col">
      <AnimatedBg />

      {/* Mascot */}
      <Mascot greeting={greeting} />

      {/* Navbar */}
      <nav id="nav-auth" className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={20} className="text-violet-600" />
            </motion.div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              S-Space
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tutorial button */}
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-sm transition-colors border border-amber-200"
            >
              <HelpCircle size={15} />
              <span className="hidden sm:inline">Hướng dẫn sử dụng</span>
            </button>

            {user && isAdmin(user) && (
              <button
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <ShieldCheck size={15} />
                Admin
              </button>
            )}
            {user && (
              <button
                onClick={() => setShowMyCourses(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-sm transition-colors"
              >
                <Upload size={15} />
                <span className="hidden sm:inline">Kho của tôi</span>
              </button>
            )}
            {user ? (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-sm transition-colors"
              >
                <UserCircle2 size={18} />
                <span className="max-w-[100px] truncate hidden sm:inline">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-sm shadow-violet-300/50"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <header id="hero" className="mb-12 text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight"
          >
            <span className="text-slate-900">S</span>
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              -Space
            </span>
            <motion.span
              animate={{ rotate: [0, 15, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              className="inline-block ml-3"
            >
              🎓
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Tổng hợp tài liệu và lộ trình học tập chất lượng cao dành cho bạn.
          </motion.p>

          <div className="space-y-5">
            {/* Search */}
            <motion.div
              id="search-bar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto group"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm tên khóa học hoặc hashtag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 focus:ring-4 focus:ring-violet-100 focus:border-violet-300 outline-none transition-all text-slate-700 placeholder:text-slate-400 shadow-lg shadow-purple-900/5 text-base"
              />
            </motion.div>

            {/* Tag bar */}
            <motion.div
              id="tag-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  selectedTag === null
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-200'
                    : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow-sm border border-white/50'
                }`}
              >
                Tất cả
              </button>
              {allTags.map(tag => (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-200'
                      : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow-sm border border-white/50'
                  }`}
                >
                  #{tag}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </header>

        {/* Course grid */}
        <div id="course-grid">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isUserShared={userCourseIds.has(course.id)}
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
        </div>
      </main>

      <footer className="py-10 border-t border-slate-200/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-display font-bold text-lg bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent mb-2">
            S-Space
          </p>
          <p className="text-slate-500 text-sm mb-4">
            &copy; {new Date().getFullYear()} S-Space. Nền tảng chia sẻ tài liệu học tập cộng đồng.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
            <span className="hover:text-violet-500 transition-colors cursor-pointer">Về chúng tôi</span>
            <span className="hover:text-violet-500 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-violet-500 transition-colors cursor-pointer">Liên hệ báo lỗi</span>
          </div>
        </div>
      </footer>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>

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
              <div className="h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
              <div className="p-8">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-4 text-violet-600 font-semibold uppercase tracking-wider text-xs">
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
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group shadow-sm"
                        >
                          <span className="text-slate-700 font-medium group-hover:text-violet-700">{sub.label}</span>
                          <ExternalLink size={18} className="text-slate-400 group-hover:text-violet-500" />
                        </a>
                      ))}
                    </div>
                  )}
                  {selectedCourse.type === 'form' && (
                    <a
                      href={selectedCourse.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-600/20"
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
            onSuccess={u => { setUser(u); setShowAuth(false); reloadCourses(); }}
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

      {/* Admin panel */}
      <AnimatePresence>
        {showAdmin && user && isAdmin(user) && (
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            onCoursesChanged={reloadCourses}
          />
        )}
      </AnimatePresence>

      {/* My courses modal */}
      <AnimatePresence>
        {showMyCourses && user && (
          <MyCoursesModal
            user={user}
            onClose={() => setShowMyCourses(false)}
            onCoursesChanged={reloadCourses}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────
function CourseCard({ course, isUserShared, onClick }: { course: Course; isUserShared: boolean; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl p-5 relative overflow-hidden flex flex-col bg-white/70 backdrop-blur-sm border border-white/60 shadow-md hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300"
    >
      {/* Card top bar gradient on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-50 text-violet-500 group-hover:bg-violet-100 transition-colors">
            <CategoryIcon category={course.category} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-violet-500">{course.category}</span>
        </div>
        {isUserShared && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            <Globe size={9} /> Cộng đồng
          </span>
        )}
      </div>

      <h3 className="text-base font-display font-semibold text-slate-800 mb-3 leading-snug group-hover:text-violet-700 transition-colors flex-1">
        {course.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
        {course.hashtags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-500 font-medium group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100/60">
        <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-violet-500 transition-colors text-xs font-semibold">
          {course.type === 'external' ? (
            <><ExternalLink size={13} /><span>Mở tài liệu</span></>
          ) : course.type === 'modal' ? (
            <><BookOpen size={13} /><span>Xem chi tiết</span></>
          ) : (
            <><CheckCircle2 size={13} /><span>Đăng ký</span></>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm"
        >
          <Compass size={14} />
        </motion.div>
      </div>

      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-violet-400/5 rounded-full blur-2xl group-hover:bg-violet-400/10 transition-colors" />
    </motion.div>
  );
}

function CategoryIcon({ category }: { category: Course['category'] }) {
  switch (category) {
    case 'Môn học': return <BookOpen size={14} />;
    case 'Chứng chỉ': return <GraduationCap size={14} />;
    case 'Kỹ năng': return <Code size={14} />;
    default: return <Tag size={14} />;
  }
}
