# Quản lý đề thi

Ứng dụng đã được tách thành các phần riêng để dễ bảo trì:

- `index.html`: khung giao diện và các màn hình.
- `css/styles.css`: toàn bộ giao diện, hiệu ứng, bố cục in và bản xem trước.
- `js/storage.js`: phân vùng/lớp lưu trữ dữ liệu trên trình duyệt.
- `js/app.js`: logic đăng nhập, tài khoản, câu hỏi, tạo đề, in và xuất Word.

Tài khoản mặc định:

- Tên đăng nhập: `admin`
- Mật khẩu: `admin123`

Dữ liệu hiện lưu trong `localStorage` của trình duyệt qua khóa `exam_manager_v1`.
