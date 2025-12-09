import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { ResultCard } from './components/ResultCard';
import { ProcessingStatus } from './components/ProcessingStatus';
import { HistoryList } from './components/HistoryList';
import { BatchMode } from './components/BatchMode';
import { LinkIcon, AlertCircle, Layers, LinkIcon as SingleIcon, Zap, ChromeIcon } from './components/Icons';
import { parseAdLink } from './services/adService';
import { getHistory, addToHistory, clearHistory } from './services/historyService';
import { checkCanDownload, incrementUsage, getUsageStats } from './services/usageService';
import { AdData } from './types';
import { useLanguage } from './lib/i18n';
import { useAuth } from './lib/authContext';

type AppMode = 'single' | 'batch';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<AppMode>('single');

  // Single Mode State
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [result, setResult] = useState<AdData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Limit State
  const [limitError, setLimitError] = useState<{title: string, msg: string} | null>(null);

  // Tutorial Modal State
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // Shared History State
  const [history, setHistory] = useState<AdData[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleHistoryUpdate = () => {
    setHistory(getHistory());
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLimitError(null);

    // 1. Check Usage Limit
    const limitCheck = checkCanDownload(user);
    if (!limitCheck.allowed) {
      if (limitCheck.message === 'limit_guest') {
        setLimitError({ 
          title: t.limits.guest_title, 
          msg: t.limits.guest_msg 
        });
      } else {
        setLimitError({ 
          title: t.limits.user_title, 
          msg: t.limits.user_msg 
        });
      }
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStatus('Initializing...');

    try {
      const data = await parseAdLink(url, language, (msg) => {
        setLoadingStatus(msg);
      });

      // 2. Increment Usage on Success
      incrementUsage(user);

      setResult(data);
      // Add to history and update state
      const updatedHistory = addToHistory(data);
      setHistory(updatedHistory);
    } catch (err: any) {
      setError(err.message || 'Failed to process the URL. The ad might be inactive or private.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (ad: AdData) => {
    setMode('single'); // Switch to single mode to view detail
    setResult(ad);
    setUrl(''); 
    setError(null);
    setLimitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white pb-20 pt-16 lg:pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              {t.hero.title_prefix} <span className="text-fb-blue">{t.hero.title_highlight}</span> {t.hero.title_suffix}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* Chrome Extension Button */}
            <div className="flex justify-center mb-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(t.lang === 'zh' ? 'Chrome 扩展即将推出！' : 'Chrome Extension Coming Soon!');
                }}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <ChromeIcon size={20} className="group-hover:rotate-12 transition-transform" />
                <div className="flex flex-col items-start">
                  <span className="text-sm leading-tight">{t.hero.extension_btn}</span>
                  <span className="text-xs opacity-90 leading-tight">{t.hero.extension_desc}</span>
                </div>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-xl inline-flex shadow-inner">
                <button
                  onClick={() => setMode('single')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mode === 'single' 
                      ? 'bg-white text-fb-blue shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SingleIcon size={16} />
                  {t.hero.mode_single}
                </button>
                <button
                  onClick={() => setMode('batch')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mode === 'batch' 
                      ? 'bg-white text-fb-blue shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layers size={16} />
                  {t.hero.mode_batch}
                </button>
              </div>
            </div>

            {/* Content Switcher */}
            {mode === 'single' ? (
              <div className="animate-fade-in">
                {/* Single Input Form */}
                <form onSubmit={handleSingleSubmit} className="relative max-w-2xl mx-auto">
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-gray-400 pointer-events-none">
                      <LinkIcon size={20} />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={t.hero.placeholder}
                      className="w-full h-16 pl-12 pr-36 bg-white border-2 border-gray-200 rounded-2xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-fb-blue focus:ring-4 focus:ring-blue-50/50 transition-all shadow-sm hover:border-gray-300"
                    />
                    <button
                      type="submit"
                      disabled={loading || !url}
                      className={`absolute right-2 h-12 px-8 bg-fb-blue text-white font-bold rounded-xl transition-all duration-200 ${
                        loading || !url 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-fb-dark hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {loading ? t.hero.btn_processing : t.hero.btn_download}
                    </button>
                  </div>
                  <p className="text-left mt-3 text-xs text-gray-400 pl-4 pr-4 flex items-center justify-between">
                    <span>{t.hero.example}</span>
                    <button
                      onClick={() => setShowTutorialModal(true)}
                      className="text-fb-blue hover:text-fb-dark font-medium transition-colors"
                    >
                      {t.hero.view_tutorial}
                    </button>
                  </p>
                </form>

                {/* Single Result Area */}
                <div className="relative z-10 min-h-[50px]">
                  
                  {/* LIMIT ERROR BANNER */}
                  {limitError && (
                    <div className="max-w-2xl mx-auto mt-8 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 flex items-center gap-3 animate-fade-in shadow-sm">
                        <div className="flex-shrink-0">
                           <AlertCircle size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm text-amber-900">{limitError.msg}</p>
                        </div>
                        {!user && (
                           <button
                             onClick={loginWithGoogle}
                             className="flex-shrink-0 bg-amber-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-700 transition-colors"
                           >
                             {t.limits.guest_action}
                           </button>
                        )}
                    </div>
                  )}

                  {/* PARSE ERROR BANNER */}
                  {error && !limitError && (
                    <div className="max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 text-gray-900 animate-fade-in">
                      <AlertCircle className="flex-shrink-0 mt-0.5 text-yellow-600" size={20} />
                      <div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{error}</p>
                      </div>
                    </div>
                  )}

                  {loading && <ProcessingStatus status={loadingStatus} />}
                  
                  {!loading && result && <ResultCard data={result} />}
                </div>
              </div>
            ) : (
              // Batch Mode Component
              <BatchMode onHistoryUpdate={handleHistoryUpdate} />
            )}
          </div>

          {/* History List (Shared below both modes, but usually relevant to see what you just downloaded) */}
          <div className="relative z-10">
            {history.length > 0 && (
               <div className="mt-16 pt-8 border-t border-gray-100">
                  <HistoryList 
                    history={history} 
                    onSelect={handleHistorySelect} 
                    onClear={handleClearHistory} 
                  />
               </div>
            )}
          </div>
        </section>

        <Features onTutorialClick={() => setShowTutorialModal(true)} />
      </main>

      {/* Tutorial Video Modal */}
      {showTutorialModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTutorialModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTutorialModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {t.lang === 'zh' ? '📹 视频教程' : '📹 Video Tutorial'}
              </h3>
              <p className="text-gray-600 mt-2">
                {t.lang === 'zh' ? '学习如何快速下载 Facebook 广告视频' : 'Learn how to quickly download Facebook Ad videos'}
              </p>
            </div>

            {/* Video Container */}
            <div className="p-6">
              <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video">
                <video
                  src="/tutorial.mp4"
                  poster="/tutorial-poster.jpg"
                  controls
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to GIF if video doesn't exist
                    const img = document.createElement('img');
                    img.src = '/tutorial.gif';
                    img.className = 'w-full h-full object-contain';
                    img.onerror = () => {
                      // Final fallback to placeholder
                      img.src = 'https://via.placeholder.com/1200x675/1f2937/9ca3af?text=Tutorial+Video+Here';
                    };
                    e.currentTarget.parentElement?.replaceChild(img, e.currentTarget);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-gray-500 text-sm">
            © 2024 FB AdsSaver. Tool for educational and analytical purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;