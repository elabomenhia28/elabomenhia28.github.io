import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const transcribeAudio = async (audioFile, language = 'id') => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('language', language);

  const response = await api.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const generateMinutes = async (transcript, options = {}) => {
  const response = await api.post('/generate-minutes', {
    transcript,
    options: {
      style: options.style || 'formal',
      language: options.language || 'id',
      includeTimestamps: options.includeTimestamps || false,
      ...options
    }
  });

  return response.data;
};

export const extractAudioFromVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await api.post('/extract-audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const uploadFile = async (file, type = 'audio') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log('Upload progress:', percentCompleted);
    }
  });

  return response.data;
};

export default api;
