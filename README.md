# Yêu cầu hệ thống
- Máy tính sử dụng hệ điều hành Windows 10/11, Linux hoặc MacOS. 
- Đã cài đặt PHP phiên bản 8.2 trở lên. 
- Đã cài đặt Composer. 
- Đã cài đặt Node.js phiên bản 18 trở lên. 
- Đã cài đặt MySQL phiên bản 8.0 trở lên. 
- Trình duyệt web (Google Chrome, Microsoft Edge hoặc Firefox). 
- Đã cài đặt Git để quản lý và tải mã nguồn dự án. 

# Các bước cài đặt chương trình
1. Clone dự án
git clone <repository-url>
cd E-Learning
________________________________________
2. Cài đặt Backend (Laravel)
```text
Di chuyển vào thư mục backend:
cd backend
Cài đặt các thư viện cần thiết:
composer install
Sao chép file cấu hình môi trường:
cp .env.example .env
Tạo khóa ứng dụng:
php artisan key:generate
```
Cấu hình kết nối cơ sở dữ liệu trong file .env:
```text
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartedu
DB_USERNAME=root
DB_PASSWORD=
```
________________________________________
3. Cài đặt Database
```text
Tạo cơ sở dữ liệu:
CREATE DATABASE smartedu;
Thực hiện migration để tạo bảng dữ liệu:
php artisan migrate
Nếu dự án có dữ liệu mẫu:
php artisan db:seed
Hoặc:
php artisan migrate --seed
```
________________________________________
4. Chạy Backend
```text
php artisan serve
Backend sẽ chạy tại:
http://localhost:8000
```
________________________________________
5. Cài đặt Frontend (ReactJS)
```text
Mở terminal mới và di chuyển vào thư mục frontend:
cd frontend
Cài đặt các package:
npm install
Tạo file .env (nếu cần):
VITE_API_URL=http://localhost:8000/api
```
________________________________________
6. Chạy Frontend
```text
npm run dev
Frontend sẽ chạy tại:
http://localhost:5173
```
________________________________________
7. Tài khoản đăng nhập thử nghiệm
Sau khi chạy Seeder, hệ thống có thể cung cấp một số tài khoản mẫu:
```text
Vai trò	Email	Mật khẩu
Admin	admin@smartedu.com	password
Teacher	teacher@smartedu.com	password
Student	student@smartedu.com	password
```
(Thông tin tài khoản thực tế phụ thuộc vào dữ liệu seed của dự án.)

________________________________________
API Documentation
```text
Các API của hệ thống có thể được kiểm thử thông qua:
http://localhost:8000/api
Nếu dự án tích hợp Swagger:
http://localhost:8000/api/documentation
```
________________________________________
Khởi động hệ thống
```text
Backend
cd backend
php artisan serve
Frontend
cd frontend
npm run dev
Sau khi khởi động thành công:
Thành phần	Địa chỉ
Frontend	http://localhost:5173
Backend API	http://localhost:8000

MySQL	localhost:3306
```

________________________________________
Cấu trúc thư mục
```text
E-Learning/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Factories/
│   │   ├── Builders/
│   │   └── Observers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── storage/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── layouts/
│   └── public/
│
└── docs/
    ├── UML/
    └── Reports/
```
