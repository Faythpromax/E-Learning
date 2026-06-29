# SmartEdu - Hệ Thống E-Learning Trực Tuyến

SmartEdu là một nền tảng học tập trực tuyến (E-Learning) hiện đại được thiết kế để quản lý lớp học, khóa học, bài kiểm tra và phản hồi giữa Học sinh, Giáo viên và Quản trị viên. Dự án được phát triển theo kiến trúc tách biệt giữa Backend API (Laravel 12) và Frontend SPA (React + Vite).

---

## 🛠️ Công Nghệ Sử Dụng

Hệ thống được phát triển dựa trên các công nghệ tiên tiến:

*   **Backend:** PHP 8.2+ & **Laravel 12** (RESTful API, Laravel Sanctum cho xác thực bảo mật)
*   **Frontend:** Javascript, **ReactJS** & **Vite** (Giao diện SPA mượt mà)
*   **Database:** **MySQL 8.0+**
*   **Styling & UI:** TailwindCSS / Custom Vanilla CSS

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu cài đặt, máy tính của bạn cần đáp ứng các điều kiện sau:

*   **Hệ điều hành:** Windows 10/11, Linux hoặc MacOS.
*   **PHP:** Phiên bản `8.2` trở lên (đã kích hoạt các extension cần thiết như PDO, OpenSSL, BCMath, v.v.).
*   **Composer:** Công cụ quản lý thư viện PHP.
*   **Node.js:** Phiên bản `18.0` trở lên cùng với trình quản lý gói `npm`.
*   **Database:** MySQL Server phiên bản `8.0` trở lên.
*   **Git:** Dùng để clone và quản lý mã nguồn.

---

## 🚀 Hướng Dẫn Cài Đặt Chi Tiết

Thực hiện lần lượt các bước dưới đây để thiết lập môi trường phát triển (Development Environment).

### Bước 1: Tải Mã Nguồn
Mở terminal và clone dự án về máy:
```bash
git clone <repository-url>
cd E-Learning
```

### Bước 2: Cấu Hình Backend (Laravel API)
1.  Di chuyển vào thư mục `backend`:
    ```bash
    cd backend
    ```
2.  Cài đặt các gói phụ thuộc qua Composer:
    ```bash
    composer install
    ```
3.  Tạo file cấu hình môi trường từ file mẫu:
    ```bash
    cp .env.example .env
    ```
4.  Sinh khóa bảo mật ứng dụng (`APP_KEY`):
    ```bash
    php artisan key:generate
    ```
5.  Mở file `.env` vừa tạo và cập nhật cấu hình kết nối database phù hợp:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=smartedu
    DB_USERNAME=root
    DB_PASSWORD=your_mysql_password
    ```

### Bước 3: Thiết Lập Cơ Sở Dữ Liệu
1.  Tạo một cơ sở dữ liệu mới trong MySQL tên là `smartedu` (hoặc tên tùy cấu hình trong `.env`):
    ```sql
    CREATE DATABASE smartedu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
2.  Chạy migration và nạp dữ liệu mẫu (Seeders):
    ```bash
    php artisan migrate --seed
    ```
    > [!NOTE]  
    > Lệnh trên sẽ tự động tạo toàn bộ cấu trúc bảng và chèn các tài khoản mẫu cần thiết để thử nghiệm.

### Bước 4: Cấu Hình Frontend (ReactJS)
1.  Mở một cửa sổ Terminal mới (hoặc tab mới) và di chuyển vào thư mục `frontend`:
    ```bash
    cd frontend
    ```
2.  Cài đặt các package của NodeJS:
    ```bash
    npm install
    ```
3.  Tạo file `.env` nếu cần thiết để cấu hình đường dẫn API:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```

---

## 🖥️ Khởi Chạy Ứng Dụng

Sau khi hoàn thành cài đặt, hãy khởi chạy cả Backend và Frontend để chạy ứng dụng:

### 1. Khởi chạy Backend API Server
Trong thư mục `backend`:
```bash
php artisan serve
```
*   **Địa chỉ API:** [http://localhost:8000](http://localhost:8000)
*   **Endpoints chính:** [http://localhost:8000/api](http://localhost:8000/api)

### 2. Khởi chạy Frontend Development Server
Trong thư mục `frontend`:
```bash
npm run dev
```
*   **Địa chỉ giao diện:** [http://localhost:5173](http://localhost:5173)

---

## 🔑 Tài Khoản Đăng Nhập Thử Nghiệm

Hệ thống hỗ trợ 3 vai trò người dùng chính với quyền hạn khác nhau. Sau khi chạy lệnh `php artisan db:seed`, bạn có thể dùng các tài khoản mẫu dưới đây:

| Vai Trò (Role) | Email đăng nhập | Mật khẩu mặc định | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@school.edu` | `password` | Quản lý toàn bộ hệ thống, lớp học, giáo viên, học sinh |
| **Teacher** (Giáo viên) | `teacher@school.edu`<br>`teacher2@school.edu` | `password` | Tạo bài tập, bài thi, quản lý điểm và phản hồi |
| **Student** (Học sinh) | `student@school.edu`<br>`student2@school.edu`<br>`student3@school.edu` | `password` | Tham gia lớp học, làm bài thi, xem kết quả học tập |

---

## 📂 Cấu Trúc Thư Mục Dự Án

Cấu trúc thư mục được phân chia rõ ràng theo từng phân hệ:

```text
E-Learning/
├── backend/                    # Mã nguồn Laravel (Backend API)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # Tiếp nhận Request, xử lý HTTP & định dạng Response
│   │   │   └── Requests/      # Validate dữ liệu đầu vào (Form Requests)
│   │   ├── Models/            # Đại diện cho các thực thể cơ sở dữ liệu
│   │   └── Services/          # Lớp Business Logic chứa các thuật toán và nghiệp vụ chính
│   ├── database/
│   │   ├── migrations/        # Cấu trúc bảng cơ sở dữ liệu
│   │   └── seeders/           # Dữ liệu mẫu (Users, Classes, Questions, Tests, Subjects)
│   ├── routes/
│   │   └── api.php            # Định tuyến các API endpoints của hệ thống
│   └── storage/
│
├── frontend/                   # Mã nguồn ReactJS + Vite (Frontend Web)
│   ├── src/
│   │   ├── components/        # Các UI Components dùng chung (Buttons, Inputs, Modals,...)
│   │   ├── layouts/           # Bố cục giao diện (Sidebar, Header, DashboardLayout,...)
│   │   ├── pages/             # Các trang nghiệp vụ chính (Login, Quizzes, Class,...)
│   │   ├── services/          # Các hàm gọi API (Axios instance, endpoints auth/test,...)
│   │   ├── store/             # Quản lý trạng thái toàn cục (State management)
│   │   └── hooks/             # Custom React Hooks
│   ├── public/                # File tĩnh công khai
│   └── vite.config.js         # Cấu hình dự án Vite
│
└── docs/                       # Tài liệu tham khảo dự án
    ├── UML/                   # Sơ đồ thiết kế hệ thống (Sequence, Use Case)
    └── Reports/               # Báo cáo kỹ thuật liên quan
```

---

## 🔑 Thiết Kế Hệ Thống & Mẫu Thiết Kế (Design Patterns)

*   **Xác Thực (Authentication):** Sử dụng cơ chế **Token-Based Authentication (Laravel Sanctum)**. Khi đăng nhập thành công, hệ thống cấp phát một chuỗi `plainTextToken` lưu lại ở máy trạm để đính kèm vào Header trong các request tiếp theo (`Authorization: Bearer <token>`).
*   **Kiến Trúc Controller - Service:** Các Controller chỉ làm nhiệm vụ tiếp nhận yêu cầu từ client, gọi lớp nghiệp vụ tương ứng (`Services`) xử lý và định dạng cấu trúc JSON trả về. Mọi logic nghiệp vụ chính được viết tập trung ở thư mục `Services/`.
