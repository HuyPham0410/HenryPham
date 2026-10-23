# Nhật ký xây dựng personal website với Codex

Cập nhật: 23/10/2026. Ghi chép từ các yêu cầu, phản hồi và log trong cuộc trò chuyện; đây là quá trình học qua project, không phải chứng nhận năng lực hay kinh nghiệm làm việc chuyên nghiệp.

## 1. Điểm bắt đầu và mục tiêu

Website ban đầu là các trang HTML/CSS/JavaScript, từng được public qua GitHub Pages với cấu hình Jekyll. Mục tiêu mới là một portfolio cá nhân dành cho tuyển dụng: giới thiệu bản thân, trình bày dự án, tải CV và liên hệ. Người dùng muốn code gọn, dễ quản lý và có comment tiếng Anh để học cả frontend lẫn backend.

## 2. Quá trình tìm hiểu và thực hành

| Giai đoạn | Việc đã làm hoặc vấn đề gặp | Điều tìm hiểu qua project |
| --- | --- | --- |
| Tổ chức source | Gom các trang vào `src/views/pages`, chuyển HTML sang EJS, dùng partials chung | EJS là template engine; việc chia module/lớp giúp quản lý trách nhiệm, không phải đổi đuôi file là trở thành OOP |
| Đối chiếu NiceFit | Chọn CommonJS, server.js, dotenv và nodemon làm mẫu tương thích | Chỉ áp dụng phần cần thiết; không sao chép toàn bộ đăng nhập, Passport hay MySQL |
| Học backend | Tách routes, controllers, services, repositories và middleware | Request đi qua các tầng; frontend trình bày, backend xử lý và lưu dữ liệu |
| Chạy cục bộ | Gặp lỗi `npm ci` thiếu lockfile và `EADDRINUSE` | Phân biệt cài thư viện, khởi động tiến trình và cổng đang được sử dụng |
| Git/GitHub | Gặp folder không có `.git`, ký hiệu placeholder trong lệnh, file chưa stage và push bị từ chối | Phân biệt working tree, staging, commit và remote; `Everything up-to-date` không có nghĩa mọi folder trên máy đã được upload |
| Khác biệt hosting | GitHub Pages hiển thị README thay vì website EJS | Hosting tĩnh không tự chạy Node.js; EJS cần server render trước khi gửi HTML |
| Render | Gặp thiếu CSRF_SECRET và server chỉ bind `127.0.0.1` | Cấu hình production bằng environment variables; dùng cổng nền tảng cấp và bind `0.0.0.0` trên Render |
| Bảo vệ website | Tìm hiểu CSRF, kiểm tra dữ liệu, headers và giới hạn gửi form | Secret phải giữ ngoài Git; không coi các lớp bảo vệ hiện tại là bảo đảm an toàn tuyệt đối |
| Cá nhân hóa | Đưa CV và dự án vào Home, Work, Resume, Contact | Nội dung cần thể hiện đóng góp thật; không tự thêm thành tích hoặc kinh nghiệm |
| Thử thiết kế | Yêu cầu nhiều folder thử nghiệm riêng; phản hồi rằng chỉ đổi màu là chưa đủ | So sánh bố cục và phong cách thực sự khác nhau trước khi chọn mẫu |
| Tinh chỉnh | Từ dark kiểu coding sang vũ trụ, rồi nhẹ nhàng và professional; tiếp tục thử mẫu botanical | Đánh giá thiết kế theo người xem tuyển dụng, độ dễ đọc, tính cá nhân và mức độ chuyển động |
| CV mới | Đồng bộ PDF Pham_Gia_Huy_CV và trang Resume | Phân biệt nội dung CV nguồn với các bước phát triển project sau đó |

## 3. Cách làm việc với Codex đã thể hiện

- Đưa source, ví dụ NiceFit, CV và ảnh tham khảo để tạo ngữ cảnh cụ thể.
- Xác định phạm vi: chọn cấu trúc server/EJS thay vì thêm đăng nhập; yêu cầu clone mẫu trước khi thay đổi bản chính.
- Gửi nguyên log hoặc ảnh lỗi để chẩn đoán dựa trên bằng chứng.
- Hỏi nguyên nhân và cách hoạt động, không chỉ yêu cầu sửa lỗi: file/folder, backend, Git, hosting và bảo mật.
- Phản hồi trực tiếp về thiết kế: quá giống nhau, quá kỹ thuật, thiếu sự nhẹ nhàng; điều chỉnh theo mục tiêu tuyển dụng.
- Dùng AI để đề xuất và viết code, đồng thời giữ vai trò lựa chọn mục tiêu, nội dung và hướng thiết kế. Không mô tả toàn bộ code AI hỗ trợ là tự viết hoàn toàn.

## 4. Quy trình nên duy trì

1. Nêu mục tiêu, phần cần sửa và tiêu chí hoàn thành trong một yêu cầu.
2. Đọc phần giải thích và xem diff trước khi đưa code vào bản chính.
3. Chạy local; thử link, form, CV, màn hình nhỏ và các kiểm thử liên quan.
4. Ghi lại lỗi thực tế và cách sửa. Không gửi secret, `.env` hoặc dữ liệu khách.
5. Stage đúng file, commit rõ mục đích, đồng bộ remote rồi deploy.
6. Kiểm tra lại trên link public; local chạy được chưa đồng nghĩa production đã chạy được.

## 5. Những điểm cần giữ trung thực

- CV PDF mới vẫn mô tả phiên bản website triển khai trên GitHub Pages. Website hiện tại có thêm quá trình Express/EJS và Render; phần bổ sung này được ghi riêng, không sửa nội dung PDF nguồn.
- Form liên hệ của project dùng SQLite; lưu dữ liệu không đồng nghĩa đã gửi email. Lưu trữ lâu dài trên hosting cần được kiểm tra riêng.
- Các mẫu thiết kế là prototype độc lập, không tự động trở thành giao diện đang chạy trên Render.
- Việc tìm hiểu các lớp bảo vệ chưa phải một security audit.
- Nhật ký phản ánh những gì đã thực hành và trao đổi, không khẳng định mọi kiến thức đã được thành thạo độc lập.

## 6. Cách trình bày ngắn khi phỏng vấn

“Tôi phát triển website cá nhân từ bản tĩnh sang Node.js/Express và EJS với sự hỗ trợ của Codex. Tôi xác định yêu cầu, lựa chọn thiết kế và dùng các lỗi thực tế để tìm hiểu Git, cấu hình môi trường và triển khai Render. Codex hỗ trợ phân tích và viết code; tôi đang rèn việc đọc, kiểm tra và giải thích lại các thay đổi thay vì chỉ sao chép kết quả.”
