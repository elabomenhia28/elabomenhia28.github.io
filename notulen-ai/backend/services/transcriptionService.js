import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

/**
 * Transcribe audio using OpenAI Whisper
 */
async function transcribeWithWhisper(filePath, options = {}) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const fileStream = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: options.language === 'id' ? 'id' : 'en',
      response_format: options.includeTimestamps ? 'verbose_json' : 'json',
      temperature: 0.2
    });

    return {
      text: transcription.text,
      language: transcription.language || options.language,
      duration: transcription.duration,
      segments: transcription.segments || []
    };
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw new Error(`Whisper transcription failed: ${error.message}`);
  }
}

/**
 * Transcribe audio using Google Gemini
 */
async function transcribeWithGemini(filePath, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Read file and convert to base64
    const fileBuffer = await readFile(filePath);
    const base64Audio = fileBuffer.toString('base64');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: `Please transcribe the following audio. Provide only the transcription text without any additional commentary.`
          }, {
            inline_data: {
              mime_type: 'audio/wav',
              data: base64Audio
            }
          }]
        }]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    return {
      text: text.trim(),
      language: options.language,
      duration: null
    };
  } catch (error) {
    console.error('Gemini transcription error:', error);
    throw new Error(`Gemini transcription failed: ${error.message}`);
  }
}

/**
 * Transcribe audio using Deepgram
 */
async function transcribeWithDeepgram(filePath, options = {}) {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw new Error('Deepgram API key not configured');
  }

  try {
    const fileBuffer = await readFile(filePath);

    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      fileBuffer,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/wav'
        },
        params: {
          language: options.language === 'id' ? 'id' : 'en',
          punctuate: true,
          paragraphs: true,
          smart_format: true
        }
      }
    );

    const result = response.data.results.channels[0].alternatives[0];

    return {
      text: result.transcript,
      language: options.language,
      duration: response.data.metadata.duration,
      segments: result.paragraphs?.paragraphs || []
    };
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw new Error(`Deepgram transcription failed: ${error.message}`);
  }
}

/**
 * Main transcription function with provider selection
 */
export async function transcribeAudio(filePath, options = {}) {
  const provider = process.env.AI_PROVIDER || 'openai';

  console.log(`Transcribing with provider: ${provider}`);

  try {
    switch (provider) {
      case 'openai':
        return await transcribeWithWhisper(filePath, options);
      case 'gemini':
        return await transcribeWithGemini(filePath, options);
      case 'deepgram':
        return await transcribeWithDeepgram(filePath, options);
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

/**
 * Extract audio from video file using ffmpeg
 */
export async function extractAudioFromVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const outputPath = videoPath.replace(path.extname(videoPath), '.mp3');

    ffmpeg(videoPath)
      .toFormat('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .on('end', () => {
        resolve({
          audioPath: outputPath,
          format: 'mp3'
        });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(new Error(`Audio extraction failed: ${err.message}`));
      })
      .save(outputPath);
  });
}
