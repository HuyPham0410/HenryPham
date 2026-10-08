# Tích hợp cách chạy từ mẫu NiceFit

Phạm vi bạn chọn: chỉ cấu trúc server, EJS và cách chạy. Không chuyển sang MySQL, không thêm đăng nhập/Passport. NiceFit gốc không được sửa và .env của NiceFit không được copy.

## Những gì tương thích

| Mẫu NiceFit                     | Website cá nhân sau chỉnh sửa                                            |
| ------------------------------- | ------------------------------------------------------------------------ |
| type: commonjs                  | Dùng CommonJS xuyên suốt app, scripts và test                            |
| require(...) / module.exports   | Cùng cú pháp, giữ tách Controller/Service/Repository                     |
| server.js ở root                | Có server.js ở root nạp dotenv rồi gọi src/server.js                     |
| npm run dev → nodemon server.js | Cùng lệnh; nodemon.json bổ sung cờ SQLite và danh sách theo dõi          |
| dotenv đọc .env                 | Đọc .env tại root dự án; env do hệ điều hành cấp vẫn được ưu tiên        |
| Express + EJS                   | Giữ ba trang cá nhân, partials, form và CSS hiện có                      |
| public để chứa tài nguyên       | Giữ public; URL asset vẫn là /assets/... để liên kết hiện tại không hỏng |

Không bắt buộc copy cùng mọi phiên bản package mới tương thích. Giữ các phiên bản của app đã kiểm thử và cập nhật package-lock.json phù hợp với dependency mới. Cần Node >=22.12 vì app vẫn dùng node:sqlite; NiceFit không có ràng buộc SQLite này.

## Các file mẫu không áp dụng

- passport-config.js: phục vụ authentication, nằm ngoài phạm vi bạn chọn.
- CS3773projectDBv1.sql: schema bán hàng; không import vào portfolio hoặc database đang có.
- .env NiceFit: chỉ đọc tên biến để đối chiếu, không sao chép giá trị/secret.
- .DS_Store: metadata Finder trên macOS, không cần cho website; đã thêm vào gitignore.
- pnpm-lock.yaml, pnpm-workspace.yaml: cấu hình dependency của project NiceFit, không copy lockfile khác project. Bản cá nhân dùng npm và package-lock.json.
- bcrypt, passport, express-session, mysql2, express-flash, method-override: không cài vì portfolio hiện không dùng các chức năng tương ứng.

## Vì sao vẫn có src/server.js?

Root server.js chỉ làm bootstrap — đọc môi trường trước khi nạp app. src/server.js quản lý mở cổng và đóng database. app.js giữ việc lắp Express; routes/controllers/services/repositories giữ các trách nhiệm riêng để bạn dễ học và test. Không dồn toàn bộ nội dung về một file server.js dài như mẫu bán hàng.

```text
npm run dev
→ nodemon server.js
→ dotenv đọc .env
→ require('./src/server')
→ loadConfig → ContactRepository → createApp → listen
```

## Khác biệt cú pháp bạn sẽ nhìn thấy

Trước:

```js
import { ContactService } from "./services/ContactService.js";
export class ContactController {
  /* ... */
}
```

Sau:

```js
const { ContactService } = require("./services/ContactService.js");
class ContactController {
  /* ... */
}
module.exports = { ContactController };
```

Class và trách nhiệm OOP không thay đổi. Chỉ cách module xuất/nhận dữ liệu được đổi sang phong cách bạn đã dùng ở NiceFit.

## Chạy trên máy của bạn

Mở terminal tại thư mục HenryPham chứa package.json:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Nếu đã có .env của portfolio, giữ file đó, không copy đè. Không dùng .env của NiceFit. Mở http://127.0.0.1:3000. Nếu NiceFit hoặc bản server trước đang chiếm cổng 3000, dừng server đó hoặc đặt PORT=3001 trong .env portfolio và mở cổng mới.

Kiểm tra: npm test. Đọc tin nhắn: npm run messages. Chạy không watch: npm start. Cờ SQLite đã có trong npm scripts/nodemon.json; với Node 22.12 đừng thay bằng lệnh node server.js thiếu cờ.

## Chưa thay đổi

Giao diện Home/Work/Contact, URL cũ chuyển hướng, CSRF, validation, rate limit và SQLite tiếp tục hoạt động. Không cần đổi schema hoặc chuyển dữ liệu tin nhắn. Tài liệu học đã cập nhật cú pháp CommonJS.

## Dependency phát triển

Lần kiểm tra này, audit runtime (`npm audit --omit=dev`) không báo lỗ hổng. Audit toàn bộ báo 3 mục high liên quan cùng advisory GHSA-vfj7-8cjw-p6xm trong chuỗi nodemon/chokidar/braces. Nodemon chỉ dùng development, theo dõi đường dẫn cấu hình local. Không lấy glob theo dõi từ dữ liệu khách gửi. Khi triển khai, dùng `npm ci --omit=dev` và `npm start`; không dùng nodemon. Cần kiểm tra cập nhật dependency định kỳ, không tự chạy `npm audit fix --force` vì đề xuất hiện tại hạ nodemon về bản cũ không phù hợp.
