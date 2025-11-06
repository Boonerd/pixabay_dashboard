// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Sparkles, Sun, Moon, Copy, Check, Download, RefreshCw, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState('medium');
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyPoints, setKeyPoints] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && (f.name.endsWith('.txt') || f.name.endsWith('.pdf'))) {
      setFile(f);
      setText('');
    } else {
      toast.error('Only .txt or .pdf');
    }
  };

  const submit = async () => {
    if (!text && !file) return;
    if (wordCount > 1000) {
      toast.error('Max 1000 words');
      return;
    }

    setLoading(true);
    setSummary('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('text', text);
    formData.append('length', length);

    try {
      const res = await fetch('https://backend-portfolio-urvb.onrender.com/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        toast.success('Summary ready!');
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch {
      toast.error('Backend offline');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${length}.txt`;
    a.click();
    toast.success('Downloaded!');
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-900 to-gray-800' : 'bg-gradient-to-br from-teal-50 via-rose-50 to-amber-50'}`}>
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold flex items-center gap-2 sm:gap-3 text-teal-700 dark:text-teal-300">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 animate-pulse" />
            AI Summarizer
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-white shadow-lg hover:scale-110 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        <p className="text-center mb-8 sm:mb-10 text-gray-700 dark:text-gray-300 text-base sm:text-lg">
          Paste text or <span className="font-bold text-rose-600">upload .txt / .pdf</span>
        </p>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-teal-200 dark:border-teal-700">
          {/* Text Input */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Paste your text</span>
              <span className="text-amber-600 dark:text-amber-400">{wordCount}/1000</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setFile(null); }}
              placeholder="Paste long text here..."
              className="w-full h-32 sm:h-36 p-4 sm:p-5 border-2 border-teal-300 dark:border-teal-600 rounded-2xl bg-teal-50/50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-teal-500 dark:placeholder-teal-400 focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-600 outline-none resize-none"
              disabled={!!file}
              maxLength={10000}
            />
          </div>

          <div className="text-center text-rose-600 dark:text-rose-400 font-bold my-5 sm:my-6 text-base sm:text-lg">OR</div>

          {/* TINY UPLOAD */}
          <label className="block mb-6">
            <input type="file" accept=".txt,.pdf" onChange={handleFileChange} className="hidden" />
            <div className="border-2 border-dashed border-amber-400 dark:border-amber-500 rounded-xl p-3 text-center cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-700 transition group h-16 sm:h-20 flex flex-col justify-center">
              {file ? (
                <p className="text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 truncate">{file.name}</p>
              ) : (
                <>
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-amber-500 group-hover:text-amber-600 transition" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Click to upload</p>
                </>
              )}
            </div>
          </label>

          {/* LENGTH + KEY POINTS */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {['short', 'medium', 'long'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setLength(opt)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold capitalize transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base ${
                  length === opt
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                    : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800'
                }`}
              >
                {opt}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setKeyPoints(!keyPoints)}
              className={`px-4 py-2.5 rounded-full font-bold text-sm transition-all ${keyPoints ? 'bg-amber-500 text-white' : 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'}`}
            >
              <Zap className="w-4 h-4 inline mr-1" /> Key Points
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || (!text && !file)}
            className="w-full bg-gradient-to-r from-teal-500 to-rose-500 hover:from-teal-600 hover:to-rose-600 text-white font-bold py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg shadow-xl disabled:opacity-60 transition-all transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                Generate Summary
              </>
            )}
          </button>
        </form>

        {/* Summary */}
        {loading && (
          <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-3xl animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        )}

        {summary && !loading && (
          <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-900/30 dark:to-rose-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3 text-amber-800 dark:text-amber-300">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                {keyPoints ? 'Key Points' : 'Summary'}
              </h2>
              <div className="flex gap-2">
                <button onClick={copySummary} className="p-2 sm:p-2.5 rounded-lg bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 transition">
                  {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                <button onClick={downloadSummary} className="p-2 sm:p-2.5 rounded-lg bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 transition">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={submit} className="p-2 sm:p-2.5 rounded-lg bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 transition">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
              {keyPoints ? summary.split('. ').map((s, i) => `• ${s.trim()}${i < summary.split('. ').length - 1 ? '.\n' : ''}`).join('') : summary}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
          Built with <span className="text-rose-600">love</span> in Kenya
          {' | '}
          <a href="https://github.com/yourusername" className="underline hover:text-rose-600">GitHub</a>
        </footer>
      </div>
    </div>
  );
}

export default App;