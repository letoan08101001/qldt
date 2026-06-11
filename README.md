
## Deploy len Vercel

Thiet lap project:

- Framework Preset: `Other`
- Build Command: de trong
- Output Directory: de trong
- Install Command: `npm install`
- Root Directory: thu muc chua `index.html`

Thiet lap database:

1. Vao Vercel project.
2. Chon `Storage`.
3. Tao hoac ket noi MongoDB.
4. Dam bao project co bien moi truong `MONGODB_URI`.
5. Redeploy.

API cung chap nhan cac ten bien sau neu can:

- `MONGO_URL`
- `DATABASE_URL`

Tuy chon cau hinh collection:

- `MONGODB_DB`, mac dinh `qldt`
- `MONGODB_COLLECTION`, mac dinh `app_data`

## Chay local

Local cung dung MongoDB, giong production:

```bash
npm install
set MONGODB_URI=mongodb+srv://...
npm start
```

Sau do mo:

```text
http://localhost:3000
```

Tai khoan mac dinh khi database chua co du lieu:

- Ten dang nhap: `admin`
- Mat khau: `admin123`

## API

- `GET /api/data`: doc toan bo du lieu ung dung.
- `PUT /api/data`: ghi toan bo du lieu ung dung.
- `DELETE /api/data`: xoa document du lieu, lan tai sau app se khoi tao du lieu mau.

## Ghi chu deploy

`.vercelignore` loai cac file demo/dev-only khoi goi deploy. Vercel se phuc vu file giao dien va route `/api/data` bang serverless function.
