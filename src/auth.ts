// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  courseId: string;
  courseTitle: string;
  visitedAt: string;
}

export interface CustomCourse {
  id: string;
  title: string;
  hashtags: string[];
  link: string;
  category: 'Môn học' | 'Chứng chỉ' | 'Kỹ năng' | 'Khác';
  createdAt: string;
}

// ─── Admin config ─────────────────────────────────────────────────────────────

export const ADMIN_EMAIL = 'trungnguyen.31241022633@st.ueh.edu.vn';
const ADMIN_PASSWORD = '23112006Tt@';

// ─── Storage keys ─────────────────────────────────────────────────────────────

const USERS_KEY = 'hoclieu_users';
const SESSION_KEY = 'hoclieu_session';
const CUSTOM_COURSES_KEY = 'hoclieu_custom_courses';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUsers(): Record<string, User> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUsers()[id] ?? null;
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export function isAdmin(user: User | null): boolean {
  return !!user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function getAllUsers(): User[] {
  return Object.values(getUsers());
}

// ─── Custom courses (admin-managed) ──────────────────────────────────────────

export function getCustomCourses(): CustomCourse[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_COURSES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addCustomCourse(course: Omit<CustomCourse, 'id' | 'createdAt'>): CustomCourse {
  const courses = getCustomCourses();
  const newCourse: CustomCourse = {
    ...course,
    id: `cc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  courses.push(newCourse);
  localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(courses));
  return newCourse;
}

export function deleteCustomCourse(id: string) {
  const courses = getCustomCourses().filter(c => c.id !== id);
  localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(courses));
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export function register(name: string, email: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
  const users = getUsers();
  const existing = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return { ok: false, error: 'Email này đã được đăng ký.' };

  const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  // We store a simple hash — for production use bcrypt server-side; this is client-only demo
  const key = `${id}__pwd`;
  localStorage.setItem(key, password);

  const user: User = {
    id,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
    history: [],
  };

  users[id] = user;
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, id);
  return { ok: true, user };
}

export function login(email: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
  // Seed admin account on first login attempt
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    if (password !== ADMIN_PASSWORD) return { ok: false, error: 'Mật khẩu không đúng.' };
    const users = getUsers();
    let admin = Object.values(users).find(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!admin) {
      const id = 'admin_root';
      admin = { id, name: 'Admin', email: ADMIN_EMAIL, createdAt: new Date().toISOString(), history: [] };
      users[id] = admin;
      localStorage.setItem(`${id}__pwd`, ADMIN_PASSWORD);
      saveUsers(users);
    }
    localStorage.setItem(SESSION_KEY, admin.id);
    return { ok: true, user: admin };
  }

  const users = getUsers();
  const user = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: 'Email không tồn tại.' };

  const storedPwd = localStorage.getItem(`${user.id}__pwd`);
  if (storedPwd !== password) return { ok: false, error: 'Mật khẩu không đúng.' };

  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function addHistory(courseId: string, courseTitle: string) {
  const id = getCurrentUserId();
  if (!id) return;
  const users = getUsers();
  const user = users[id];
  if (!user) return;

  // Remove duplicate then prepend
  user.history = user.history.filter(h => h.courseId !== courseId);
  user.history.unshift({ courseId, courseTitle, visitedAt: new Date().toISOString() });
  // Keep last 50
  user.history = user.history.slice(0, 50);
  saveUsers(users);
}

export function refreshUser(): User | null {
  return getCurrentUser();
}
