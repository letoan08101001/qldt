# Luu du lieu khi dua len web

Ung dung hien tai su dung co che luu tru server-only qua API `/api/data`, khong luu du lieu rieng bang `localStorage` tren tung may.

De nhieu nguoi cung su dung chung du lieu tren web, can chay backend/API va luu vao database hoac file tren server. Co the dung cau truc trong `app-data.example.json` lam mau du lieu ban dau.

Goi y toi thieu:

- `accounts`: tai khoan nguoi dung. Khi dua len web khong luu mat khau ro, hay luu `passwordHash`.
- `categories`, `questions`, `specs`, `template`, `settings`: ngan hang cau hoi va cau hinh de thi.
- `savedExams`: cac de da tao va da luu theo so de.

Neu lam ban don gian, backend co cac API:

- `GET /api/data`: doc toan bo du lieu.
- `PUT /api/data`: luu toan bo du lieu sau khi admin thay doi.
- `POST /api/login`: dang nhap bang tai khoan trong `accounts`.

Neu nhieu nguoi cung sua du lieu cung luc, nen dung database nhu SQLite, PostgreSQL hoac MongoDB thay vi ghi truc tiep mot file JSON.
# Quan ly de thi

Ung dung quan ly de thi va van bang da duoc chuyen sang web dong co server noi bo.

## Chay ung dung bang PowerShell

Khong can cai them thu vien. Tren Windows, chay:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Sau do mo:

```text
http://localhost:3000
```

## Chay ung dung bang Node.js

Neu da cai Node.js 18 tro len:

```bash
npm start
```

Sau do mo:

```text
http://localhost:3000
```

Tai khoan mac dinh:

- Ten dang nhap: `admin`
- Mat khau: `admin123`

## Cau truc

- `index.html`: khung giao dien va cac man hinh.
- `css/styles.css`: giao dien, bo cuc in va ban xem truoc.
- `js/app.js`: logic dang nhap, tai khoan, cau hoi, tao de, in va xuat Word.
- `js/storage.js`: lop luu tru server-only. Khi chay qua server se goi API, khi mo file truc tiep se bao loi vi khong co du lieu chung.
- `server.js`: server Node.js phuc vu web va API du lieu.
- `server.ps1`: server PowerShell tuong duong cho Windows.
- `app-data.json`: file du lieu dong duoc tao tu dong khi chay server.
- `data/app-data.example.json`: file du lieu mau de tham khao.

## API du lieu

- `GET /api/data`: doc toan bo du lieu.
- `PUT /api/data`: ghi toan bo du lieu.
- `DELETE /api/data`: xoa du lieu tren server va quay ve du lieu mau khi tai lai ung dung.

## Bo de va dap an

- Moi bo de co cau hinh muc cau hoi, so luong de, de da luu va cau hoi da tron rieng.
- Truong `Dap an` trong form cau hoi duoc dung de in/xuat dap an theo tung cau hoi.
- Man hinh `Form dap an` cho phep chinh don vi ben trai, thong tin ben phai, tieu de va dinh dang chu.
- Nut `Xuat dap an` va `In dap an` trong man hinh tao de se tao dap an hang loat theo bo de dang chon. Phan don vi/thong tin tren cung chi hien mot lan, sau do lan luot la dap an cua tung de.

## Deploy Vercel

Vercel khong chay `server.js` dang long-running server. Du an da co `vercel.json` de route trang ve `index.html` va `api/data.js` de tranh loi `/api/data`.

Thiet lap tren Vercel:

- Framework Preset: `Other`
- Build Command: de trong
- Output Directory: de trong
- Install Command: `npm install`
- Root Directory: thu muc goc chua `index.html`

De du lieu dung chung tren Vercel, can tao va ket noi `Storage > MongoDB` voi project, sau do redeploy. `api/data.js` su dung MongoDB qua bien moi truong `MONGODB_URI`; neu Vercel tao ten bien khac, API cung thu `MONGO_URL` va `DATABASE_URL`. Ung dung khong fallback ve `localStorage`, nen neu API/backend khong luu duoc thi thao tac luu se bao loi.
