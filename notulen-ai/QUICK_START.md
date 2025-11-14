# 🚀 Quick Start Guide - Notulen AI

Panduan cepat untuk menjalankan aplikasi Notulen AI dalam 5 menit!

## ⚡ Super Quick Start

```bash
# 1. Clone/Download project
cd notulen-ai

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env dan tambahkan OPENAI_API_KEY
npm start

# 3. Setup Frontend (terminal baru)
cd frontend
npm install
npm run dev

# 4. Buka browser: http://localhost:3000
```

## 📋 Prerequisites

Install terlebih dahulu:
- [Node.js 18+](https://nodejs.org/)
- [FFmpeg](https://ffmpeg.org/) (optional, untuk video processing)

### Install FFmpeg

**Windows:**
1. Download dari https://ffmpeg.org/download.html
2. Extract dan tambahkan ke PATH

**Mac:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🔑 Dapatkan API Key (PENTING!)

Anda perlu API key dari salah satu provider:

### Option 1: OpenAI (Recommended)

1. Buka https://platform.openai.com/api-keys
2. Login/Sign up
3. Klik "Create new secret key"
4. Copy key (simpan baik-baik, hanya tampil sekali!)
5. Top up minimal $5 di https://platform.openai.com/account/billing

**Biaya:**
- Whisper: $0.006/menit audio
- GPT-4: ~$0.03/1K tokens
- Estimasi: $5-10/bulan untuk usage ringan

### Option 2: Google Gemini (Gratis!)

1. Buka https://makersuite.google.com/app/apikey
2. Login dengan Google
3. Klik "Get API Key"
4. Copy key

**Catatan:** Gemini gratis tapi fitur transkripsi masih experimental.

### Option 3: Deepgram (Free tier bagus)

1. Buka https://console.deepgram.com/
2. Sign up
3. Copy API key dari dashboard

**Free tier:** 12,000 menit/tahun (1,000 menit/bulan)

## 🏃 Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan text editor favorit Anda
nano .env
# atau
code .env
# atau
notepad .env
```

**Edit file `.env`:**

```env
PORT=5000
NODE_ENV=development

# Pilih SALAH SATU provider dan paste API key:

# Option 1: OpenAI (Recommended)
OPENAI_API_KEY=sk-your-actual-key-here
AI_PROVIDER=openai

# Option 2: Gemini
# GEMINI_API_KEY=your-gemini-key-here
# AI_PROVIDER=gemini

# Option 3: Deepgram
# DEEPGRAM_API_KEY=your-deepgram-key-here
# AI_PROVIDER=deepgram

CORS_ORIGIN=http://localhost:3000
```

**Jalankan backend:**

```bash
npm start
```

Anda akan melihat:
```
🚀 Notulen AI API Server running on port 5000
📝 Environment: development
🤖 AI Provider: openai
🌐 CORS Origin: http://localhost:3000
```

### 2. Frontend Setup (Terminal Baru)

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# (Optional) Buat .env jika backend di URL lain
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Jalankan development server
npm run dev
```

Anda akan melihat:
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 3. Buka Aplikasi

Buka browser dan akses: **http://localhost:3000**

## ✅ Verifikasi Installation

### Test Backend

Buka terminal baru:

```bash
# Health check
curl http://localhost:5000/api/health
```

Harusnya return:
```json
{
  "status": "OK",
  "timestamp": "2024-11-14T...",
  "uptime": 123.45
}
```

### Test Frontend

1. Buka http://localhost:3000
2. Pastikan UI tampil dengan baik
3. Toggle dark mode (icon bulan/matahari)
4. Coba klik "Mulai Rekam" - browser akan minta izin akses mikrofon

## 🎮 Cara Menggunakan

### Metode 1: Rekam Audio

1. Klik tombol "Mulai Rekam"
2. Browser akan minta izin mikrofon - klik "Allow"
3. Berbicara ke mikrofon
4. Klik "Stop" jika selesai
5. Klik "Download" untuk save, atau lanjut ke proses

### Metode 2: Upload File

1. Drag & drop file audio/video ke area upload
   - Atau klik "Pilih File"
2. File yang didukung: MP3, WAV, M4A, MP4, MOV
3. Maksimal 500MB

### Proses Transkripsi & Notulen

1. Setelah ada rekaman atau file terupload
2. Pilih pengaturan:
   - **Gaya:** Formal / Santai / Ringkas / Detail
   - **Bahasa:** Indonesia / English
3. Klik "Mulai Proses"
4. Tunggu (bisa 1-5 menit tergantung durasi audio)
5. Hasil transkrip dan notulen akan muncul!

### Export Hasil

Setelah notulen jadi:
- **Download PDF** - Format profesional
- **Download DOCX** - Bisa diedit di Word
- **Download TXT** - Plain text
- **Copy** - Copy ke clipboard
- **Share** - Bagikan via apps lain

### Lihat History

- Panel kanan menampilkan history semua rapat
- Klik untuk membuka rapat sebelumnya
- Download ulang atau delete jika tidak diperlukan

## 🐛 Troubleshooting Cepat

### "Cannot access mikrofon"

**Solusi:**
- Pastikan menggunakan `http://localhost` (bukan IP address)
- Atau deploy dengan HTTPS
- Check browser permission untuk mikrofon
- Coba browser lain (Chrome recommended)

### "API Error" atau "Network Error"

**Solusi:**
```bash
# Check backend masih jalan
curl http://localhost:5000/api/health

# Kalau tidak jalan, restart backend:
cd backend
npm start
```

### "Transcription failed"

**Solusi:**
1. Check API key sudah benar di `.env`
2. Check API key masih valid (login ke dashboard provider)
3. Check saldo/quota mencukupi (OpenAI butuh top up)
4. Check file format didukung

### Port sudah dipakai

```bash
# Jika port 5000 atau 3000 sudah dipakai, ganti di:

# Backend - edit .env:
PORT=5001

# Frontend - edit vite.config.js:
server: {
  port: 3001
}
```

### "FFmpeg not found"

**Solusi:**
- Install FFmpeg (lihat bagian Prerequisites)
- Atau disable fitur video (hanya gunakan audio)

## 💡 Tips

1. **Rekaman Berkualitas:**
   - Gunakan ruangan tenang
   - Mikrofon dekat dengan speaker
   - Bicara dengan jelas

2. **Hemat Biaya API:**
   - Kompres audio sebelum upload
   - Gunakan kualitas audio standar (tidak perlu high quality)
   - Potong bagian silent di awal/akhir

3. **Notulen Lebih Baik:**
   - Sebutkan nama di awal: "Saya Budi..."
   - Sebutkan action items dengan jelas: "Budi akan selesaikan X sampai Jumat"
   - Akhiri dengan summary

## 📚 Next Steps

- Baca [README.md](README.md) untuk dokumentasi lengkap
- Baca [DEPLOYMENT.md](DEPLOYMENT.md) untuk deploy ke production
- Baca [API_DOCUMENTATION.md](API_DOCUMENTATION.md) untuk integrasi API

## 🆘 Butuh Bantuan?

- Check [README.md](README.md) - Troubleshooting section
- Open issue di GitHub
- Email: support@example.com

---

**Selamat mencoba! 🎉**

Kalau ada error, jangan panik - check troubleshooting atau hubungi kami.
