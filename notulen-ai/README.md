# Notulen AI - Aplikasi Notulen Rapat Otomatis

Aplikasi web modern untuk membuat notulen rapat secara otomatis menggunakan AI. Mendukung rekam audio real-time, upload file audio/video, transkripsi otomatis, dan pembuatan notulen terstruktur.

## ✨ Fitur Utama

### 🎙️ Rekam Audio Rapat
- Rekam audio langsung dari browser menggunakan MediaRecorder API
- Kontrol lengkap: Start, Pause, Resume, Stop
- Indikator durasi real-time
- Preview dan download hasil rekaman
- Support format WebM dengan codec Opus

### 📤 Upload File Audio & Video
- Drag & drop atau pilih file
- Support format: MP3, WAV, M4A, MP4, MOV
- Ekstraksi audio otomatis dari video
- Maksimal ukuran file: 500MB
- Progress indicator saat upload

### 🤖 Transkripsi Otomatis
- Integrasi dengan multiple AI providers:
  - OpenAI Whisper (default)
  - Google Gemini
  - Deepgram
- Auto paragraph dan punctuation
- Support bahasa Indonesia dan Inggris
- Option untuk include timestamps

### 📝 Pembuatan Notulen AI
- Generate notulen terstruktur otomatis
- Format lengkap:
  - Judul rapat
  - Tanggal & waktu
  - Daftar peserta
  - Pembahasan utama
  - Keputusan rapat
  - Action items (dengan PIC & deadline)
  - Ringkasan 5 poin penting
- Multiple style options:
  - Formal
  - Santai/Casual
  - Very Short
  - Detailed

### 💾 Export & Share
- Export ke PDF (dengan jsPDF)
- Export ke DOCX (dengan docx library)
- Export ke TXT
- Copy to clipboard
- Share via native Web Share API
- Template format profesional

### 📚 History & Storage
- Simpan history rapat di localStorage
- Lihat dan kelola rapat sebelumnya
- Quick access untuk download ulang
- Delete rapat yang tidak diperlukan

### 🎨 UI/UX Modern
- Design clean dengan Tailwind CSS
- Dark mode support
- Responsive design (mobile-friendly)
- Smooth animations & transitions
- Accessible components

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **jsPDF** - PDF generation
- **docx** - DOCX generation
- **Axios** - HTTP client
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **OpenAI API** - Whisper & GPT integration
- **FFmpeg** - Video/audio processing
- **CORS** - Cross-origin support

## 📁 Struktur Folder

```
notulen-ai/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecordAudio.jsx        # Komponen rekam audio
│   │   │   ├── UploadFile.jsx         # Komponen upload file
│   │   │   ├── ProcessingControls.jsx # Kontrol pemrosesan
│   │   │   ├── TranscriptView.jsx     # Tampilan transkrip
│   │   │   ├── MinutesView.jsx        # Tampilan notulen
│   │   │   └── HistoryView.jsx        # Tampilan history
│   │   ├── contexts/
│   │   │   └── AppContext.jsx         # Global state management
│   │   ├── services/
│   │   │   └── api.js                 # API service layer
│   │   ├── utils/
│   │   │   ├── audioRecorder.js       # Audio recorder utility
│   │   │   └── exportUtils.js         # Export utilities (PDF/DOCX/TXT)
│   │   ├── App.jsx                    # Main app component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── routes/
│   │   ├── transcription.js           # Transcription routes
│   │   └── minutes.js                 # Minutes generation routes
│   ├── services/
│   │   ├── transcriptionService.js    # AI transcription service
│   │   └── minutesService.js          # AI minutes generation
│   ├── utils/
│   │   └── fileUtils.js               # File utilities
│   ├── uploads/                       # Uploaded files (gitignored)
│   ├── server.js                      # Express server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── README.md

```

## 🚀 Cara Install & Menjalankan

### Prerequisites
- Node.js 18+ dan npm/yarn
- FFmpeg (untuk ekstraksi audio dari video)
- API Key untuk salah satu provider AI:
  - OpenAI API Key (recommended)
  - Google Gemini API Key
  - Deepgram API Key

### 1. Clone/Download Proyek

```bash
# Jika dari git
git clone <repository-url>
cd notulen-ai

# Atau jika download ZIP
unzip notulen-ai.zip
cd notulen-ai
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy dan edit environment variables
cp .env.example .env
nano .env  # atau gunakan text editor lain
```

Edit file `.env` dan isi dengan API key Anda:

```env
PORT=5000
NODE_ENV=development

# Pilih salah satu AI provider
OPENAI_API_KEY=sk-your-openai-key-here
# GEMINI_API_KEY=your-gemini-key-here
# DEEPGRAM_API_KEY=your-deepgram-key-here

CORS_ORIGIN=http://localhost:3000
AI_PROVIDER=openai
```

**Cara Mendapatkan API Key:**

- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **Deepgram**: https://console.deepgram.com/

```bash
# Jalankan backend server
npm start

# Atau untuk development dengan auto-reload
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Buat file .env (optional, jika backend di URL lain)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

Buka browser dan akses: `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-11-14T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. Transcribe Audio
```
POST /api/transcribe
Content-Type: multipart/form-data
```

Request Body:
- `audio`: File (audio/video file)
- `language`: String (optional, default: "id")
- `includeTimestamps`: Boolean (optional, default: false)

Response:
```json
{
  "success": true,
  "text": "Transkrip hasil...",
  "transcript": "Transkrip hasil...",
  "language": "id",
  "duration": 125.5
}
```

### 3. Generate Minutes
```
POST /api/generate-minutes
Content-Type: application/json
```

Request Body:
```json
{
  "transcript": "Teks transkrip rapat...",
  "options": {
    "style": "formal",
    "language": "id",
    "includeTimestamps": false
  }
}
```

Response:
```json
{
  "success": true,
  "title": "Judul Rapat",
  "date": "14 November 2024",
  "time": "10:30",
  "participants": ["Nama 1", "Nama 2"],
  "summary": "Ringkasan rapat...",
  "mainPoints": ["Poin 1", "Poin 2"],
  "decisions": ["Keputusan 1"],
  "actionItems": [
    {
      "task": "Tugas yang harus dilakukan",
      "pic": "Nama PIC",
      "deadline": "20 Nov 2024"
    }
  ],
  "keyPoints": ["Poin penting 1", "..."]
}
```

### 4. Extract Audio from Video
```
POST /api/extract-audio
Content-Type: multipart/form-data
```

Request Body:
- `video`: File (video file)

Response:
```json
{
  "success": true,
  "audioPath": "/path/to/audio.mp3",
  "duration": 125.5,
  "format": "mp3"
}
```

## 🌐 Deployment Guide

### Deploy ke Vercel

#### Frontend (Vercel)

1. Push code ke GitHub

2. Login ke Vercel dan import repository

3. Configure project:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

5. Deploy!

#### Backend (Vercel Serverless)

Buat file `vercel.json` di folder backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

Deploy:
1. Login ke Vercel
2. Import backend folder
3. Add environment variables (API keys, dll)
4. Deploy

**Note**: Vercel Serverless memiliki limit 50MB untuk body request. Untuk file besar, gunakan Railway atau Render.

### Deploy Backend ke Railway

1. Login ke https://railway.app

2. New Project → Deploy from GitHub

3. Select backend folder

4. Add Environment Variables di Railway dashboard

5. Railway akan auto-deploy

### Deploy Backend ke Render

1. Login ke https://render.com

2. New → Web Service

3. Connect repository dan pilih backend folder

4. Configure:
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`

5. Add Environment Variables

6. Create Web Service

### Deploy Frontend ke Netlify

1. Login ke https://netlify.com

2. Add new site → Import from Git

3. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. Add Environment Variables

5. Deploy

## 🔧 Konfigurasi & Customization

### Mengubah AI Provider

Edit `backend/.env`:

```env
# Gunakan OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your-key

# Atau gunakan Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key

# Atau gunakan Deepgram
AI_PROVIDER=deepgram
DEEPGRAM_API_KEY=your-key
```

### Mengubah Style Notulen

Di frontend, user bisa pilih style saat processing. Atau edit default di `ProcessingControls.jsx`:

```javascript
const [options, setOptions] = useState({
  style: 'formal',  // formal | casual | very_short | detailed
  language: 'id',    // id | en
  includeTimestamps: false
});
```

### Mengubah Maksimal Upload Size

Backend `.env`:
```env
MAX_FILE_SIZE=524288000  # 500MB in bytes
```

### Custom Styling

Edit `frontend/tailwind.config.js` untuk mengubah theme/colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Test transcription
curl -X POST http://localhost:5000/api/transcribe \
  -F "audio=@test.mp3" \
  -F "language=id"

# Test minutes generation
curl -X POST http://localhost:5000/api/generate-minutes \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Teks transkrip...","options":{"style":"formal"}}'
```

### Test Frontend

```bash
cd frontend
npm run build  # Test production build
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Issue: MediaRecorder tidak berfungsi

**Solusi**:
- Pastikan menggunakan HTTPS atau localhost
- Check browser compatibility (Chrome, Firefox, Edge support)
- Izinkan akses mikrofon di browser

### Issue: Backend tidak bisa di-deploy

**Solusi**:
- Check log error saat build
- Pastikan semua dependencies di package.json
- Untuk Vercel, file upload size terbatas (gunakan Railway/Render untuk file besar)

### Issue: Transkripsi gagal

**Solusi**:
- Check API key sudah benar
- Check saldo/quota API
- Check format file didukung
- Check file size tidak terlalu besar

### Issue: FFmpeg error

**Solusi**:
- Install FFmpeg:
  - Ubuntu: `sudo apt install ffmpeg`
  - Mac: `brew install ffmpeg`
  - Windows: Download dari https://ffmpeg.org
- Atau disable video extraction feature

### Issue: Dark mode tidak tersimpan

**Solusi**:
- Check localStorage di browser tidak diblock
- Clear cache dan reload

## 📝 License

MIT License - Silakan digunakan untuk proyek komersial maupun personal.

## 🤝 Contributing

Contributions are welcome! Silakan:
1. Fork repository
2. Buat branch baru
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 💡 Tips & Best Practices

1. **Untuk Rekaman Berkualitas**:
   - Gunakan mikrofon eksternal jika memungkinkan
   - Rekam di ruangan tenang
   - Posisi mikrofon dekat dengan speaker

2. **Untuk Transkrip Akurat**:
   - Bicara dengan jelas
   - Hindari background noise
   - Gunakan bahasa yang konsisten (jangan campur ID-EN)

3. **Untuk Notulen Berkualitas**:
   - Sebutkan nama peserta di awal rapat
   - Sebutkan action item dengan jelas (siapa, apa, kapan)
   - Akhiri rapat dengan ringkasan keputusan

4. **Performance**:
   - Kompres audio/video sebelum upload untuk hasil lebih cepat
   - Gunakan WiFi untuk upload file besar
   - Jangan refresh page saat processing

## 📞 Support

Jika ada pertanyaan atau issue:
- Open issue di GitHub
- Email: support@example.com

---

**Dibuat dengan ❤️ menggunakan React, Tailwind CSS, dan AI**
