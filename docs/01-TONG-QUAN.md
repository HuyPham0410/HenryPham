# Tổng sơ lược và quyết định thiết kế

## Bản gốc

| Vị trí                                           | Vai trò / vấn đề quan sát được                                      |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `index.html`, `work.html`, `contact.html`        | Trang tĩnh đặt ở root; menu, head và script lặp lại                 |
| `work.html`                                      | Hai tài liệu HTML nối tiếp trong cùng một file                      |
| `contact.html`                                   | Form chưa có method/action; input chưa có name; chưa có backend     |
| `assets/CSS`, `assets/CSS/css`                   | Nhiều bản Bootstrap và Style.css; khó biết bản nào đang có hiệu lực |
| `assets/js`, `assets/CSS/js`                     | Bootstrap trùng; jQuery và plugin giao diện cũ                      |
| `assets/fonts`, `assets/CSS/fonts`               | Font trùng và phần tài nguyên không cần cho cấu trúc mới            |
| `Style.css` ở root                               | Thêm một bản style riêng                                            |
| `Gemfile`, `_config.yml`, `_posts`, `*.markdown` | Bộ khung Jekyll/Ruby đi kèm HTML tĩnh                               |
| `.github/workflows/jekyll.yml`, `jekyll.yml`     | Cấu hình xuất bản Jekyll, không chạy được Express server            |
| `.git`, `_notes`                                 | Lịch sử Git và metadata công cụ soạn thảo                           |

Các file tài liệu/cấu hình trong ZIP được xem là dữ liệu nguồn để khảo sát, không phải yêu cầu mới từ bạn. Không thực thi script hoặc workflow trong ZIP.

## Bản mới

- `index.html` → `src/views/pages/index.ejs`, đường dẫn `/`.
- `work.html` → `src/views/pages/work.ejs`, đường dẫn `/work`.
- `contact.html` → `src/views/pages/contact.ejs`, đường dẫn `/contact`.
- URL `.html` cũ chuyển hướng 301 sang URL mới.
- Header/footer được include dùng chung; dữ liệu portfolio tách khỏi template.
- HTML cấu trúc lại; bỏ menu overlay và slideshow cũ, dùng điều hướng luôn nhìn thấy, màu trung tính/xanh, ảnh chân dung và bố cục responsive.
- Chỉ mang ảnh đang sử dụng vào public. Các ảnh còn lại và toàn bộ nội dung gốc vẫn nằm trong ZIP gốc của bạn.
- Bản mới không mang `.git`, workflow Jekyll, Gemfile hay thư viện frontend cũ. Không sửa lịch sử repository gốc.

## Tại sao không chỉ đổi đuôi file?

EJS là template engine, không tự tạo kiến trúc OOP. OOP ở đây là `ContactController`, `ContactService`, `ContactRepository`: mỗi đối tượng có một nhiệm vụ. `app.js` tạo và nối các đối tượng với nhau. Không cần ép mọi hàm thành class hoặc thêm kế thừa khi chưa có nhu cầu.

Đây là nền tảng một server nhỏ. Database đồng bộ và rate limit trong bộ nhớ phù hợp học tập/traffic nhỏ, cần thay đổi khi mở rộng nhiều tiến trình hoặc nhiều máy.
