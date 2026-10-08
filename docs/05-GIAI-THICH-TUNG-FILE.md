# Bản đồ học frontend và backend qua HenryPham

Tài liệu này phân tích bản EJS/Express đang chạy, không phải bản HTML/Jekyll gốc. Đường dẫn trong tài liệu tính từ thư mục HenryPham chứa package.json. Bạn có thể đọc từ đầu hoặc tìm tên file đang mở trong editor.

## 1. Phân biệt những thứ đang học

| Khái niệm  | Nghĩa dễ hiểu                                         | Trong dự án                               |
| ---------- | ----------------------------------------------------- | ----------------------------------------- |
| HTML       | Cấu trúc và ý nghĩa nội dung                          | Thẻ h1, nav, form trong EJS               |
| CSS        | Cách nội dung được trình bày                          | public/css/site.css                       |
| JavaScript | Ngôn ngữ lập trình, có thể chạy ở browser hoặc server | Hiện tại mã JS của dự án chạy trên Node   |
| Frontend   | Phần khách xem và tương tác trong browser             | HTML được render, CSS, ảnh, form          |
| Backend    | Nhận yêu cầu, kiểm tra và xử lý dữ liệu               | Express, controller, service, repository  |
| Node.js    | Môi trường chạy JavaScript ngoài browser              | Chạy server.js                            |
| Express    | Thư viện nhận và định tuyến HTTP                      | app.js, routes/index.js                   |
| EJS        | Khuôn tạo HTML bằng dữ liệu                           | src/views                                 |
| SQLite     | Database lưu dữ liệu thành file                       | data/messages.sqlite                      |
| OOP        | Tổ chức mã bằng đối tượng có dữ liệu và hành vi       | Các class Controller, Service, Repository |

EJS thực thi trên server nhưng mô tả giao diện frontend. Browser nhận HTML đã tạo, không chạy EJS. Bản hiện tại chưa có JavaScript chạy ở browser: form HTML vẫn gửi được nhờ cơ chế sẵn có của browser. Khi học tương tác như menu mở/đóng, bạn có thể bổ sung public/js/site.js sau.

## 2. Cây thư mục đầy đủ

```text
HenryPham/
├── server.js                  Đọc .env rồi nạp src/server.js
├── nodemon.json               Cấu hình theo dõi thay đổi khi học
├── README.md
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── .env                       Bạn tự tạo; hiện không đi kèm
├── node_modules/              npm tự cài
├── public/
│   ├── css/site.css
│   └── images/portrait.jpg
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config.js
│   ├── routes/index.js
│   ├── controllers/
│   │   ├── PageController.js
│   │   └── ContactController.js
│   ├── services/ContactService.js
│   ├── repositories/ContactRepository.js
│   ├── middleware/security.js
│   ├── data/content.js
│   └── views/
│       ├── partials/
│       │   ├── header.ejs
│       │   └── footer.ejs
│       └── pages/
│           ├── index.ejs
│           ├── work.ejs
│           ├── contact.ejs
│           ├── success.ejs
│           └── error.ejs
├── data/
│   ├── messages.sqlite
│   ├── messages.sqlite-wal    Có thể xuất hiện khi database hoạt động
│   └── messages.sqlite-shm    Có thể xuất hiện khi database hoạt động
├── scripts/messages.js
├── test/app.test.js
└── docs/
    ├── 01-TONG-QUAN.md
    ├── 02-HOC-BACKEND.md
    ├── 03-BAO-MAT-TRIEN-KHAI.md
    ├── 04-KET-QUA-KIEM-TRA.md
    └── 05-GIAI-THICH-TUNG-FILE.md
```

Tên folder là quy ước do mình chọn để dễ đọc. Express không bắt buộc phải đặt tên controllers hay services. Liên kết require, cấu hình và route mới là thứ khiến chúng hoạt động.

## 3. Các file ở ngoài cùng

### README.md — điểm bắt đầu

Hướng dẫn cài, chạy, xem cấu trúc và tìm tài liệu. .md là Markdown: văn bản có tiêu đề, bảng và code block. File này không chạy trong server. Đọc đầu tiên khi mở một dự án lạ.

### package.json — thông tin và lệnh của dự án

Chứa tên dự án, kiểu module, yêu cầu Node và danh sách thư viện. `type: commonjs` cho phép dùng require/module.exports trong các file .js này. `private: true` giúp tránh vô tình publish package lên npm; không làm website trở thành website riêng tư.

| Lệnh             | Việc thực hiện                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| npm ci           | Cài thư viện theo package-lock.json; có thể thay thế node_modules hiện có |
| npm run dev      | Chạy server với nodemon; theo dõi mã server để khởi động lại              |
| npm start        | Chạy server không bật watch                                               |
| npm test         | Chạy test bằng test runner của Node                                       |
| npm run messages | In tối đa 50 tin nhắn gần nhất trong terminal                             |

`dependencies` chứa express, ejs, helmet, cookie-parser, csrf-csrf, express-rate-limit phục vụ ứng dụng. `devDependencies` có supertest phục vụ test HTTP. SQLite và test runner lấy từ Node nên không xuất hiện như package riêng.

Đừng chạy dev và start cùng một cổng đồng thời. Sau khi sửa giao diện, refresh browser; nodemon không có nghĩa browser tự refresh. Khi sửa backend bằng npm start, hãy dừng rồi chạy lại.

### package-lock.json — phiên bản cài đặt cụ thể

Khóa phiên bản của thư viện trực tiếp và thư viện phụ thuộc. package.json có thể cho phép một khoảng phiên bản; lockfile ghi lại phiên bản đã giải quyết cụ thể. Giữ file này trong Git. Để npm cập nhật nó, không sửa hàng nghìn dòng bằng tay.

### .env.example và .env — cấu hình môi trường

.env.example là mẫu có thể chia sẻ. Copy thành .env để đặt giá trị cho máy của bạn. server.js ở root và công cụ đọc tin nhắn dùng dotenv đọc file này; .env không tự được mọi chương trình JavaScript đọc.

| Biến          | Vai trò                                                         |
| ------------- | --------------------------------------------------------------- |
| PORT          | Cổng nhận HTTP, mặc định 3000                                   |
| HOST          | Địa chỉ lắng nghe, mặc định chỉ máy hiện tại: 127.0.0.1         |
| NODE_ENV      | Chọn development hoặc production                                |
| DATABASE_PATH | Vị trí database; đường dẫn tương đối tính từ root dự án         |
| CSRF_SECRET   | Secret dùng ký cookie/token; production bắt buộc giá trị đủ dài |
| TRUST_PROXY   | Proxy IP/subnet được tin cậy, để trống khi học local            |

.env không được public và không nên commit. Đổi NODE_ENV thành production không tự cấp HTTPS hay đưa website lên mạng. Trong development, thiếu secret thì mã tạo secret mới mỗi lần khởi động; form đang mở từ trước có thể cần mở lại sau restart.

### .gitignore — danh sách Git bỏ qua

Bỏ qua node_modules, .env, data database, coverage và log. Dấu `/` đầu `/data/` chỉ folder data ở root, không bỏ qua src/data/content.js. Gitignore không phải tường lửa: bảo vệ HTTP đến từ việc server chỉ công khai public. File từng được Git theo dõi cũng không tự biến mất khỏi lịch sử chỉ vì thêm gitignore.

### node_modules/ — thư viện được cài

npm quản lý folder này. Không cần học từng file bên trong, không chỉnh trực tiếp: cài lại sẽ mất sửa đổi. Không đưa vào ZIP mã nguồn/Git; dùng npm ci để tái tạo.

## 4. public/ — tài nguyên trình duyệt được tải

Trong app.js, `/assets` được nối với folder public. Vì vậy **đường dẫn trên ổ đĩa và URL không nhất thiết giống nhau**:

| File trên ổ đĩa            | URL browser dùng            |
| -------------------------- | --------------------------- |
| public/css/site.css        | /assets/css/site.css        |
| public/images/portrait.jpg | /assets/images/portrait.jpg |

### public/css/site.css

Quản lý toàn bộ màu, khoảng cách, kiểu chữ, nút, form và responsive. `:root` khai báo biến như --paper và --ink. Các selector như .hero chọn phần tử có class tương ứng. Grid chia cột; Flexbox sắp phần tử theo hàng/cột; media query đổi bố cục khi viewport nhỏ hơn 800px và 580px.

Học theo thứ tự: selector → margin/padding/border → box model → flex/grid → media query → focus và khả năng tiếp cận. Thử thay --paper, refresh rồi quan sát. Mở DevTools → Elements để thử CSS tạm; muốn giữ thay đổi phải sửa file.

### public/images/portrait.jpg

Ảnh chân dung lấy từ ZIP gốc. index.ejs tham chiếu ảnh bằng URL /assets/images/portrait.jpg. Có thể thay ảnh hoặc đổi tên và sửa src tương ứng. Thuộc tính alt là mô tả cho công cụ đọc màn hình, không nên bỏ.

Không đặt .env, database hoặc mã quản trị riêng tư vào public: file trong đó có thể được người ngoài yêu cầu tải.

## 5. src/views/ — từng phần giao diện

### partials/header.ejs

Chứa doctype, html, head, metadata, title, link CSS, logo/menu và thẻ mở main. Nhận `title` để đặt tên tab; nhận `active` để đánh dấu menu hiện tại. Có skip link giúp dùng bàn phím chuyển thẳng tới nội dung.

Đổi menu ở đây sẽ tác động nhiều trang. Header chỉ là một mảnh của tài liệu; nó không có đủ phần đóng trang vì phần đó ở footer.

### partials/footer.ejs

Đóng main, hiển thị footer, năm bản quyền và link Contact, rồi đóng body/html. Dùng chung để tránh mỗi trang có footer khác nhau ngoài ý muốn.

### pages/index.ejs

Trang chủ: hero, chân dung, giới thiệu và sở thích. Dữ liệu profile do PageController truyền vào. Dùng vòng lặp để hiển thị các đoạn giới thiệu và các sở thích.

Học thẻ section, h1/h2, p, a, figure/img và class CSS ở file này. Nếu chỉ đổi lời giới thiệu, sửa content.js; nếu đổi cách trình bày đoạn giới thiệu, sửa index.ejs hoặc CSS.

### pages/work.ejs

Trang Work: lặp qua mảng projects, tạo card cho từng dự án. Mỗi card có title, status, description, tags. Khi thêm phần tử vào projects, không cần sao chép toàn bộ HTML card.

Ví dụ cùng nguyên tắc với mã hiện tại:

```ejs
<% projects.forEach((project) => { %>
  <h2><%= project.title %></h2>
<% }) %>
```

`<% ... %>` chạy logic; `<%= ... %>` in giá trị có escape HTML. `<%- include(...) %>` chèn một template nội bộ. Không dùng `<%- message %>` với dữ liệu khách gửi. Escape HTML không thay thế việc kiểm tra URL hay các kiểu dữ liệu khác khi bạn mở rộng app.

### pages/contact.ejs

Thông tin liên hệ và form HTML gửi POST /contact. Có name, email, message, hidden _csrf, lỗi theo từng trường và giá trị cũ khi nhập chưa đúng.

| Thuộc tính          | Ý nghĩa                                 |
| ------------------- | --------------------------------------- |
| action="/contact"   | Địa chỉ nhận dữ liệu                    |
| method="post"       | Cách gửi HTTP                           |
| name="email"        | Tên khóa backend đọc qua req.body.email |
| id="email"          | Định danh phần tử để label/CSS liên kết |
| type="email"        | Gợi ý loại input và validation browser  |
| required, maxlength | Hỗ trợ nhập liệu phía browser           |

`id` không thay thế `name`: input không có name thường không được gửi như trường form. Hidden không có nghĩa bí mật; token hiện diện trong HTML, nhưng server xác minh token khớp cookie/ngữ cảnh. Validation browser có thể bị bỏ qua, nên service vẫn kiểm tra lại.

### pages/success.ejs

Thông báo sau khi POST lưu thành công và redirect. Không gửi email. Bản hiện tại cho phép truy cập trực tiếp URL success, nên chỉ nhìn thấy trang này không phải bằng chứng database đã lưu; bằng chứng trong luồng chuẩn là repository thành công trước redirect.

### pages/error.ejs

Template chung cho lỗi như 403/404/500, nhận status, title và message. Đây là nơi trình bày lỗi; việc xác định lỗi và mã HTTP nằm ở app.js. Không hiển thị stack trace, secret hoặc chi tiết SQL cho khách.

## 6. src/data/content.js — nội dung portfolio

Xuất profile và projects bằng module.exports. Đây là dữ liệu do chủ website viết trong mã nguồn: lời giới thiệu, sở thích, dự án. module.exports giúp module khác lấy dữ liệu bằng require().

**Phân biệt:** src/data chứa nội dung portfolio được đưa vào Git. Folder data ở root chứa database tin nhắn của khách và được bỏ khỏi Git. Hai folder khác nhiệm vụ dù cùng tên data.

Bài tập đầu tiên: thêm một project theo cấu trúc phần tử đang có, giữ đủ title/status/description/tags. Mục mới phải xuất hiện trên Work khi server đã nhận thay đổi và bạn tải lại trang.

## 7. server.js và src/server.js — điểm khởi động backend

`server.js` ở root là điểm chạy giống NiceFit. Nó gọi dotenv để đọc cấu hình từ .env, sau đó require('./src/server'). `nodemon.json` chỉ định theo dõi server/src/public/.env và khởi động Node với cờ SQLite cần cho Node 22.12. Thay CSS/EJS cũng có thể làm server restart; refresh browser để thấy thay đổi. Trong development không đặt CSRF_SECRET cố định, hãy mở lại form sau restart nếu token cũ hết hiệu lực.

Đọc cấu hình → tạo ContactRepository → tạo app → listen trên host/port. Khi dừng, đóng server và database. Nếu cổng đang bị chiếm, server có thể báo lỗi khởi động.

Đây là nơi mở cổng, không phải nơi viết giao diện hoặc kiểm tra email. `app.listen(...)` giúp tiến trình bắt đầu nhận kết nối. `console.log` ở đây xuất hiện trong terminal server, không phải console browser.

## 8. src/app.js — lắp ứng dụng

Hàm createApp nhận config và repository, tạo Express app, cấu hình views/EJS, cài security, đọc form body, phục vụ public, tạo controller/service, đăng ký routes và xử lý lỗi.

`express.urlencoded(...)` chuyển dữ liệu form thành req.body. Nó được giới hạn 16 KB và 10 parameters. Dự án hiện chưa dùng express.json(), nên không nên giả định POST JSON sẽ hoạt động giống form.

Lý do tách khỏi server.js: test có thể tạo app với database in-memory mà không khởi động server sản phẩm cố định trên cổng 3000. Thứ tự app.use quan trọng: bộ đọc body phải chạy trước handler cần đọc req.body; handler 404 phải sau routes để không chặn mọi trang.

## 9. src/config.js — chuẩn hóa cấu hình

Tính root từ vị trí module; đọc env; kiểm tra PORT; yêu cầu secret khi production; chuẩn hóa đường dẫn database và trusted proxy. Trả một object config để các lớp dùng chung.

Đổi cổng bằng .env tốt hơn sửa số 3000 trong nhiều file. Đừng thay TRUST_PROXY để chữa lỗi rate limit khi chưa hiểu proxy đang đứng ở đâu.

## 10. src/routes/index.js — bảng URL

| Method và URL                              | Xử lý                                      |
| ------------------------------------------ | ------------------------------------------ |
| GET /                                      | pages.home                                 |
| GET /work                                  | pages.work                                 |
| GET /contact                               | identify rồi contact.show                  |
| POST /contact                              | limiter → identify → CSRF → contact.submit |
| GET /contact/success                       | Render trang thông báo                     |
| GET /health                                | Trả JSON trạng thái HTTP app               |
| GET /index.html, /work.html, /contact.html | Redirect 301 sang đường dẫn mới            |

GET thường để lấy nội dung; POST để gửi dữ liệu cần xử lý. Cùng URL /contact nhưng method khác sẽ đi handler khác. Tên index.js trong folder routes là quy ước file đầu mối, không phải trang chủ index.ejs.

## 11. src/controllers/ — điều phối HTTP

### PageController.js

Dùng require để lấy profile/projects; home render index.ejs, work render work.ejs. `res.render('pages/work', { projects })` chọn template và truyền dữ liệu cho template. title/active cũng được truyền để partial header dùng.

### ContactController.js

Constructor nhận service và hàm tạo CSRF token. render chuẩn bị errors, values, token và HTTP status. show hiển thị form. submit gọi service, redirect 303 khi thành công; ValidationError trả lại form với 422; lỗi khác chuyển next(error).

`req` là request khách gửi; `res` là công cụ trả response; `next` chuyển sang bước tiếp theo hoặc handler lỗi. Controller không tự INSERT SQL. Các handler arrow function giữ `this` khi Express gọi chúng.

## 12. src/services/ContactService.js — quy tắc dữ liệu

Có hai class: ContactService xử lý đầu vào; ValidationError mang lỗi theo từng trường và giá trị đã xử lý về controller.

submit kiểm tra kiểu string, trim khoảng trắng, tên 2–80, email 3–254, message 10–3000 và regex email cơ bản. Nếu hợp lệ mới gọi repository.create. Nó không biết HTTP, res.render hay CSS.

Lưu ý chiều dài hiện dùng JavaScript string.length (đơn vị UTF-16), không phải bộ đếm ký tự hiển thị hoàn hảo cho mọi emoji/ngôn ngữ. Kiểm tra email không chứng minh người gửi sở hữu địa chỉ đó.

Khi muốn đổi quy tắc độ dài, sửa service cùng giới hạn trong view và test liên quan. Chỉ sửa view là chưa đủ.

## 13. src/repositories/ContactRepository.js — làm việc với database

Constructor tạo folder nếu cần, mở SQLite, bật WAL, đặt busy timeout 5 giây và tạo bảng messages nếu chưa có. Bảng gồm id, name, email, message, created_at.

| Thành phần  | Vai trò                                                  |
| ----------- | -------------------------------------------------------- |
| #db         | Connection private, không truy cập tùy tiện từ bên ngoài |
| create(...) | INSERT một tin nhắn, trả id                              |
| recent()    | Đọc tối đa 50 tin mới nhất                               |
| close()     | Đóng connection                                          |

SQL dùng placeholder ? và truyền giá trị riêng; dữ liệu chứa dấu nháy không bị nối thành câu lệnh SQL. Không ghép input vào chuỗi SQL. DatabaseSync là đồng bộ, tiện học và app nhỏ nhưng xử lý query sẽ giữ luồng JS trong thời gian query chạy.

Nếu thay SQLite bằng hệ khác, cố giữ hợp đồng create/recent/close rồi thay implementation. Nếu chuyển sang thư viện bất đồng bộ, phải cập nhật async/await ở các lớp gọi nó; không chỉ thay một câu require.

## 14. src/middleware/security.js — những bước bảo vệ request

Đây là tập hàm middleware, không phải mọi thành phần đều cần class. installSecurity cài header, rate limiter chung và cookie parser; trả middleware dành cho routes contact.

| Thành phần     | Giúp gì                                                 | Không thay thế điều gì                |
| -------------- | ------------------------------------------------------- | ------------------------------------- |
| Helmet/CSP     | Quy định nguồn tải/chạy tài nguyên, hạn chế nhúng trang | Escape/validation                     |
| cookie-parser  | Đọc và kiểm tra chữ ký cookie                           | Đăng nhập hoặc mã hóa toàn bộ cookie  |
| identify       | Tạo định danh visitor ngẫu nhiên có chữ ký              | Biết khách là người nào               |
| csrf-csrf      | Kiểm tra token khớp ngữ cảnh cookie                     | CAPTCHA, anti-bot hoặc authentication |
| contactLimiter | Giới hạn 5 lần thử gửi/15 phút/IP                       | Bảo vệ DDoS đầy đủ                    |
| limiter chung  | Giới hạn 300 request/15 phút/IP                         | Hạ tầng cân bằng tải                  |

Cookie ký giúp phát hiện sửa dữ liệu, không đồng nghĩa dữ liệu được mã hóa. Memory rate limiter mất trạng thái khi process restart và không tự chia sẻ giữa nhiều process.

## 15. data/ — dữ liệu phát sinh

messages.sqlite là file database thật, không phải text để sửa bằng editor. -wal có thể chứa thay đổi mới chưa được hợp nhất vào file chính; -shm hỗ trợ cơ chế shared-memory của WAL. SQLite tự quản lý các file này: không xóa chúng trong lúc server đang hoạt động.

Không copy riêng .sqlite khi app đang ghi rồi mặc định bản backup đầy đủ. Với cách đơn giản, dừng server sạch trước khi sao lưu; xem thêm tài liệu triển khai. Database tin nhắn không nằm trong ZIP bàn giao.

## 16. scripts/messages.js — công cụ cho chủ website

Đọc config, mở repository, gọi recent(), in JSON rồi đóng database. Chạy từ terminal bằng npm run messages. Nó dùng lại lớp repository thay vì chép SQL ra nhiều nơi. Đây là công cụ local, không phải API cho mọi người xem tin nhắn và chưa phải trang admin.

## 17. test/app.test.js — kiểm tra hành vi

Dùng node:test/assert và supertest. Tạo app riêng, dùng database trong bộ nhớ cho hầu hết test, database tạm cho test persistence. Bao phủ routes, form hợp lệ, CSRF sai/khác visitor, validation, escape HTML, request lớn, rate limit, SQL-looking input, lỗi repository và cấu hình production.

Tên test mô tả yêu cầu; expect kiểm tra HTTP status; assert kiểm tra kết quả. Khi test thất bại, đọc test đang mong gì trước khi sửa code. Không đổi mong đợi chỉ để làm test xanh nếu yêu cầu cũ vẫn đúng.

## 18. docs/ — thư viện học trong dự án

| File                       | Khi nào đọc                               |
| -------------------------- | ----------------------------------------- |
| 01-TONG-QUAN.md            | So sánh bản HTML/Jekyll gốc với bản mới   |
| 02-HOC-BACKEND.md          | Học backend theo bài và bài tập           |
| 03-BAO-MAT-TRIEN-KHAI.md   | Trước khi đưa website lên mạng            |
| 04-KET-QUA-KIEM-TRA.md     | Xem những gì đã và chưa được kiểm tra     |
| 05-GIAI-THICH-TUNG-FILE.md | Tra vai trò từng file; chính tài liệu này |

## 19. Nối mọi thứ thành hai hành trình

### Khi mở trang Work

```text
Browser GET /work
→ middleware chung trong app
→ routes/index.js chọn pages.work
→ PageController lấy projects từ content.js
→ work.ejs kết hợp header/footer để tạo HTML
→ browser nhận HTML
→ browser yêu cầu /assets/css/site.css và các asset được tham chiếu
→ browser vẽ giao diện
```

Đây là server-side rendering. Địa chỉ URL /work không bắt buộc phải có file work.html thật trên server.

### Khi gửi Contact

```text
GET /contact → cookie + token + form HTML
Người dùng nhập dữ liệu → browser POST /contact
→ middleware chung + parser
→ contact limiter → identify → CSRF
→ ContactController.submit
→ ContactService.submit
→ ContactRepository.create → SQLite
→ redirect 303 → browser GET /contact/success
```

Nếu validation sai, không lưu; trả form 422 và giữ dữ liệu. Nếu token sai, middleware dừng với 403 trước khi đến controller. Nếu SQLite lỗi, handler trả 500 thay vì thông báo lưu thành công.

## 20. OOP qua ví dụ của chính dự án

```js
const service = new ContactService(repository);
const contact = new ContactController(service, generateToken);
```

Class là bản mô tả; new tạo instance; constructor nhận những thứ instance cần; this.service là thuộc tính; submit là phương thức. Truyền repository/service từ ngoài vào là dependency injection. Mỗi lớp giữ một trách nhiệm nên dễ thay đổi và test.

Không cần học kế thừa phức tạp ngay. Trong app này, composition (ghép đối tượng) là cách chính. ValidationError kế thừa Error vì nó là một loại lỗi; ContactController không cần kế thừa ContactService vì hai lớp có nhiệm vụ khác nhau.

## 21. Thứ tự học dành cho người mới

| Buổi | Mở file                       | Việc làm và tiêu chí hoàn thành                                 |
| ---- | ----------------------------- | --------------------------------------------------------------- |
| 1    | README, index.ejs, header.ejs | Chạy website, đổi tiêu đề/đoạn chữ, thấy thay đổi trong browser |
| 2    | site.css                      | Đổi màu/nút/khoảng cách; giải thích margin và padding           |
| 3    | site.css, work.ejs            | Quan sát 390px và desktop; giải thích grid/media query          |
| 4    | content.js, work.ejs          | Thêm một project mà không chép card HTML                        |
| 5    | contact.ejs                   | Phân biệt id/name/action/method; xem dữ liệu POST trong Network |
| 6    | server.js, app.js, routes     | Theo dõi GET /work từ URL tới HTML                              |
| 7    | controllers, service          | Nhập lỗi, xác định ai trả 422 và ai đặt lỗi theo trường         |
| 8    | repository, messages.js       | Gửi tin thử, đọc lại và hiểu INSERT/SELECT                      |
| 9    | security.js, test             | Đọc test CSRF/rate limit; giải thích vì sao cần nhiều lớp       |
| 10   | config, tài liệu triển khai   | Phân biệt local/production, secret, database, HTTPS             |

Trước buổi 4–8, học JS nền tảng: const/let, object, array, function, arrow function, require/module.exports, class, try/catch. Sau đó học Promise và async/await để chuẩn bị cho email/API/database bất đồng bộ.

## 22. Khi muốn sửa tính năng, tìm ở đâu?

| Muốn làm gì                 | Điểm bắt đầu                                                 |
| --------------------------- | ------------------------------------------------------------ |
| Đổi màu/khoảng cách/mobile  | public/css/site.css                                          |
| Đổi menu chung              | views/partials/header.ejs                                    |
| Thay thông tin dự án        | src/data/content.js                                          |
| Thay cấu trúc card          | views/pages/work.ejs                                         |
| Thêm một trang              | View mới + handler controller + route + menu nếu cần         |
| Đổi giới hạn tin nhắn       | ContactService + contact.ejs + test                          |
| Đổi cách lưu dữ liệu        | ContactRepository và nơi lắp dependency                      |
| Đổi cổng                    | .env, rồi restart                                            |
| Thêm tương tác không reload | Học browser JS; thêm public/js, dùng script src ngoài vì CSP |
| Đọc tin nhắn                | npm run messages                                             |

## 23. Buổi thực hành đầu tiên, khoảng 20 phút

1. Chạy npm run dev tại root dự án. Nếu một server đang chiếm cổng 3000, dừng server đó trước hoặc dùng cổng khác trong .env.
2. Mở content.js, đổi câu giới thiệu đầu tiên thành một câu của bạn. Refresh Home để xác nhận.
3. Thêm một project có status “Learning” và tags ['HTML', 'CSS']. Refresh Work để xác nhận có thêm card.
4. Mở site.css, thay --accent; xem vùng kêu gọi liên hệ trên Work.
5. Giải thích ba thao tác vừa rồi: dữ liệu nằm đâu, template ở đâu, style ở đâu?

Chỉ chuyển sang bài tiếp theo khi bạn giải thích được thay đổi của mình. Mục tiêu đầu tiên là đọc và sửa một luồng nhỏ có chủ đích, chưa phải nhớ mọi file.
