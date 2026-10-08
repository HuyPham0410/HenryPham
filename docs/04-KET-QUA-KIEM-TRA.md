# Kết quả kiểm tra bản bàn giao

Ngày: 08/10/2026. Môi trường: Windows, Node.js 22.12.0.

- `npm test`: 9/9 test đạt sau lần chỉnh sửa cuối.
- Sau tích hợp cấu trúc NiceFit: `npm test` vẫn đạt 9/9; `npm run dev` khởi động qua `nodemon server.js`, trang Work trả HTTP 200.
- `npm audit --omit=dev`: 0 vulnerabilities. Audit toàn bộ: 3 mục mức high trong chuỗi dependency phát triển nodemon → chokidar → braces (cùng advisory GHSA-vfj7-8cjw-p6xm). braces mới nhất registry trả về là 3.0.3, vẫn nằm trong advisory; không chạy audit fix --force để hạ nodemon về bản rất cũ. Không dùng nodemon để chạy production. Đây không phải bảo đảm không có lỗ hổng chưa được biết đến.
- Server đã khởi động, trang Home/Work/Contact hiển thị trong trình duyệt.
- Đã xem trang chủ ở desktop 1280px và điện thoại 390px; trang Contact ở 390px có form, label và nút gửi đầy đủ, chiều rộng nội dung không vượt viewport.
- Kiểm thử tự động xác nhận POST thành công thực sự lưu dữ liệu và redirect 303; không gửi email ra ngoài.
- Chưa triển khai công khai, chưa kiểm tra HTTPS/reverse proxy thật, nhiều instance hoặc khả năng chịu tải.

Một dòng `Request failed: Error` xuất hiện trong test là dự kiến: test chủ động làm repository thất bại để xác nhận khách không nhận chi tiết lỗi nội bộ.
