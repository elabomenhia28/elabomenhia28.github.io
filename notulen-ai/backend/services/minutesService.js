import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

/**
 * Generate meeting minutes using OpenAI GPT
 */
async function generateWithOpenAI(transcript, options) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const stylePrompts = {
    formal: 'dalam gaya formal dan profesional',
    casual: 'dalam gaya santai namun tetap informatif',
    very_short: 'sangat ringkas dan to-the-point',
    detailed: 'sangat detail dan komprehensif'
  };

  const styleDescription = stylePrompts[options.style] || stylePrompts.formal;
  const language = options.language === 'en' ? 'English' : 'Bahasa Indonesia';

  const systemPrompt = `Anda adalah asisten AI yang ahli dalam membuat notulen rapat. Tugas Anda adalah menganalisis transkrip rapat dan membuat notulen yang terstruktur dengan baik ${styleDescription}.

Hasilkan notulen dalam format JSON dengan struktur berikut:
{
  "title": "Judul rapat yang deskriptif",
  "date": "Tanggal hari ini dalam format lengkap",
  "time": "Waktu sekarang",
  "participants": ["Daftar", "peserta", "rapat"],
  "summary": "Ringkasan singkat (2-3 kalimat) tentang isi rapat",
  "mainPoints": ["Poin", "pembahasan", "utama"],
  "decisions": ["Keputusan", "yang", "diambil"],
  "actionItems": [
    {
      "task": "Deskripsi tugas",
      "pic": "Nama PIC",
      "deadline": "Deadline"
    }
  ],
  "keyPoints": ["5", "poin", "penting", "dari", "rapat"]
}

Pastikan:
1. Identifikasi semua peserta rapat dari transkrip
2. Ekstrak poin-poin pembahasan utama dengan jelas
3. Identifikasi keputusan yang diambil
4. Ekstrak action items dengan PIC dan deadline jika disebutkan
5. Buat ringkasan 5 poin penting dari rapat
6. Gunakan ${language} untuk semua teks
7. Buat judul yang deskriptif berdasarkan isi rapat`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Berikut adalah transkrip rapat:\n\n${transcript}\n\nBuatlah notulen rapat yang lengkap dan terstruktur.` }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;

  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error(`Failed to generate minutes with OpenAI: ${error.message}`);
  }
}

/**
 * Generate meeting minutes using Google Gemini
 */
async function generateWithGemini(transcript, options) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const stylePrompts = {
    formal: 'dalam gaya formal dan profesional',
    casual: 'dalam gaya santai namun tetap informatif',
    very_short: 'sangat ringkas dan to-the-point',
    detailed: 'sangat detail dan komprehensif'
  };

  const styleDescription = stylePrompts[options.style] || stylePrompts.formal;
  const language = options.language === 'en' ? 'English' : 'Bahasa Indonesia';

  const prompt = `Analisis transkrip rapat berikut dan buat notulen yang terstruktur ${styleDescription} dalam ${language}.

Format output dalam JSON dengan struktur:
{
  "title": "Judul rapat",
  "date": "Tanggal",
  "time": "Waktu",
  "participants": ["Peserta"],
  "summary": "Ringkasan",
  "mainPoints": ["Poin utama"],
  "decisions": ["Keputusan"],
  "actionItems": [{"task": "...", "pic": "...", "deadline": "..."}],
  "keyPoints": ["5 poin penting"]
}

Transkrip:
${transcript}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse JSON from Gemini response');

  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error(`Failed to generate minutes with Gemini: ${error.message}`);
  }
}

/**
 * Main function to generate meeting minutes
 */
export async function generateMeetingMinutes(transcript, options = {}) {
  const provider = process.env.AI_PROVIDER || 'openai';

  console.log(`Generating minutes with provider: ${provider}`);

  try {
    let result;

    switch (provider) {
      case 'openai':
        result = await generateWithOpenAI(transcript, options);
        break;
      case 'gemini':
        result = await generateWithGemini(transcript, options);
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    // Add default date and time if not provided
    const now = new Date();
    if (!result.date) {
      result.date = now.toLocaleDateString(options.language === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    if (!result.time) {
      result.time = now.toLocaleTimeString(options.language === 'en' ? 'en-US' : 'id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return result;

  } catch (error) {
    console.error('Minutes generation error:', error);
    throw error;
  }
}
