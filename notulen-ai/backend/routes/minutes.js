import express from 'express';
import { generateMeetingMinutes } from '../services/minutesService.js';

const router = express.Router();

/**
 * POST /api/generate-minutes
 * Generate meeting minutes from transcript
 */
router.post('/generate-minutes', async (req, res) => {
  try {
    const { transcript, options = {} } = req.body;

    if (!transcript) {
      return res.status(400).json({
        error: 'Missing transcript',
        message: 'Please provide a transcript to generate minutes'
      });
    }

    console.log('Generating minutes with options:', options);

    const minutes = await generateMeetingMinutes(transcript, {
      style: options.style || 'formal',
      language: options.language || 'id',
      includeTimestamps: options.includeTimestamps || false,
      ...options
    });

    res.json({
      success: true,
      ...minutes
    });

  } catch (error) {
    console.error('Minutes generation error:', error);

    res.status(500).json({
      error: 'Failed to generate minutes',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;
