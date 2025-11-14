# 📡 API Documentation - Notulen AI

Dokumentasi lengkap untuk Notulen AI Backend API.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Saat ini API tidak memerlukan authentication. Untuk production, disarankan menambahkan:
- API Key authentication
- JWT tokens
- Rate limiting per IP

---

## Endpoints

### 1. Health Check

Check status server.

**Endpoint:** `GET /api/health`

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-14T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

### 2. Transcribe Audio

Transkripsi file audio/video menjadi teks.

**Endpoint:** `POST /api/transcribe`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| audio | File | Yes | - | Audio/video file (MP3, WAV, M4A, MP4, MOV, WebM) |
| language | String | No | "id" | Language code ("id" atau "en") |
| includeTimestamps | Boolean | No | false | Include timestamps dalam hasil |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/transcribe \
  -F "audio=@recording.mp3" \
  -F "language=id" \
  -F "includeTimestamps=false"
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('language', 'id');
formData.append('includeTimestamps', 'false');

const response = await fetch('http://localhost:5000/api/transcribe', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Success Response (200):**
```json
{
  "success": true,
  "text": "Selamat pagi semuanya. Hari ini kita akan membahas progress proyek pengembangan aplikasi...",
  "transcript": "Selamat pagi semuanya. Hari ini kita akan membahas progress proyek pengembangan aplikasi...",
  "language": "id",
  "duration": 125.5
}
```

**Success Response with Timestamps:**
```json
{
  "success": true,
  "text": "Full transcript text...",
  "transcript": "Full transcript text...",
  "language": "id",
  "duration": 125.5,
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.5,
      "text": "Selamat pagi semuanya."
    },
    {
      "id": 1,
      "start": 3.5,
      "end": 8.2,
      "text": "Hari ini kita akan membahas progress proyek."
    }
  ]
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "No file uploaded",
  "message": "Please upload an audio or video file"
}
```

**400 Bad Request (File too large):**
```json
{
  "error": "File too large",
  "message": "File size exceeds the maximum limit of 500MB"
}
```

**400 Bad Request (Invalid file type):**
```json
{
  "error": "File upload error",
  "message": "Invalid file type. Only audio and video files are allowed."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Transcription failed",
  "message": "Whisper transcription failed: API key invalid",
  "details": "Error stack trace (only in development)"
}
```

---

### 3. Generate Meeting Minutes

Generate notulen rapat dari transkrip.

**Endpoint:** `POST /api/generate-minutes`

**Content-Type:** `application/json`

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| transcript | String | Yes | - | Teks transkrip rapat |
| options | Object | No | {} | Options untuk generate minutes |
| options.style | String | No | "formal" | Style notulen: "formal", "casual", "very_short", "detailed" |
| options.language | String | No | "id" | Language: "id" atau "en" |
| options.includeTimestamps | Boolean | No | false | Include timestamps |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/generate-minutes \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Selamat pagi semua. Hari ini kita akan membahas progress proyek...",
    "options": {
      "style": "formal",
      "language": "id"
    }
  }'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/generate-minutes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    transcript: 'Selamat pagi semua. Hari ini kita akan membahas progress proyek...',
    options: {
      style: 'formal',
      language: 'id',
      includeTimestamps: false
    }
  })
});

const minutes = await response.json();
console.log(minutes);
```

**Request Body Example (Full):**
```json
{
  "transcript": "Selamat pagi semua. Terima kasih sudah hadir di rapat tim minggu ini. Hari ini kita akan membahas beberapa hal penting terkait proyek pengembangan aplikasi Notulen AI. Pertama, saya ingin update dari tim development. Budi, bisa dijelaskan progress minggu ini? Ya, terima kasih. Jadi minggu ini kami sudah berhasil menyelesaikan fitur rekam audio dan upload file. Saat ini sedang dalam tahap testing. Untuk fitur transkripsi, kami rencananya akan integrasi dengan API Whisper dari OpenAI. Target selesai akhir minggu depan. Bagus, terima kasih Budi. Lalu untuk tim design, Siti, bagaimana dengan UI/UX? Untuk UI sudah 90 persen selesai. Kami menggunakan Tailwind CSS dan sudah implementasi dark mode. Tinggal beberapa komponen kecil yang perlu di-polish. Insya Allah selesai besok. Oke baik. Jadi kesimpulannya, kita target soft launch dua minggu lagi. Action items hari ini: Budi selesaikan integrasi API Whisper, deadline Jumat depan. Siti finalisasi semua komponen UI, deadline besok. Dan saya akan prepare dokumentasi dan deployment guide, target selesai minggu depan. Ada yang mau ditambahkan? Kalau tidak ada, kita cukupkan sampai di sini. Terima kasih semuanya.",
  "options": {
    "style": "formal",
    "language": "id",
    "includeTimestamps": false
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "title": "Rapat Tim Development - Proyek Notulen AI",
  "date": "14 November 2024",
  "time": "10:30",
  "participants": [
    "Budi (Developer)",
    "Siti (UI/UX Designer)",
    "Project Manager"
  ],
  "summary": "Rapat membahas progress pengembangan aplikasi Notulen AI. Tim development telah menyelesaikan fitur rekam audio dan upload file, sedang dalam tahap testing. Tim design telah menyelesaikan 90% UI/UX menggunakan Tailwind CSS dengan dark mode. Target soft launch ditetapkan dalam dua minggu.",
  "mainPoints": [
    "Progress fitur rekam audio dan upload file sudah selesai dan dalam tahap testing",
    "Rencana integrasi API Whisper dari OpenAI untuk fitur transkripsi",
    "UI/UX design sudah 90% complete menggunakan Tailwind CSS",
    "Dark mode sudah diimplementasikan",
    "Target soft launch aplikasi dalam dua minggu"
  ],
  "decisions": [
    "Menggunakan API Whisper dari OpenAI untuk fitur transkripsi",
    "Soft launch aplikasi dijadwalkan dua minggu dari sekarang",
    "Fokus pada finalisasi fitur core terlebih dahulu sebelum launch"
  ],
  "actionItems": [
    {
      "task": "Selesaikan integrasi API Whisper untuk fitur transkripsi",
      "pic": "Budi",
      "deadline": "Jumat, 22 November 2024"
    },
    {
      "task": "Finalisasi semua komponen UI dan polish detail design",
      "pic": "Siti",
      "deadline": "Besok"
    },
    {
      "task": "Prepare dokumentasi lengkap dan deployment guide",
      "pic": "Project Manager",
      "deadline": "Minggu depan"
    }
  ],
  "keyPoints": [
    "Fitur core (rekam audio, upload, transkripsi) hampir selesai",
    "UI/UX design modern dengan dark mode support",
    "Timeline launch: 2 minggu lagi",
    "Testing dan QA sedang berjalan",
    "Dokumentasi akan disiapkan untuk deployment"
  ]
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Missing transcript",
  "message": "Please provide a transcript to generate minutes"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to generate minutes",
  "message": "Failed to generate minutes with OpenAI: API key invalid"
}
```

---

### 4. Extract Audio from Video

Ekstrak audio dari file video.

**Endpoint:** `POST /api/extract-audio`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| video | File | Yes | Video file (MP4, MOV, AVI, MKV) |

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/extract-audio \
  -F "video=@meeting.mp4"
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('video', videoFile);

const response = await fetch('http://localhost:5000/api/extract-audio', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Success Response (200):**
```json
{
  "success": true,
  "audioPath": "/uploads/video-1699876543210-123456789.mp3",
  "duration": 125.5,
  "format": "mp3"
}
```

**Error Response (500):**
```json
{
  "error": "Audio extraction failed",
  "message": "FFmpeg error: invalid video format"
}
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Endpoint tidak ditemukan |
| 500 | Internal Server Error - Server/API error |

---

## Rate Limiting

Current: No rate limiting

Recommended for production:
- 100 requests per 15 minutes per IP
- Burst: 20 requests per minute

---

## File Size Limits

| Type | Max Size |
|------|----------|
| Audio Files | 500MB |
| Video Files | 500MB |
| Request Body | 50MB |

---

## Supported File Formats

### Audio
- MP3 (audio/mpeg)
- WAV (audio/wav)
- M4A (audio/m4a)
- WebM (audio/webm)

### Video
- MP4 (video/mp4)
- MOV (video/quicktime)
- WebM (video/webm)

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Human readable error message",
  "details": "Stack trace (only in development mode)"
}
```

---

## SDK Examples

### Python

```python
import requests

# Transcribe
with open('recording.mp3', 'rb') as f:
    files = {'audio': f}
    data = {'language': 'id'}
    response = requests.post(
        'http://localhost:5000/api/transcribe',
        files=files,
        data=data
    )
    result = response.json()
    print(result['text'])

# Generate Minutes
response = requests.post(
    'http://localhost:5000/api/generate-minutes',
    json={
        'transcript': 'Your transcript here...',
        'options': {
            'style': 'formal',
            'language': 'id'
        }
    }
)
minutes = response.json()
print(minutes)
```

### Node.js

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Transcribe
async function transcribe() {
  const form = new FormData();
  form.append('audio', fs.createReadStream('recording.mp3'));
  form.append('language', 'id');

  const response = await axios.post(
    'http://localhost:5000/api/transcribe',
    form,
    { headers: form.getHeaders() }
  );

  console.log(response.data.text);
}

// Generate Minutes
async function generateMinutes() {
  const response = await axios.post(
    'http://localhost:5000/api/generate-minutes',
    {
      transcript: 'Your transcript here...',
      options: {
        style: 'formal',
        language: 'id'
      }
    }
  );

  console.log(response.data);
}
```

### PHP

```php
<?php
// Transcribe
$curl = curl_init();
$file = new CURLFile('recording.mp3', 'audio/mpeg', 'audio');

curl_setopt_array($curl, [
    CURLOPT_URL => 'http://localhost:5000/api/transcribe',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => [
        'audio' => $file,
        'language' => 'id'
    ],
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($curl);
$result = json_decode($response, true);
echo $result['text'];

curl_close($curl);

// Generate Minutes
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'http://localhost:5000/api/generate-minutes',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'transcript' => 'Your transcript here...',
        'options' => [
            'style' => 'formal',
            'language' => 'id'
        ]
    ]),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($curl);
$minutes = json_decode($response, true);
print_r($minutes);

curl_close($curl);
?>
```

---

## WebSocket Support (Future)

Untuk real-time transcription, planned untuk versi future:

```javascript
const ws = new WebSocket('ws://localhost:5000/transcribe');

ws.onopen = () => {
  // Send audio chunks
  ws.send(audioChunk);
};

ws.onmessage = (event) => {
  const result = JSON.parse(event.data);
  console.log('Partial transcript:', result.text);
};
```

---

## Changelog

### v1.0.0 (2024-11-14)
- Initial release
- Transcribe endpoint
- Generate minutes endpoint
- Extract audio endpoint
- Support OpenAI Whisper
- Support Google Gemini
- Support Deepgram

---

## Support

Untuk pertanyaan atau issue:
- GitHub Issues: [Repository URL]
- Email: support@example.com
- Documentation: https://docs.example.com
