# SmartEdu - Hệ Thống E-Learning Trực Tuyến

SmartEdu là một nền tảng học tập trực tuyến (E-Learning) hiện đại được thiết kế để quản lý lớp học, khóa học, bài kiểm tra và phản hồi giữa học sinh, giáo viên và quản trị viên. Dự án được phát triển theo kiến trúc tách biệt giữa Backend API (Laravel 12) và Frontend SPA (React + Vite).

## Công nghệ sử dụng

- Backend: PHP 8.2+ và Laravel 12
- Frontend: React + Vite
- Database: MySQL 8.0+
- Real-time: Laravel Reverb / WebSocket

## Yêu cầu hệ thống

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

## Hướng dẫn cài đặt

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### Frontend

```bash
cd frontend
npm install
```

## Chạy project

### Terminal 1: Backend API

```bash
cd backend
php artisan serve
```

### Terminal 2: WebSocket realtime

```bash
cd backend
php artisan reverb:start
```

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

## Tài khoản thử nghiệm

Sau khi chạy seeder, có thể dùng các tài khoản mẫu sau:

- Admin: admin@school.edu / password
- Teacher: teacher@school.edu / password
- Student: student@school.edu / password

