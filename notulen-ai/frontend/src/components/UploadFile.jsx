import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, Loader } from 'lucide-react';

const UploadFile = ({ onFileSelect, acceptedFormats = '.mp3,.wav,.m4a,.mp4,.mov' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar. Maksimal 500MB');
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const videoExts = ['mp4', 'mov', 'avi', 'mkv'];
    return videoExts.includes(ext) ? '🎥' : '🎵';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Upload className="w-6 h-6 text-primary-600" />
          Upload File Audio / Video
        </h2>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFormats}
          onChange={handleChange}
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <div>
              <p className="text-lg font-medium mb-2">
                Drag & drop file di sini
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                atau
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Pilih File
              </button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Format yang didukung: MP3, WAV, M4A, MP4, MOV
              <br />
              Maksimal ukuran file: 500MB
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getFileIcon(selectedFile.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Hapus file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
            >
              Ganti File
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ✓ File siap diproses. Klik tombol "Proses" di bawah untuk memulai transkripsi.
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
