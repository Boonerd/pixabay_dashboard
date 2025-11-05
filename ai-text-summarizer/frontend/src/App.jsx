// src/App.jsx
import { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Sparkles, Sun, Moon } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [length, setLength] = useState('medium');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && (f.name.endsWith('.txt') || f.name.endsWith('.pdf'))) {
      setFile(f);
      setText('');
      setError('');
    } else {
      setError('Only .txt or .pdf files allowed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('text', text);
    formData.append('length', length);

    try {
      const res = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      else setError(data.error || 'Failed to summarize');
    } catch {
      setError('Backend not running! Run: python backend/app.py');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-slate-900 text-gray-100' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header + Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-10 h-10" />
            AI Summarizer
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-700 hover:bg-white/30 dark:hover:bg-gray-700/70 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
          </button>
        </div>

        <p className="text-center mb-10 text-lg text-gray-600 dark:text-gray-300">
          Paste text or upload <strong>TXT/PDF</strong> → Get instant, smart summary
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Text Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Paste your text
            </label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setFile(null); }}
              placeholder="Enter long text here..."
              className="w-full h-40 p-5 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition resize-none"
              disabled={!!file}
            />
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400 font-bold text-xl mb-8">OR</div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Upload file (.txt or .pdf)
            </label>
            <label className="block">
              <input type="file" accept=".txt,.pdf" onChange={handleFileChange} className="hidden" />
              <div className="border-2 border-dashed border-indigo-400 dark:border-indigo-500 rounded-2xl p-12 text-center cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-gray-700/50 transition backdrop-blur-sm">
                {file ? (
                  <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">{file.name}</p>
                ) : (
                  <>
                    <Upload className="w-14 h-14 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
                    <p className="text-gray-600 dark:text-gray-400">Click to upload</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Summary Length */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Summary Length
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['short', 'medium', 'long'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLength(opt)}
                  className={`py-3 px-6 rounded-xl font-medium capitalize transition-all ${
                    length === opt
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (!text && !file)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Summary
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-8 p-5 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-2xl backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-300 dark:border-emerald-700 rounded-3xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <FileText className="w-7 h-7" />
              Your Summary
            </h2>
            <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;