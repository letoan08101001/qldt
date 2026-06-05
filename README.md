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
- `js/storage.js`: lop luu tru server-only. Du lieu chi luu qua API `/api/data`, khong luu rieng theo may nguoi dung.
- `server.js`: server Node.js phuc vu web va API du lieu.
- `server.ps1`: server PowerShell tuong duong cho Windows.
- `app-data.json`: file du lieu dong duoc tao tu dong khi chay server.
- `data/app-data.example.json`: file du lieu mau de tham khao.

## API du lieu

- `GET /api/data`: doc toan bo du lieu.
- `PUT /api/data`: ghi toan bo du lieu.
- `DELETE /api/data`: xoa du lieu tren server va quay ve du lieu mau khi tai lai ung dung.

Du lieu trial va toan bo du lieu ung dung luu chung trong du lieu server.

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
- Install Command: de trong hoac `npm install`
- Root Directory: thu muc goc chua `index.html`

De du lieu dung chung tren Vercel:

1. Vao Vercel project.
2. Chon `Storage`.
3. Tao va ket noi `MongoDB` voi project.
4. Redeploy project.

`api/data.js` su dung MongoDB qua bien moi truong `MONGODB_URI` do Vercel Storage tao. Neu Vercel tao ten bien khac, API cung thu `MONGO_URL` va `DATABASE_URL`.

Mac dinh API luu vao database `qldt`, collection `app_data`, document `_id: "app-data"`. Co the doi bang bien moi truong:

- `MONGODB_DB`
- `MONGODB_COLLECTION`

Ung dung khong fallback ve `localStorage`, nen neu API/backend khong luu duoc thi thao tac luu se bao loi.
