import express from 'express';
import { transcribeAudio, extractAudioFromVideo } from '../services/transcriptionService.js';
import { cleanupFile } from '../utils/fileUtils.js';

const router = express.Router();

/**
 * POST /api/transcribe
 * Transcribe audio file to text
 */
router.post('/transcribe', (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('audio')(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload an audio or video file'
        });
      }

      const language = req.body.language || 'id';
      const includeTimestamps = req.body.includeTimestamps === 'true';

      console.log('Transcribing file:', req.file.filename);

      const result = await transcribeAudio(req.file.path, {
        language,
        includeTimestamps
      });

      // Cleanup uploaded file after processing
      await cleanupFile(req.file.path);

      res.json({
        success: true,
        text: result.text,
        transcript: result.text,
        language: result.language,
        duration: result.duration,
        ...(includeTimestamps && { segments: result.segments })
      });

    } catch (error) {
      console.error('Transcription error:', error);

      // Cleanup file on error
      if (req.file) {
        await cleanupFile(req.file.path);
      }

      res.status(500).json({
        error: 'Transcription failed',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
});

/**
 * POST /api/extract-audio
 * Extract audio from video file
 */
router.post('/extract-audio', (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('video')(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload a video file'
        });
      }

      console.log('Extracting audio from:', req.file.filename);

      const result = await extractAudioFromVideo(req.file.path);

      // Cleanup original video file
      await cleanupFile(req.file.path);

      res.json({
        success: true,
        audioPath: result.audioPath,
        duration: result.duration,
        format: result.format
      });

    } catch (error) {
      console.error('Audio extraction error:', error);

      // Cleanup file on error
      if (req.file) {
        await cleanupFile(req.file.path);
      }

      res.status(500).json({
        error: 'Audio extraction failed',
        message: error.message
      });
    }
  });
});

export default router;
