# Gia sư backend: từ form đến database

Hãy học từng bài bằng cách sửa một chỗ, chạy lại, quan sát. Mỗi buổi 30–45 phút. Bạn không cần hiểu toàn bộ dự án ngay từ đầu.

## Bài 1 — Browser và server làm gì?

Frontend là HTML/CSS hiển thị trong trình duyệt. Backend nhận HTTP request, xử lý dữ liệu rồi trả HTTP response. Node.js chạy JavaScript ngoài trình duyệt; Express giúp định tuyến HTTP. EJS chạy trên server và tạo HTML; trình duyệt không nhận mã EJS, mã server hay SQL.

Mở `/work`: trình duyệt gửi `GET /work` → Express tìm route → `PageController.work` đưa mảng projects cho EJS → EJS lặp qua từng project → trả HTML.

**Thực hành:** thêm một dự án trong `src/data/content.js`, tải lại trang. **Tự kiểm tra:** có cần tạo HTML mới không? Không: vòng lặp EJS đã tạo thẻ cho dữ liệu mới.

## Bài 2 — Template và tái sử dụng

Trong `work.ejs`, `<%= project.title %>` in chuỗi đã escape HTML. `<% ... %>` chạy logic vòng lặp. `<%- include('../partials/header') %>` chèn HTML từ template tin cậy của dự án.

Chỉ dùng `<%-` cho include do mình kiểm soát; không dùng nó để hiển thị tin nhắn khách. Nếu khách nhập `<script>`, ta muốn đó là chữ, không phải mã chạy trong browser. Đừng truyền thẳng `req.body` hoặc `req.query` vào `res.render`; controller chọn rõ các trường.

**Thực hành:** đổi chữ Home trong header. Cả ba trang sẽ đổi cùng lúc. **Câu hỏi:** vì sao EJS không thay thế Express? EJS chỉ dựng nội dung; Express nhận request và quyết định xử lý URL nào.

## Bài 3 — Hiểu một request gửi liên hệ

```text
Browser POST /contact
  → security headers + rate limit
  → body parser (giới hạn 16 KB)
  → contact limiter (5 lần / 15 phút / IP)
  → nhận diện cookie + CSRF
  → ContactController.submit
  → ContactService.submit (kiểm tra tên/email/nội dung)
  → ContactRepository.create (INSERT SQLite)
  → HTTP 303 → GET /contact/success
```

`req` chứa dữ liệu request. `res` dùng để trả kết quả. `next(error)` chuyển lỗi tới bộ xử lý lỗi chung. Middleware là bước xử lý đứng giữa lúc nhận request và controller, thứ tự đặt middleware có ý nghĩa.

**Thực hành:** gửi một tin thử và chạy `npm run messages`. Mở Developer Tools → Network để thấy POST 303 và GET 200. Refresh trang thành công không thêm bản ghi mới; nếu chủ động gửi lại form thì vẫn tạo tin mới (chưa có khóa chống trùng).

## Bài 4 — OOP qua ba nhân vật

| Lớp        | Trách nhiệm                                  | Không nên làm                |
| ---------- | -------------------------------------------- | ---------------------------- |
| Controller | Đọc request, gọi service, chọn response/view | Tự viết SQL                  |
| Service    | Kiểm tra quy tắc của tin nhắn                | Biết CSS hoặc gọi res.render |
| Repository | Ghi/đọc dữ liệu                              | Quyết định trả HTTP 422      |

Trong `new ContactService(repository)`, ta truyền đối tượng lưu dữ liệu vào service. Đây là dependency injection: service phụ thuộc vào khả năng `create`, không tự khởi tạo database. Trong kiểm thử có thể thay repository bằng đối tượng giả. Thuộc tính `#db` là private: mã bên ngoài không tùy tiện truy cập connection.

Controller dùng arrow function cho `submit` để giữ `this` khi Express gọi handler. Kế thừa không cần thiết ở đây; lắp các đối tượng với nhau đơn giản hơn.

**Thực hành:** tìm dòng nối controller/service/repository trong `app.js` và `server.js`. Giải thích bằng lời: ai tạo database, ai kiểm tra email, ai trả trang lỗi?

## Bài 5 — Validation phải ở server

HTML `required` và `maxlength` giúp người dùng nhập đúng, nhưng có thể bị bỏ qua bằng request tự tạo. Service kiểm tra kiểu string, trim khoảng trắng, giới hạn độ dài, định dạng email cơ bản. Regex này không chứng minh hộp thư tồn tại.

Các mã chính: 200 thành công; 301 URL cũ đã chuyển; 303 chuyển trang sau POST; 403 token không hợp lệ; 404 không có trang; 413 body quá lớn; 422 dữ liệu chưa hợp lệ; 429 gửi quá nhiều; 500 lỗi nội bộ.

**Thực hành:** sửa giới hạn message từ 3000 xuống 1000 ở cả service và template; sửa kiểm thử biên tương ứng. Chạy `npm test`. **Câu hỏi:** nếu chỉ sửa HTML thì sao? Client khác vẫn gửi được dữ liệu dài đến server.

## Bài 6 — Database và SQL an toàn

SQLite lưu vào `data/messages.sqlite`, tự tạo lần chạy đầu. Bảng messages gồm id, name, email, message và created_at (UTC). Dữ liệu còn sau khi restart nếu giữ nguyên file database.

Repository gọi `INSERT ... VALUES (?, ?, ?)` và truyền giá trị riêng. Placeholder khiến dữ liệu không bị nối thành cú pháp SQL. Đừng viết SQL kiểu `"INSERT ... '" + input + "'"`.

**Thực hành:** gửi tin chứa dấu nháy đơn và kiểm tra vẫn lưu đúng. Xem test về SQL trong `test/app.test.js`. **Lưu ý:** không công khai database qua public hoặc commit lên Git. JSON in ra từ lệnh messages giúp tránh control characters chạy trực tiếp trong terminal.

## Bài 7 — Security không phải chỉ một class

Header CSP hạn chế nơi tải/chạy nội dung; EJS escape giúp chống XSS; CSRF token gắn với cookie của từng khách; rate limit giảm spam; prepared statement chống SQL injection; error handler không gửi stack trace cho khách. Mỗi lớp xử lý một nguy cơ khác nhau.

CSRF không xác thực danh tính và không chặn bot biết tự lấy token. Rate limit theo IP có thể ảnh hưởng người chung mạng, mất trạng thái khi restart, không thay thế bảo vệ DDoS.

**Thực hành:** xem test token của người A không dùng được với cookie người B; gửi 6 request lỗi sẽ nhận 429. Xem tab Network để đọc CSP, cookie HttpOnly/SameSite. Không tắt CSRF để chữa lỗi: mở lại `/contact` lấy form mới và kiểm tra cookie.

## Bài 8 — Backend tiếp theo: lộ trình có thứ tự

1. Thêm trường subject: view → validation service → migration bảng → repository → test. Với database đã tồn tại, chỉ sửa CREATE TABLE không tự thêm cột; phải viết migration.
2. Thêm email thông báo: tạo NotificationService, chọn nhà cung cấp, giữ API key trong biến môi trường; chỉ báo đã gửi khi nhà cung cấp chấp nhận, tách trạng thái đã lưu và đã gửi. Không nối dữ liệu khách vào header email.
3. Admin đọc tin: học authentication (ai đang truy cập) và authorization (được làm gì). Dùng giải pháp xác thực được duy trì, mật khẩu băm bằng thuật toán phù hợp, session store bền vững, đổi session sau đăng nhập, CSRF cho thao tác admin. Không tạo route đọc tin công khai rồi mới bảo vệ sau.
4. Học migration, backup/restore, logging không lộ nội dung khách, xóa dữ liệu theo thời hạn.
5. Khi có nhiều server: shared rate-limit store, database dùng chung, quan sát lỗi và tải, kiểm thử triển khai HTTPS.

**Bài tập tổng hợp:** tự giải thích hành trình một tin nhắn trong 60 giây; chỉ ra nơi bạn sẽ sửa nếu muốn thay SQLite bằng PostgreSQL. Gợi ý: repository và phần lắp dependency thay đổi nhiều nhất; giao diện và controller có thể giữ hợp đồng cũ.

## Tài liệu chính thức

- Express: https://expressjs.com/en/guide/routing.html
- EJS: https://ejs.co/
- Node SQLite: https://nodejs.org/api/sqlite.html
- Security: https://expressjs.com/en/advanced/best-practice-security.html
- CSRF middleware: https://github.com/Psifi-Solutions/csrf-csrf
