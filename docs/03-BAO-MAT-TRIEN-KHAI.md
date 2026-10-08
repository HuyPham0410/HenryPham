# Bảo vệ và triển khai

## Đã có trong mã

| Lớp bảo vệ       | Cách dùng                                                                           |
| ---------------- | ----------------------------------------------------------------------------------- |
| Security headers | Helmet, CSP chỉ cho asset cùng origin, chặn nhúng iframe                            |
| XSS              | EJS escape dữ liệu bằng `<%=`, không có inline script/style                         |
| CSRF             | csrf-csrf signed double-submit, token gắn với visitor cookie đã ký                  |
| Cookie           | HttpOnly, SameSite=Strict; production thêm Secure và prefix __Host-                 |
| Validation       | Kiểu dữ liệu, chiều dài và email cơ bản, kiểm tra phía server                       |
| Giới hạn         | Body 16 KB, tối đa 10 parameters; 5 lần gửi/15 phút/IP; tổng 300 request/15 phút/IP |
| Database         | Prepared statements; file nằm ngoài public                                          |
| Lỗi              | 404/4xx/500 riêng; không trả stack/secret; log chỉ loại lỗi                         |
| Cấu hình         | Không commit .env; production bắt buộc secret; mặc định không tin proxy             |

Đây là nền tảng bảo vệ, không phải chứng nhận website an toàn tuyệt đối. Chưa có authentication, admin, kiểm duyệt spam, email delivery, chính sách lưu/xóa tự động, backup tự động hoặc bảo vệ DDoS ở hạ tầng.

## Local và production khác nhau

Local dùng HTTP nên cookie không bật Secure và không ép HTTPS. Production yêu cầu HTTPS ở reverse proxy/hạ tầng. Không chỉ đổi NODE_ENV rồi tiếp tục dùng HTTP: browser sẽ không gửi cookie Secure và form thất bại.

Tạo secret trên máy triển khai:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Đặt kết quả vào secret manager hoặc `.env` riêng trên server; không dán vào Git. Cấu hình `NODE_ENV=production`, `DATABASE_PATH` tới ổ lưu trữ bền vững. Nếu cần nhận kết nối từ container/proxy, cấu hình `HOST=0.0.0.0` và giới hạn truy cập bằng firewall/proxy. Cổng ứng dụng không nên bị phơi trực tiếp ngoài luồng HTTPS.

Chỉ đặt `TRUST_PROXY` thành IP/subnet thực của reverse proxy bạn quản lý. Không đặt `true` hoặc số hop tùy ý: người gửi có thể giả IP qua header nếu tuyến mạng không được giới hạn. Với nhiều tiến trình, cần thay memory store của rate limiter bằng shared store.

## Quy trình triển khai đầu tiên

1. Chọn nơi chạy Node dài hạn, có HTTPS và persistent disk. GitHub Pages và S3 static hosting không tự chạy Express/EJS.
2. Cài dependency bằng `npm ci`, chạy `npm test`, kiểm tra `npm audit`.
3. Cấp biến môi trường; cài chỉ runtime dependency bằng `npm ci --omit=dev` ở môi trường chạy riêng; `npm start`.
4. Cấu hình process manager/service tự khởi động lại; reverse proxy HTTPS, timeout/request limits, trusted proxy chính xác.
5. Từ domain HTTPS thật, thử ba trang, gửi form, đọc tin bằng lệnh cục bộ, khởi động lại rồi xác nhận dữ liệu còn; kiểm tra cookie Secure và redirect cũ.
6. Bảo vệ quyền file database và backup, đặt thời hạn giữ tin nhắn, theo dõi lỗi. Không ghi email/nội dung vào access log tùy tiện.

SQLite dùng WAL: không sao chép riêng file `.sqlite` trong lúc app đang ghi. Cho lần backup đơn giản, dừng app sạch, sao lưu database, rồi chạy lại; hoặc dùng cơ chế backup SQLite chuyên dụng. Thử restore vào môi trường riêng trước khi tin tưởng bản backup.

`npm run messages` là công cụ local dành cho chủ máy, không phải trang admin. Không mở terminal/command runner công khai để người ngoài gọi lệnh này.

## Phạm vi test

`npm test` kiểm tra routes, redirect, static/private paths, form thành công, validation, escape HTML, CSRF giả/khác người, rate limit, body lớn, persistence SQLite, dữ liệu trông như SQL, lỗi database và cookie production. Test không thay thế pentest, kiểm thử tải, kiểm thử hạ tầng HTTPS thực hoặc thử toàn bộ trình duyệt.
