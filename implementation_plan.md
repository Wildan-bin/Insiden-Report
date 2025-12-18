# Website Pelaporan Insiden - Implementation Plan

Membangun website pelaporan insiden dengan fitur registrasi, login, dan dashboard untuk mengelola laporan insiden. Menggunakan React + Vite untuk frontend, Express.js untuk backend, SQLite untuk database, dan Tailwind CSS untuk styling.

## User Review Required

> [!IMPORTANT]
> Website ini akan menggunakan arsitektur fullstack dengan:
> - **Frontend**: React + Vite + Tailwind CSS
> - **Backend**: Express.js + SQLite
> - **Authentication**: Session-based dengan bcrypt untuk password hashing
> 
> Kedua server (frontend dev server dan backend API) akan berjalan secara terpisah:
> - Frontend: `http://localhost:5173`
> - Backend API: `http://localhost:3000`

> [!NOTE]
> Password akan di-hash menggunakan bcrypt untuk keamanan. Session akan disimpan dalam memory (untuk development).

## Proposed Changes

### Backend Server

#### [NEW] [server.js](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/server.js)
- Express.js server dengan API endpoints:
  - `POST /api/register` - Registrasi user baru
  - `POST /api/login` - Login user
  - `POST /api/logout` - Logout user
  - `GET /api/incidents` - Ambil semua laporan insiden user
  - `POST /api/incidents` - Submit laporan insiden baru
- CORS configuration untuk komunikasi dengan frontend
- Session management untuk authentication
- SQLite database initialization

#### [NEW] [package.json](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/package.json)
- Dependencies untuk backend dan frontend:
  - Backend: express, sqlite3, bcrypt, cors, express-session
  - Frontend: react, react-dom, react-router-dom
  - Dev: vite, tailwindcss, postcss, autoprefixer

---

### Frontend Application

#### [NEW] [index.html](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/index.html)
- HTML template utama untuk React app
- Link ke Tailwind CSS dan Google Fonts

#### [NEW] [src/main.jsx](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/main.jsx)
- Entry point React application
- Setup React Router

#### [NEW] [src/App.jsx](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/App.jsx)
- Main app component dengan routing
- Protected routes untuk dashboard

#### [NEW] [src/index.css](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/index.css)
- Tailwind CSS imports
- Custom CSS variables dan utilities
- Design system dengan modern aesthetics

---

### Authentication Pages

#### [NEW] [src/pages/Register.jsx](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/pages/Register.jsx)
- Form registrasi dengan username dan password
- Validasi input
- Redirect ke login setelah sukses

#### [NEW] [src/pages/Login.jsx](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/pages/Login.jsx)
- Form login dengan username dan password
- Error handling
- Redirect ke dashboard setelah sukses

---

### Dashboard

#### [NEW] [src/pages/Dashboard.jsx](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/src/pages/Dashboard.jsx)
- Tampilan daftar laporan insiden user
- Tombol untuk membuka modal form pelaporan
- Modal form dengan fields: tanggal, kategori, narasi
- Success/error message setelah submit
- Tombol logout

---

### Configuration Files

#### [NEW] [vite.config.js](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/vite.config.js)
- Vite configuration untuk React
- Proxy setup untuk API calls ke backend

#### [NEW] [tailwind.config.js](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/tailwind.config.js)
- Tailwind CSS configuration
- Custom colors dan theme

#### [NEW] [postcss.config.js](file:///d:/ASUS/F/KULIAH-FILE/Insiden-report/postcss.config.js)
- PostCSS configuration untuk Tailwind

## Verification Plan

### Automated Tests
```bash
# Install dependencies
npm install

# Run backend server (terminal 1)
node server.js

# Run frontend dev server (terminal 2)
npm run dev
```

### Manual Verification
1. **Test Registrasi**: Buka browser ke `http://localhost:5173`, klik "Register", isi form dan submit
2. **Test Login**: Login dengan credentials yang baru dibuat
3. **Test Dashboard**: Verifikasi dashboard tampil dengan tombol "Laporkan Insiden"
4. **Test Submit Laporan**: Klik tombol, isi form modal, submit, dan verifikasi success message
5. **Test Tampilan Laporan**: Verifikasi laporan baru muncul di dashboard
6. **Test Logout**: Klik logout dan verifikasi redirect ke login page
