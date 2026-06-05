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
- `js/storage.js`: lop luu tru. Khi chay qua server se goi API, khi mo file truc tiep se dung `localStorage`.
- `server.js`: server Node.js phuc vu web va API du lieu.
- `server.ps1`: server PowerShell tuong duong cho Windows.
- `app-data.json`: file du lieu dong duoc tao tu dong khi chay server.
- `data/app-data.example.json`: file du lieu mau de tham khao.

## API du lieu

- `GET /api/data`: doc toan bo du lieu.
- `PUT /api/data`: ghi toan bo du lieu.
- `DELETE /api/data`: xoa du lieu tren server va quay ve du lieu mau khi tai lai ung dung.

Du lieu trial van luu tren trinh duyet theo may nguoi dung.

## Deploy Vercel

Vercel khong chay `server.js` dang long-running server. Du an da co `vercel.json` de route trang ve `index.html` va `api/data.js` de tranh loi `/api/data`.

Thiet lap tren Vercel:

- Framework Preset: `Other`
- Build Command: de trong
- Output Directory: de trong
- Install Command: de trong hoac `npm install`
- Root Directory: thu muc goc chua `index.html`

Neu muon du lieu dung chung va khong mat sau khi serverless ngu nguoi, can gan database ben ngoai nhu Vercel KV, Supabase hoac MongoDB. Ban hien tai co fallback ve `localStorage` de moi may van dung rieng duoc.
