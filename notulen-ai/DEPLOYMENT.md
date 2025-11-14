# 🚀 Panduan Deployment Lengkap - Notulen AI

Panduan step-by-step untuk deploy aplikasi Notulen AI ke berbagai platform hosting.

## 📋 Persiapan Sebelum Deploy

### 1. Checklist Pre-Deployment

- [ ] Semua fitur sudah tested locally
- [ ] Frontend build success (`npm run build`)
- [ ] Backend tested dengan production environment
- [ ] API keys sudah disiapkan
- [ ] Environment variables sudah didokumentasikan
- [ ] `.gitignore` sudah benar (jangan push API keys!)

### 2. Dapatkan API Keys

**OpenAI (Recommended)**:
1. Buka https://platform.openai.com/
2. Login/Sign up
3. Buka https://platform.openai.com/api-keys
4. Klik "Create new secret key"
5. Copy dan simpan key (hanya tampil sekali!)
6. Isi billing information dan top up minimal $5

**Google Gemini (Alternative)**:
1. Buka https://makersuite.google.com/
2. Login dengan Google account
3. Klik "Get API Key"
4. Copy API key

**Deepgram (Alternative)**:
1. Buka https://console.deepgram.com/
2. Sign up
3. Buka API Keys section
4. Copy API key
5. Free tier: 12,000 minutes/year

---

## 🌐 Option 1: Deploy ke Vercel (Recommended untuk Frontend)

### Frontend

**Step 1: Prepare Repository**

```bash
cd notulen-ai
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

**Step 2: Deploy ke Vercel**

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New Project"
4. Import repository Anda
5. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

6. Add Environment Variables:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   ```

7. Klik "Deploy"

**Step 3: Configure Custom Domain (Optional)**

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Backend di Vercel

**PENTING**: Vercel Serverless Functions memiliki limitasi:
- Max request body: 4.5MB (hobby), 50MB (pro)
- Max execution time: 10s (hobby), 300s (pro)
- Tidak ideal untuk file upload besar

**Jika tetap ingin deploy backend di Vercel:**

1. Buat file `vercel.json` di folder backend:

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
      "dest": "/server.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
  ]
}
```

2. Deploy:
   - New Project → Import backend folder
   - Environment Variables: Tambahkan semua dari `.env`
   - Deploy

**Recommendation**: Untuk production dengan file upload besar, gunakan Railway atau Render untuk backend.

---

## 🚂 Option 2: Deploy Backend ke Railway (Recommended)

Railway bagus untuk backend karena:
- Support file upload unlimited
- Persistent storage
- Auto SSL
- Mudah scaling

**Steps:**

1. Buka https://railway.app
2. Login dengan GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select repository → pilih backend folder
5. Railway auto-detect Node.js

**Configure Environment Variables:**

Di Railway dashboard:
```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=sk-your-key-here
AI_PROVIDER=openai
CORS_ORIGIN=https://your-frontend-url.vercel.app
MAX_FILE_SIZE=524288000
```

**Generate Domain:**

1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy URL (misalnya: `your-app.up.railway.app`)
4. Update `VITE_API_URL` di Vercel frontend

**Install FFmpeg (untuk video processing):**

1. Di Railway dashboard, buka Settings
2. Add nixpacks.toml:

```toml
[phases.setup]
nixPkgs = ["ffmpeg"]
```

3. Redeploy

---

## 🎨 Option 3: Deploy Backend ke Render

Render juga excellent untuk backend:

**Steps:**

1. Buka https://render.com
2. Sign up/Login
3. "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   ```
   Name: notulen-ai-backend
   Environment: Node
   Region: Singapore (untuk users di Indonesia)
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

6. Select "Free" tier (atau paid untuk production)

**Environment Variables:**

Add di Render dashboard:
```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=sk-your-key
AI_PROVIDER=openai
CORS_ORIGIN=https://your-frontend-url
```

**Install FFmpeg:**

Buat file `render.yaml` di root:

```yaml
services:
  - type: web
    name: notulen-ai-backend
    env: node
    buildCommand: "npm install && apt-get update && apt-get install -y ffmpeg"
    startCommand: "npm start"
    envVars:
      - key: NODE_ENV
        value: production
```

---

## 🌊 Option 4: Deploy Frontend ke Netlify

Alternative untuk Vercel:

**Steps:**

1. Buka https://netlify.com
2. "Add new site" → "Import from Git"
3. Connect GitHub
4. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url
   ```

6. Deploy

**Custom Domain:**

1. Domain settings → Add custom domain
2. Update DNS records sesuai instruksi

---

## 🐳 Option 5: Deploy dengan Docker

Jika ingin full control:

**Frontend Dockerfile:**

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - AI_PROVIDER=openai
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - ./backend/uploads:/app/uploads
```

**Run:**

```bash
docker-compose up -d
```

**Deploy ke Cloud:**
- Digital Ocean App Platform
- AWS ECS
- Google Cloud Run
- Azure Container Instances

---

## ⚙️ Configuration Untuk Production

### Frontend Production Build

**Optimize Build:**

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['axios', 'date-fns'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Backend Production Settings

**Security Headers:**

```javascript
// server.js
import helmet from 'helmet';

app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Production Environment:**

```env
NODE_ENV=production
PORT=5000

# Security
CORS_ORIGIN=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# API Keys (jangan hardcode!)
OPENAI_API_KEY=${OPENAI_API_KEY}

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=error
```

---

## 🔒 Security Checklist

- [ ] API keys di environment variables (NEVER in code)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] File upload size limits
- [ ] File type validation
- [ ] HTTPS/SSL enabled
- [ ] Security headers (helmet)
- [ ] Input sanitization
- [ ] Error messages tidak expose sensitive info

---

## 📊 Monitoring & Logging

### Recommended Tools:

1. **Sentry** - Error tracking
   ```bash
   npm install @sentry/node @sentry/react
   ```

2. **LogRocket** - Session replay
   ```bash
   npm install logrocket
   ```

3. **Google Analytics** - Usage tracking

4. **Uptime Monitoring**:
   - UptimeRobot (free)
   - Pingdom
   - Better Uptime

### Setup Sentry (Backend):

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Add error handler
app.use(Sentry.Handlers.errorHandler());
```

---

## 🧪 Testing Deployment

### Test Checklist:

- [ ] Homepage loads correctly
- [ ] Dark mode works
- [ ] Record audio works (check HTTPS!)
- [ ] Upload file works
- [ ] Transcription API works
- [ ] Minutes generation works
- [ ] Export PDF works
- [ ] Export DOCX works
- [ ] History persists
- [ ] Mobile responsive
- [ ] Different browsers (Chrome, Firefox, Safari)

### Load Testing:

```bash
# Install artillery
npm install -g artillery

# Create test script
artillery quick --count 10 --num 50 https://your-api-url.com/api/health
```

---

## 🔄 CI/CD Setup (Optional)

**GitHub Actions untuk Auto Deploy:**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install and Build
        working-directory: ./frontend
        run: |
          npm install
          npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Railway auto-deploys on push
      # Or add manual deployment steps here
```

---

## 💰 Cost Estimation

### Free Tier (Cocok untuk testing/personal use):

**Frontend (Vercel Free)**:
- 100GB bandwidth/month
- Unlimited requests
- HTTPS included

**Backend (Railway Free)**:
- 500 hours/month
- 1GB RAM
- Shared CPU

**AI API (OpenAI)**:
- Whisper: $0.006/minute
- GPT-4: ~$0.03/1K tokens
- Estimasi: ~$5-10/month untuk usage ringan

**Total: ~$5-15/month**

### Production Scale:

- Vercel Pro: $20/month
- Railway Pro: $5/month
- OpenAI: ~$50-200/month (tergantung usage)
- Domain: ~$12/year

**Total: ~$75-225/month**

---

## 🆘 Troubleshooting Deployment

### Issue: Build Failed di Vercel

```bash
# Check build locally first
cd frontend
npm run build

# Check logs
# Common issues:
# - Missing dependencies
# - Environment variables not set
# - Import errors
```

### Issue: Backend API 502/504

```bash
# Check logs di hosting dashboard
# Common issues:
# - API key invalid
# - Timeout (increase in hosting settings)
# - Out of memory
```

### Issue: CORS Error

Update backend:
```javascript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));
```

### Issue: File Upload Gagal

```javascript
// Increase limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

---

## 📞 Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Selamat Deploy! 🚀**

Jika ada pertanyaan atau issue, buka issue di GitHub repository.
