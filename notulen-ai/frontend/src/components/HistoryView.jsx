import React from 'react';
import { History, Trash2, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { generatePDF, downloadFile } from '../utils/exportUtils';

const HistoryView = ({ meetings, onSelect, onDelete }) => {
  const handleDownloadPDF = async (meeting, e) => {
    e.stopPropagation();
    try {
      const doc = await generatePDF(meeting.minutes);
      doc.save(`notulen-${meeting.id}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mendownload PDF');
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus rapat ini?')) {
      onDelete(id);
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary-600" />
            Riwayat Rapat
          </h2>
        </div>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Belum ada riwayat rapat</p>
          <p className="text-sm mt-2">Mulai rekam atau upload file untuk membuat notulen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-primary-600" />
          Riwayat Rapat ({meetings.length})
        </h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelect(meeting)}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {meeting.minutes?.title || 'Rapat'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {meeting.createdAt
                    ? format(new Date(meeting.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })
                    : '-'}
                </p>
                {meeting.minutes?.summary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {meeting.minutes.summary}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {meeting.minutes?.actionItems?.length || 0} Action Items
                  </span>
                  {meeting.transcript && (
                    <span className="badge bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      ✓ Transkrip
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => onSelect(meeting)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors"
                  title="Lihat detail"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {meeting.minutes && (
                  <button
                    onClick={(e) => handleDownloadPDF(meeting, e)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(meeting.id, e)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
