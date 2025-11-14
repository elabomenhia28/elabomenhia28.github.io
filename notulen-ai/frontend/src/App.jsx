import React, { useState } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import RecordAudio from './components/RecordAudio';
import UploadFile from './components/UploadFile';
import ProcessingControls from './components/ProcessingControls';
import TranscriptView from './components/TranscriptView';
import MinutesView from './components/MinutesView';
import HistoryView from './components/HistoryView';
import { transcribeAudio, generateMinutes, extractAudioFromVideo } from './services/api';

function AppContent() {
  const { darkMode, toggleDarkMode, meetings, currentMeeting, setCurrentMeeting, saveMeeting, deleteMeeting } = useApp();

  const [selectedFile, setSelectedFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [minutes, setMinutes] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingMinutes, setIsGeneratingMinutes] = useState(false);
  const [processingOptions, setProcessingOptions] = useState(null);

  const handleRecordingComplete = (blob, duration) => {
    setAudioBlob(blob);
    setSelectedFile(null);
    setTranscript('');
    setMinutes(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAudioBlob(null);
    setTranscript('');
    setMinutes(null);
  };

  const processFile = async (options) => {
    try {
      let fileToProcess = selectedFile || audioBlob;

      if (!fileToProcess) {
        alert('Silakan pilih file atau rekam audio terlebih dahulu');
        return;
      }

      setProcessingOptions(options);

      // Step 1: Extract audio if video
      if (selectedFile && selectedFile.type.startsWith('video/')) {
        setIsTranscribing(true);
        try {
          const result = await extractAudioFromVideo(selectedFile);
          // In production, backend would return the extracted audio
          // For now, we'll proceed with the video file
        } catch (error) {
          console.error('Error extracting audio:', error);
          // Continue with video file
        }
      }

      // Step 2: Transcribe
      setIsTranscribing(true);
      try {
        // Convert blob to file if needed
        let audioFile = fileToProcess;
        if (fileToProcess instanceof Blob && !(fileToProcess instanceof File)) {
          audioFile = new File([fileToProcess], `recording-${Date.now()}.webm`, {
            type: fileToProcess.type
          });
        }

        const transcriptResult = await transcribeAudio(audioFile, options.language);
        setTranscript(transcriptResult.text || transcriptResult.transcript);
        setIsTranscribing(false);

        // Step 3: Generate minutes
        setIsGeneratingMinutes(true);
        const minutesResult = await generateMinutes(
          transcriptResult.text || transcriptResult.transcript,
          options
        );

        setMinutes(minutesResult);
        setIsGeneratingMinutes(false);

        // Save to history
        saveMeeting({
          transcript: transcriptResult.text || transcriptResult.transcript,
          minutes: minutesResult,
          audioFile: audioFile.name,
          options
        });

      } catch (error) {
        console.error('Error processing:', error);
        setIsTranscribing(false);
        setIsGeneratingMinutes(false);

        // For demo purposes, show example data if API fails
        if (error.message.includes('Network Error') || error.response?.status === 404) {
          alert('Backend API tidak tersedia. Menampilkan data contoh.');
          showDemoData(fileToProcess);
        } else {
          alert('Terjadi kesalahan saat memproses: ' + error.message);
        }
      }
    } catch (error) {
      console.error('Error in processFile:', error);
      alert('Terjadi kesalahan: ' + error.message);
      setIsTranscribing(false);
      setIsGeneratingMinutes(false);
    }
  };

  const showDemoData = (file) => {
    // Demo transcript
    const demoTranscript = `Selamat pagi semua. Terima kasih sudah hadir di rapat tim minggu ini.

Hari ini kita akan membahas beberapa hal penting terkait proyek pengembangan aplikasi Notulen AI.

Pertama, saya ingin update dari tim development. Budi, bisa dijelaskan progress minggu ini?

Ya, terima kasih. Jadi minggu ini kami sudah berhasil menyelesaikan fitur rekam audio dan upload file. Saat ini sedang dalam tahap testing. Untuk fitur transkripsi, kami rencananya akan integrasi dengan API Whisper dari OpenAI. Target selesai akhir minggu depan.

Bagus, terima kasih Budi. Lalu untuk tim design, Siti, bagaimana dengan UI/UX?

Untuk UI sudah 90 persen selesai. Kami menggunakan Tailwind CSS dan sudah implementasi dark mode. Tinggal beberapa komponen kecil yang perlu di-polish. Insya Allah selesai besok.

Oke baik. Jadi kesimpulannya, kita target soft launch dua minggu lagi. Action items hari ini: Budi selesaikan integrasi API Whisper, deadline Jumat depan. Siti finalisasi semua komponen UI, deadline besok. Dan saya akan prepare dokumentasi dan deployment guide, target selesai minggu depan.

Ada yang mau ditambahkan? Kalau tidak ada, kita cukupkan sampai di sini. Terima kasih semuanya.`;

    setTranscript(demoTranscript);
    setIsTranscribing(false);

    // Demo minutes
    setTimeout(() => {
      const demoMinutes = {
        title: 'Rapat Tim Development - Proyek Notulen AI',
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        time: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        participants: ['Budi (Developer)', 'Siti (UI/UX Designer)', 'Project Manager'],
        summary: 'Rapat membahas progress pengembangan aplikasi Notulen AI. Tim development telah menyelesaikan fitur rekam audio dan upload file, sedang dalam tahap testing. Tim design telah menyelesaikan 90% UI/UX menggunakan Tailwind CSS dengan dark mode. Target soft launch ditetapkan dalam dua minggu.',
        mainPoints: [
          'Progress fitur rekam audio dan upload file sudah selesai dan dalam tahap testing',
          'Rencana integrasi API Whisper dari OpenAI untuk fitur transkripsi',
          'UI/UX design sudah 90% complete menggunakan Tailwind CSS',
          'Dark mode sudah diimplementasikan',
          'Target soft launch aplikasi dalam dua minggu'
        ],
        decisions: [
          'Menggunakan API Whisper dari OpenAI untuk fitur transkripsi',
          'Soft launch aplikasi dijadwalkan dua minggu dari sekarang',
          'Fokus pada finalisasi fitur core terlebih dahulu sebelum launch'
        ],
        actionItems: [
          {
            task: 'Selesaikan integrasi API Whisper untuk fitur transkripsi',
            pic: 'Budi',
            deadline: 'Jumat, 22 November 2024'
          },
          {
            task: 'Finalisasi semua komponen UI dan polish detail design',
            pic: 'Siti',
            deadline: 'Besok'
          },
          {
            task: 'Prepare dokumentasi lengkap dan deployment guide',
            pic: 'Project Manager',
            deadline: 'Minggu depan'
          }
        ],
        keyPoints: [
          'Fitur core (rekam audio, upload, transkripsi) hampir selesai',
          'UI/UX design modern dengan dark mode support',
          'Timeline launch: 2 minggu lagi',
          'Testing dan QA sedang berjalan',
          'Dokumentasi akan disiapkan untuk deployment'
        ]
      };

      setMinutes(demoMinutes);
      setIsGeneratingMinutes(false);

      saveMeeting({
        transcript: demoTranscript,
        minutes: demoMinutes,
        audioFile: file?.name || 'demo-recording.webm',
        options: processingOptions
      });
    }, 2000);
  };

  const handleSelectMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setTranscript(meeting.transcript || '');
    setMinutes(meeting.minutes || null);
    setSelectedFile(null);
    setAudioBlob(null);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewMeeting = () => {
    setCurrentMeeting(null);
    setTranscript('');
    setMinutes(null);
    setSelectedFile(null);
    setAudioBlob(null);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Notulen AI</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notulen Rapat Otomatis dengan AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentMeeting && (
                <button
                  onClick={handleNewMeeting}
                  className="btn-secondary text-sm"
                >
                  + Rapat Baru
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Record Audio */}
            <RecordAudio onRecordingComplete={handleRecordingComplete} />

            {/* Upload File */}
            <UploadFile onFileSelect={handleFileSelect} />

            {/* Processing Controls */}
            <ProcessingControls
              onProcess={processFile}
              disabled={isTranscribing || isGeneratingMinutes}
              hasFile={!!(selectedFile || audioBlob)}
            />

            {/* Transcript View */}
            {(transcript || isTranscribing) && (
              <TranscriptView transcript={transcript} isLoading={isTranscribing} />
            )}

            {/* Minutes View */}
            {(minutes || isGeneratingMinutes) && (
              <MinutesView minutes={minutes} isLoading={isGeneratingMinutes} />
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <HistoryView
              meetings={meetings}
              onSelect={handleSelectMeeting}
              onDelete={deleteMeeting}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Dibuat dengan ❤️ menggunakan React, Tailwind CSS, dan AI
          </p>
          <p className="mt-1">
            © 2024 Notulen AI - Aplikasi Notulen Rapat Otomatis
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
