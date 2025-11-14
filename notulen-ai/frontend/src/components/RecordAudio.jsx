import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Trash2 } from 'lucide-react';
import AudioRecorder from '../utils/audioRecorder';

const RecordAudio = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder();
      await recorderRef.current.start();

      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioURL(null);
      setAudioBlob(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert(error.message);
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.pause();
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.resume();
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const blob = await recorderRef.current.stop();
      clearInterval(timerRef.current);

      if (blob) {
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        setIsRecording(false);
        setIsPaused(false);

        if (onRecordingComplete) {
          onRecordingComplete(blob, recordingTime);
        }
      }
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Mic className="w-6 h-6 text-primary-600" />
          Rekam Audio Rapat
        </h2>
      </div>

      <div className="space-y-4">
        {/* Recording Status */}
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse-subtle">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                {isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <Pause className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="text-3xl font-mono font-bold text-red-600 dark:text-red-400">
                {formatTime(recordingTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isPaused ? 'Dijeda' : 'Sedang Merekam...'}
              </div>
            </div>
          ) : audioURL ? (
            <div className="w-full space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Rekaman Selesai</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Durasi: {formatTime(recordingTime)}
                </div>
              </div>
              <audio
                ref={audioRef}
                src={audioURL}
                controls
                className="w-full"
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Klik tombol di bawah untuk mulai merekam
              </p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {!isRecording && !audioURL && (
            <button
              onClick={startRecording}
              className="btn-primary flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Mulai Rekam
            </button>
          )}

          {isRecording && !isPaused && (
            <>
              <button
                onClick={pauseRecording}
                className="btn-secondary flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Jeda
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            </>
          )}

          {isRecording && isPaused && (
            <>
              <button
                onClick={resumeRecording}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Lanjutkan
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            </>
          )}

          {audioURL && (
            <>
              <button
                onClick={downloadRecording}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={deleteRecording}
                className="btn-secondary flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Hapus
              </button>
              <button
                onClick={startRecording}
                className="btn-secondary flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Rekam Lagi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordAudio;
