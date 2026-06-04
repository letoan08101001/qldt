# Luu du lieu khi dua len web

Ung dung hien tai la web tinh va dang luu du lieu bang `localStorage`, nen moi may/tai khoan trinh duyet se co mot bo du lieu rieng.

De nhieu nguoi cung su dung chung du lieu tren web, can them backend/API va luu vao database hoac file tren server. Co the dung cau truc trong `app-data.example.json` lam mau du lieu ban dau.

Goi y toi thieu:

- `accounts`: tai khoan nguoi dung. Khi dua len web khong luu mat khau ro, hay luu `passwordHash`.
- `categories`, `questions`, `specs`, `template`, `settings`: ngan hang cau hoi va cau hinh de thi.
- `savedExams`: cac de da tao va da luu theo so de.

Neu lam ban don gian, backend co cac API:

- `GET /api/data`: doc toan bo du lieu.
- `PUT /api/data`: luu toan bo du lieu sau khi admin thay doi.
- `POST /api/login`: dang nhap bang tai khoan trong `accounts`.

Neu nhieu nguoi cung sua du lieu cung luc, nen dung database nhu SQLite, PostgreSQL hoac MongoDB thay vi ghi truc tiep mot file JSON.
