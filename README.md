# 📝 Sistem Aplikasi CMS Blog

**CMS Blog Application - Kelompok 8**

## 👨‍💻 Tim Pengembang

Proyek ini dikembangkan oleh **Kelompok 8** yang terdiri dari:

| NIM    | Nama Lengkap         |
| ------ | -------------------- |
| 222279 | Riswanda Alfarizi 😁 |

## 🛠️ Teknologi yang Digunakan

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge&logo=multer&logoColor=white)

## 📝 Deskripsi Proyek

CMS Blog adalah aplikasi web fullstack yang menangani semua aspek pengelolaan blog, mulai dari pembuatan artikel hingga manajemen konten. Aplikasi ini dirancang dengan arsitektur modern yang memisahkan frontend dan backend, memberikan user experience yang responsif dan performa tinggi dengan implementasi caching menggunakan Redis.

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi

### 📝 Manajemen Artikel

### 👥 Manajemen Pengguna

### 🏷️ Sistem Kategori & Tag

### 💬 Sistem Komentar

## 📋 Prerequisites

Pastikan sistem Anda memiliki:

- **Node.js** v16 atau lebih baru
- **MongoDB** (local atau cloud)
- **Redis** server
- **npm** atau **yarn** package manager

## 🚀 Instalasi dan Penggunaan

### 1. Clone Repository

```bash
git clone https://github.com/amrylil/blog-cms-app.git
cd blog-cms-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

### 4. Seed Database

Jalankan perintah berikut untuk mengisi database dengan data sampel:

```bash
node apps/backend/seedAll.js
```

### 5. Jalankan Aplikasi

**Development Mode:**

```bash
npm run dev
```

- **Frontend** akan berjalan di `http://localhost:5173`
- **Backend API** akan berjalan di `http://localhost:5000`

## 📁 Struktur Proyek

```
BLOG_CMS_APP/
├── api/                    # Backend API (Server-side)
│   ├── src/                # Source code backend
│   │   ├── config/         # Database & Redis configuration
│   │   ├── controllers/    # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── articleController.js
│   │   │   ├── categoryController.js
│   │   │   ├── commentController.js
│   │   │   ├── tagController.js
│   │   │   └── userController.js
│   │   ├── dtos/           # Data Transfer Objects
│   │   ├── helpers/        # Helper functions
│   │   ├── middlewares/    # Express middlewares
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── validation.js
│   │   ├── models/         # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Article.js
│   │   │   ├── Category.js
│   │   │   ├── Comment.js
│   │   │   └── Tag.js
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js
│   │   │   ├── articles.js
│   │   │   ├── categories.js
│   │   │   ├── comments.js
│   │   │   ├── tags.js
│   │   │   └── users.js
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── uploads/            # Uploaded files
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── seedAll.js          # Database seeder
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
├── view/                   # Frontend React App (Client-side)
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   │   ├── common/     # Common components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── forms/      # Form components
│   │   │   └── ui/         # UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── blog/       # Blog pages
│   │   │   └── profile/    # Profile pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── contexts/       # React contexts
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/logout` - Logout pengguna
- `GET /api/auth/me` - Get current user

### Articles

- `GET /api/articles` - Mendapatkan daftar artikel
- `GET /api/articles/:id` - Detail artikel
- `POST /api/articles` - Membuat artikel baru
- `PUT /api/articles/:id` - Update artikel
- `DELETE /api/articles/:id` - Hapus artikel
- `GET /api/articles/search` - Pencarian artikel

### Categories

- `GET /api/categories` - Mendapatkan daftar kategori
- `POST /api/categories` - Membuat kategori baru
- `PUT /api/categories/:id` - Update kategori
- `DELETE /api/categories/:id` - Hapus kategori

### Tags

- `GET /api/tags` - Mendapatkan daftar tag
- `POST /api/tags` - Membuat tag baru
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Hapus tag

### Comments

- `GET /api/comments` - Mendapatkan daftar komentar
- `POST /api/comments` - Membuat komentar baru
- `PUT /api/comments/:id` - Update komentar
- `DELETE /api/comments/:id` - Hapus komentar

### Users

- `GET /api/users` - Mendapatkan daftar pengguna (admin only)
- `GET /api/users/:id` - Detail pengguna
- `PUT /api/users/:id` - Update pengguna
- `DELETE /api/users/:id` - Hapus pengguna

## 🎨 Komponen Frontend Utama

### Layout Components

- Header dengan navigasi
- Sidebar untuk admin
- Footer
- Breadcrumb

### Blog Components

- Article list dengan pagination
- Article detail dengan komentar
- Category sidebar
- Tag cloud
- Search form
- Featured articles

### Admin Components

- Dashboard dengan statistik
- Article editor dengan rich text
- User management
- Category management
- Comment moderation

## 🚀 Fitur Lanjutan

### SEO Optimization

- Meta tags dinamis
- Open Graph tags
- Sitemap generation
- Schema markup

### Performance

- Redis caching untuk artikel populer
- Image optimization
- Lazy loading
- CDN integration

### Security

- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## 🤝 Kontribusi

Proyek ini dikembangkan sebagai tugas akademik oleh **Kelompok 8**. Kontribusi dari semua anggota tim sangat dihargai untuk pengembangan dan perbaikan sistem.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik dan pembelajaran. Semua hak cipta dimiliki oleh anggota **Kelompok 8**.

## 📞 Kontak

Untuk pertanyaan atau dukungan teknis, silakan hubungi salah satu anggota tim pengembang.

---

**© 2025 Kelompok 8 - CMS Blog Application**

_Dibuat dengan ❤️ menggunakan React, Express.js, MongoDB, dan Redis_
