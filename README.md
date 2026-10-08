# Henry Pham — EJS & Node.js

Phiên bản hiện tại đã cá nhân hóa theo CV: Home, Work, Resume, Contact; Bootstrap 5.3.8 và giao diện trắng–đen với blob. Xem [hướng dẫn cập nhật CV và giao diện](docs/07-CV-VA-GIAO-DIEN.md). Mã nguồn có comment tiếng Anh.

Bản tổ chức lại portfolio từ `HenryPham.zip`. Ba trang chính nằm cùng thư mục `src/views/pages`. Giao diện mới dùng CSS responsive riêng, giữ thông tin Henry, UTSA, email và ba mục Work; phần giới thiệu tiếng Anh được biên tập ngắn lại từ bản gốc.

Đã đồng bộ cách chạy với mẫu NiceFit theo phạm vi bạn chọn: CommonJS (`require/module.exports`), `server.js` ngoài root, `dotenv` và `nodemon`. Không thêm đăng nhập/Passport hoặc chuyển database sang MySQL.

## Chạy trên máy của bạn

Cài Node.js 24 LTS (tối thiểu 22.12). Mở terminal trong thư mục chứa `package.json`:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Mở http://127.0.0.1:3000. Dừng bằng Ctrl+C. `npm start` chạy không tự tải lại; `npm test` chạy kiểm thử. Cờ `--experimental-sqlite` hỗ trợ Node 22.12; cảnh báo experimental trên bản Node này là dự kiến.

Không mở file EJS bằng cách nhấp đúp và không dùng Live Server: EJS cần Node render qua HTTP.

## Cấu trúc

```text
server.js                   Đọc .env rồi gọi src/server.js
nodemon.json                Tự restart khi sửa code/giao diện lúc học
src/
  server.js                 Khởi động / dừng server
  app.js                    Lắp middleware, routes, các đối tượng
  config.js                 Đọc và kiểm tra cấu hình
  routes/index.js           URL → controller
  controllers/              Điều phối request / response
  services/                 Quy tắc và kiểm tra dữ liệu
  repositories/             Lưu / đọc SQLite
  middleware/security.js    Headers, giới hạn gửi, CSRF
  data/content.js           Nội dung portfolio
  views/
    pages/                  index, work, contact, success, error.ejs
    partials/               header.ejs, footer.ejs dùng chung
public/
  css/site.css              Một bộ CSS cho cả website
  images/portrait.jpg       Ảnh chân dung từ bản gốc
scripts/messages.js         Đọc tin nhắn cục bộ
test/app.test.js            Kiểm thử chức năng và bảo vệ
docs/                       Tổng kết, bài học, triển khai
data/                       Tự tạo khi chạy; không đưa lên Git
```

Sửa nội dung tại `src/data/content.js`, menu tại `src/views/partials/header.ejs`, style tại `public/css/site.css`.

## Form liên hệ đã làm được gì?

`GET /contact` tạo form có token. `POST /contact` kiểm tra token và dữ liệu, lưu SQLite rồi chuyển sang trang thành công bằng HTTP 303. Chạy `npm run messages` để xem tối đa 50 tin gần nhất. Lệnh này chỉ dành cho người có quyền truy cập máy chủ; không có API công khai đọc tin nhắn.

Tin nhắn **chưa được gửi qua email**. Chưa có tài khoản, đăng nhập, trang admin hay upload. Không dùng địa chỉ email khách nhập làm bằng chứng danh tính. Trang `/health` chỉ báo tiến trình HTTP đang chạy, không phải kiểm tra database.

## Đọc tiếp theo thứ tự

1. [Tổng kết folder gốc và chuyển đổi](docs/01-TONG-QUAN.md)
2. [Gia sư backend: học qua chính website này](docs/02-HOC-BACKEND.md)
3. [Các lớp bảo vệ và triển khai](docs/03-BAO-MAT-TRIEN-KHAI.md)
4. [Giải thích từng file và lộ trình học frontend/backend](docs/05-GIAI-THICH-TUNG-FILE.md)
5. [Đối chiếu cách chạy với NiceFit](docs/06-TUONG-THICH-NICEFIT.md)

ZIP gốc không bị chỉnh sửa. Thư viện cài đặt và dữ liệu khách không đi kèm gói bàn giao.
