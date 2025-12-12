import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FeaturesNew } from './components/FeaturesNew';
import { Testimonials } from './components/Testimonials';
import { FAQNew } from './components/FAQNew';
import { FooterNew } from './components/FooterNew';
import { ResultCard } from './components/ResultCard';
import { ProcessingStatus } from './components/ProcessingStatus';
import { HistoryList } from './components/HistoryList';
import { BatchMode } from './components/BatchMode';
import { AlertCircle, Layers, Sparkles, ArrowRight, Loader2, PlayCircle, Search, Star, ShieldCheck } from 'lucide-react';
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

  // Update document title based on language
  useEffect(() => {
    const titles = {
      zh: 'AdSave.app - Facebook广告资料库视频下载器 | 免费高清下载',
      en: 'AdSave.app - Facebook Ads Library Video Downloader | Free HD Download'
    };
    document.title = titles[language];
  }, [language]);

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
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50 relative">
      <Navbar onTutorialClick={() => setShowTutorialModal(true)} />

      {/* --- Enhanced Background Effects --- */}
      <div className="fixed inset-0 bg-grid-pattern -z-10 pointer-events-none h-[120vh]"></div>

      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-20"></div>
      <div className="fixed top-0 right-1/4 translate-x-1/2 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-20"></div>
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 -z-20"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 flex flex-col items-center relative z-10">

        {/* Floating Tag */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider shadow-sm mb-6">
                <Sparkles size={12} className="text-indigo-500" /> v2.4.0
            </span>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 relative">

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            {language === 'zh' ? (
              <>
                {t.hero.title_prefix}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x pb-2">
                  {t.hero.title_highlight}
                </span>
              </>
            ) : (
              <>
                {t.hero.title_prefix} <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x pb-2">
                  {t.hero.title_highlight}
                </span> {t.hero.title_suffix}
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Social Proof Stats */}
          <div className="flex justify-center w-full">
              <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-wrap justify-center gap-8 md:gap-16 shadow-lg shadow-indigo-100/50">
                  <div className="text-center">
                      <div className="text-2xl md:text-3xl font-extrabold text-slate-900">100K+</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{t.features?.statsDesc || 'Ads Processed'}</div>
                  </div>
                  <div className="w-px bg-slate-200 h-10 self-center"></div>
                  <div className="text-center">
                      <div className="text-2xl md:text-3xl font-extrabold text-slate-900">2000+</div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{t.hero.stats_hours}</div>
                  </div>
                  <div className="w-px bg-slate-200 h-10 self-center"></div>
                  <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl md:text-3xl font-extrabold text-slate-900">4.9</span>
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{t.hero.stats_rating}</div>
                  </div>
              </div>
          </div>
        </div>

        {/* --- Main Interface --- */}
        <div className="w-full max-w-3xl relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mt-8">

            {/* Mode Toggles */}
            <div className="flex justify-center mb-6 relative z-10">
                <div className="bg-white p-1.5 rounded-full inline-flex shadow-lg shadow-slate-200/50 border border-slate-100">
                    <button
                        onClick={() => setMode('single')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'single' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                        <PlayCircle size={16} /> {t.hero.mode_single}
                    </button>
                    <button
                        onClick={() => setMode('batch')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'batch' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                        <Layers size={16} /> {t.hero.mode_batch}
                    </button>
                </div>
            </div>

            {/* Content Switcher */}
            {mode === 'single' ? (
              <div className="animate-fade-in">
                {/* Single Input Form */}
                <form onSubmit={handleSingleSubmit} className="relative">
                  <div className="p-1 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 shadow-xl shadow-indigo-200/50">
                    <div className="bg-white rounded-xl flex items-center gap-2 p-1.5">
                      <div className="text-slate-400 pl-3">
                        <Search size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder={t.hero.placeholder}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-slate-900 placeholder:text-slate-300 font-medium disabled:opacity-50 h-10 md:h-12"
                      />

                      <button
                        type="submit"
                        disabled={loading || !url}
                        className={`hidden sm:flex h-10 md:h-12 px-6 rounded-lg font-bold transition-all items-center gap-2 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:to-slate-700`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>{t.hero.btn_processing}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.hero.btn_download}</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Helper Area */}
                  <div className="flex flex-col sm:flex-row items-center justify-between px-4 mt-4 gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      <span className="flex-shrink-0 bg-blue-100 text-blue-700 px-1.5 rounded text-[10px] font-bold">INFO</span>
                      <span className="truncate">{t.hero.example}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setShowTutorialModal(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 decoration-indigo-200"
                      >
                        <PlayCircle size={14} /> {t.hero.view_tutorial}
                      </button>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <ShieldCheck size={12} /> Secure & Private
                      </div>
                    </div>
                  </div>

                  {/* Mobile Button */}
                  <button
                    type="submit"
                    disabled={loading || !url}
                    className={`sm:hidden w-full mt-4 h-14 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 bg-slate-900 text-white shadow-slate-900/20`}
                  >
                    {loading ? t.hero.btn_processing : t.hero.btn_download}
                  </button>
                </form>

                {/* Single Result Area */}
                <div className="relative z-10 min-h-[50px] mt-8">
                  {/* LIMIT ERROR BANNER */}
                  {limitError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 flex items-center gap-3 animate-fade-in shadow-sm">
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
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 text-gray-900 animate-fade-in">
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

        {/* History List */}
        <div className="relative z-10 w-full">
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

        <FeaturesNew onTutorialClick={() => setShowTutorialModal(true)} />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQNew />

        {/* Footer Section */}
        <FooterNew />

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
            <button
              onClick={() => setShowTutorialModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === 'zh' ? '📹 视频教程' : '📹 Video Tutorial'}
              </h3>
              <p className="text-gray-600 mt-2">
                {language === 'zh' ? '学习如何快速下载 Facebook 广告视频' : 'Learn how to quickly download Facebook Ad videos'}
              </p>
            </div>

            <div className="p-6">
              <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video">
                <video
                  key={showTutorialModal ? 'tutorial-video' : 'hidden'}
                  src={`/tutorial.mp4?v=${Date.now()}`}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onLoadedData={() => console.log('Video loaded successfully')}
                  onError={(e) => {
                    console.error('Video failed to load:', e);
                    const target = e.currentTarget;
                    console.log('Video src:', target.src);
                    console.log('Video error:', target.error);
                  }}
                >
                  您的浏览器不支持视频播放。
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
