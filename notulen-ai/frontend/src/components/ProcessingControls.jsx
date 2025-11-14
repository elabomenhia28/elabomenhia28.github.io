import React, { useState } from 'react';
import { Play, Settings } from 'lucide-react';

const ProcessingControls = ({ onProcess, disabled, hasFile }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    style: 'formal',
    language: 'id',
    includeTimestamps: false
  });

  const handleProcess = () => {
    onProcess(options);
  };

  if (!hasFile) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary-600" />
        Pengaturan Pemrosesan
      </h3>

      <div className="space-y-4">
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Gaya Notulen
          </label>
          <select
            value={options.style}
            onChange={(e) => setOptions({ ...options, style: e.target.value })}
            className="input"
          >
            <option value="formal">Formal</option>
            <option value="casual">Santai</option>
            <option value="very_short">Sangat Ringkas</option>
            <option value="detailed">Detail</option>
          </select>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Bahasa
          </label>
          <select
            value={options.language}
            onChange={(e) => setOptions({ ...options, language: e.target.value })}
            className="input"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Timestamps Option */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="timestamps"
            checked={options.includeTimestamps}
            onChange={(e) => setOptions({ ...options, includeTimestamps: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="timestamps" className="text-sm">
            Sertakan timestamp dalam transkrip
          </label>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={disabled}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          {disabled ? 'Memproses...' : 'Mulai Proses'}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Proses transkripsi dan pembuatan notulen akan dimulai.
          <br />
          Waktu pemrosesan tergantung pada durasi audio/video.
        </p>
      </div>
    </div>
  );
};

export default ProcessingControls;
