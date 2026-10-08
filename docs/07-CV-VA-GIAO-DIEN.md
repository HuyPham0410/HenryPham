# Cá nhân hóa bằng CV và giao diện trắng–đen

## Nội dung đã cập nhật

- Huy (Henry) Pham, tốt nghiệp B.S. Computer Science tại UTSA tháng 5/2026.
- GPA 3.50/4.00, Major GPA 3.66/4.00, kỹ năng và ngôn ngữ theo CV được cung cấp.
- Work có NiceFit, Email Classification, Federated Learning for Healthcare và Personal Website.
- Mô tả đóng góp cá nhân trong dự án nhóm; không tự thêm số liệu hiệu quả, chức danh hoặc nơi làm việc.
- Trang `/resume` trình bày CV bằng HTML và cho tải bản PDF gốc. File PDF giữ nguyên, bao gồm thông tin liên hệ đã có trong CV.
- GitHub liên kết tới tài khoản trong CV. Không tự đặt link repository cho dự án chưa được xác nhận.
- Thuật ngữ FedProxy được giữ theo CV; nếu bạn muốn đổi tên thuật toán, hãy xác nhận lại từ tài liệu nghiên cứu gốc.

## Giao diện

Bootstrap 5.3.8 được đóng gói tại `public/vendor/bootstrap`, có kèm LICENSE. Trình duyệt tải từ chính website, không cần CDN khi chạy. Chỉ dùng CSS Bootstrap; không thêm bundle JavaScript khi chưa cần chức năng của nó.

Thiết kế trắng/đen/xám: chữ lớn, khoảng trống, nút dạng viên thuốc, card bo tròn, ảnh chân dung grayscale và khung blob bất đối xứng. Chuyển động trang trí bằng CSS; `prefers-reduced-motion` tắt chuyển động khi người dùng yêu cầu.

## File cần mở khi muốn tự sửa

| File | Cần sửa khi |
| --- | --- |
| src/data/content.js | Cập nhật giới thiệu, học vấn, kỹ năng, dự án hoặc GitHub |
| src/views/pages/index.ejs | Đổi bố cục trang chủ |
| src/views/pages/work.ejs | Đổi cách trình bày đóng góp và chi tiết dự án |
| src/views/pages/resume.ejs | Đổi cách hiển thị học vấn/kỹ năng |
| public/documents/Huy-Pham-CV.pdf | Thay CV tải xuống bằng phiên bản mới |
| src/views/partials/header.ejs | Đổi menu, metadata, thứ tự nạp Bootstrap/CSS |
| public/css/site.css | Đổi style; không sửa trực tiếp Bootstrap vendor |

Comment code đã viết bằng tiếng Anh ở các module server, service, repository, middleware, route, controller, template và từng nhóm CSS. Comment tập trung giải thích trách nhiệm, luồng xử lý và lý do bảo vệ dữ liệu. Comment `<%# ... %>` của EJS không xuất ra HTML gửi khách.

Ví dụ: `Encapsulate SQLite access and bind values to prepared statements instead of concatenating SQL` giải thích tại sao repository dùng placeholder thay vì nối chuỗi SQL.

## Những phần tiếp tục hoạt động

CommonJS, `npm run dev`, SQLite, form liên hệ, CSRF và rate limit giữ nguyên. Không cần cài thêm npm package cho giao diện vì CSS Bootstrap đã kèm mã nguồn. Không thay `.env`, cổng hoặc database của bản đang chạy trên máy bạn.

## Kiểm tra

10 test chức năng đã đạt, bao gồm trang Resume, nội dung CV, asset Bootstrap và PDF. Kiểm tra trình duyệt ở desktop 1280px và mobile 390px; sửa gutter Bootstrap gây tràn ngang. Bản này chỉ chạy local, chưa được publish lên internet.

Tài liệu Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
