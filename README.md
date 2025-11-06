# Website RW 02 Rangkah, Surabaya

Website resmi RW 02 Rangkah, Surabaya yang dibangun dengan Next.js, TypeScript, dan Tailwind CSS.

## 🚀 Fitur

- **Landing Page** dengan informasi RW
- **Sistem Pengumuman** untuk warga
- **Galeri Foto** kegiatan RW
- **Agenda Kegiatan** yang akan datang
- **Info Cuaca** real-time untuk wilayah Rangkah
- **Dashboard Admin** untuk mengelola konten
- **Sistem Autentikasi** dengan Supabase

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase
- **Icons:** React Icons
- **Charts:** Chart.js & React-Chartjs-2
- **Weather API:** OpenWeatherMap

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Git

## 🔧 Setup Development

### 1. Clone Repository

```bash
git clone https://github.com/username/rw02.git
cd rw02
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian isi file `.env` dengan API keys Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
```

#### Cara Mendapatkan API Keys:

**Supabase:**
1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Pergi ke Settings > API
4. Copy `Project URL` dan `anon/public key`

**OpenWeatherMap:**
1. Buat akun di [OpenWeatherMap](https://openweathermap.org)
2. Pergi ke API Keys
3. Generate API key baru

### 4. Setup Database (Supabase)

Buat tabel-tabel berikut di Supabase:

**Tabel: announcements**
```sql
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

**Tabel: articles**
```sql
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);
```

**Tabel: gallery**
```sql
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Tabel: agenda**
```sql
CREATE TABLE agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🌐 Deploy ke Vercel

### Cara Deploy:

1. **Push ke GitHub** (jika belum):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy ke Vercel:**
   - Buka [Vercel](https://vercel.com)
   - Login dengan akun GitHub
   - Klik "Add New Project"
   - Import repository GitHub Anda
   - Vercel akan otomatis mendeteksi Next.js

3. **Setup Environment Variables di Vercel:**
   - Di dashboard Vercel, pergi ke Settings > Environment Variables
   - Tambahkan semua environment variables dari file `.env`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_OPENWEATHER_API_KEY`

4. **Deploy:**
   - Klik "Deploy"
   - Tunggu proses build selesai
   - Website Anda akan live di `https://your-project.vercel.app`

### Auto Deploy

Setiap kali Anda push ke branch `main`, Vercel akan otomatis rebuild dan deploy website Anda.

## 📁 Struktur Project

```
rw02/
├── public/              # Static files
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── component/      # React components
│   │   ├── admin/     # Admin dashboard components
│   │   └── landing-page/ # Landing page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions & configs
│   └── styles/        # Global styles
├── .env.example       # Template environment variables
├── .gitignore        # Git ignore rules
├── next.config.ts    # Next.js configuration
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript configuration
```

## 🔐 Keamanan

**PENTING:** 
- ❌ **JANGAN** commit file `.env` ke GitHub
- ✅ File `.env` sudah ada di `.gitignore`
- ✅ Gunakan `.env.example` sebagai template
- ✅ Setup environment variables di Vercel untuk production

## 📝 Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build untuk production
npm run start    # Jalankan production server
npm run lint     # Jalankan ESLint
```

## 🤝 Contributing

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 License

[MIT License](LICENSE)

## 👥 Contact

Untuk pertanyaan atau saran, silakan hubungi pengurus RW 02 Rangkah.

---

Dibuat dengan ❤️ untuk warga RW 02 Rangkah, Surabaya
