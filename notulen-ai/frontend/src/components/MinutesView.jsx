import React, { useState } from 'react';
import { FileCheck, Download, Share2, Edit3, Copy, Check } from 'lucide-react';
import { generatePDF, generateDOCX, generateTXT, downloadFile } from '../utils/exportUtils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const MinutesView = ({ minutes, isLoading, onEdit }) => {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const doc = await generatePDF(minutes);
      doc.save(`notulen-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    try {
      setExporting(true);
      const blob = await generateDOCX(minutes);
      downloadFile(blob, `notulen-${Date.now()}.docx`);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Gagal mengekspor DOCX');
    } finally {
      setExporting(false);
    }
  };

  const handleExportTXT = () => {
    try {
      const text = generateTXT(minutes);
      const blob = new Blob([text], { type: 'text/plain' });
      downloadFile(blob, `notulen-${Date.now()}.txt`);
    } catch (error) {
      console.error('Error exporting TXT:', error);
      alert('Gagal mengekspor TXT');
    }
  };

  const copyToClipboard = () => {
    const text = generateTXT(minutes);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = generateTXT(minutes);

    if (navigator.share) {
      try {
        await navigator.share({
          title: minutes.title || 'Notulen Rapat',
          text: text
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      copyToClipboard();
      alert('Teks notulen telah disalin ke clipboard!');
    }
  };

  if (!minutes && !isLoading) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-primary-600" />
          Notulen Rapat
        </h2>
        {minutes && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Salin ke clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Bagikan"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit notulen"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Sedang membuat notulen dengan AI...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Mohon tunggu sebentar
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
            <h3 className="text-xl font-bold mb-2">{minutes.title || 'Rapat'}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>📅 {minutes.date || format(new Date(), 'dd MMMM yyyy', { locale: id })}</p>
              <p>🕐 {minutes.time || format(new Date(), 'HH:mm', { locale: id })} WIB</p>
              {minutes.participants && minutes.participants.length > 0 && (
                <p>👥 {minutes.participants.join(', ')}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          {minutes.summary && (
            <div>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                📋 Ringkasan
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {minutes.summary}
              </p>
            </div>
          )}

          {/* Main Points */}
          {minutes.mainPoints && minutes.mainPoints.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                💡 Pembahasan Utama
              </h4>
              <ul className="space-y-2">
                {minutes.mainPoints.map((point, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Decisions */}
          {minutes.decisions && minutes.decisions.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                ✅ Keputusan Rapat
              </h4>
              <ul className="space-y-2">
                {minutes.decisions.map((decision, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{decision}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {minutes.actionItems && minutes.actionItems.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                🎯 Action Items
              </h4>
              <div className="space-y-3">
                {minutes.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {index + 1}. {item.task || item}
                    </div>
                    {item.pic && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        👤 PIC: <span className="font-medium">{item.pic}</span>
                      </div>
                    )}
                    {item.deadline && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        ⏰ Deadline: <span className="font-medium">{item.deadline}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Points */}
          {minutes.keyPoints && minutes.keyPoints.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                ⭐ Poin-Poin Penting
              </h4>
              <ul className="space-y-2">
                {minutes.keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Export Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3">Export Notulen</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={handleExportDOCX}
                disabled={exporting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download DOCX
              </button>
              <button
                onClick={handleExportTXT}
                disabled={exporting}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinutesView;
