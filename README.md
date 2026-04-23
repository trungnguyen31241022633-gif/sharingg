# Học Liệu Tổng Hợp 🎓

Nền tảng tổng hợp khóa học và tài liệu học tập dành cho sinh viên.

## Tính năng

- 📚 Xem toàn bộ khóa học không cần đăng nhập
- 🔍 Tìm kiếm và lọc theo hashtag
- 👤 Tạo tài khoản / Đăng nhập để lưu lịch sử
- 🕑 Xem lại lịch sử các khóa học đã mở
- 💾 Dữ liệu lưu trên trình duyệt (localStorage)

## Chạy local

```bash
npm install
npm run dev
```

## Deploy lên Vercel

1. Push code lên GitHub
2. Import repo vào [vercel.com](https://vercel.com)
3. Vercel tự detect Vite → build & deploy tự động
4. Không cần cấu hình gì thêm (file `vercel.json` đã có sẵn)

## Cấu trúc

```
src/
  App.tsx         # Component chính
  auth.ts         # Hệ thống đăng ký / đăng nhập (localStorage)
  AuthModal.tsx   # Modal đăng nhập / tạo tài khoản
  HistoryModal.tsx# Panel lịch sử khóa học
  data.ts         # Dữ liệu khóa học
  index.css       # Styles (Tailwind v4)
  main.tsx        # Entry point
```
