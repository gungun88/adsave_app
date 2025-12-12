import React from 'react';
import { Languages, Menu, Zap, Crown, Chrome, BookOpen, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../lib/i18n';
import { useAuth } from '../lib/authContext';
import { getUsageStats } from '../services/usageService';

export const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, loginWithGoogle } = useAuth();
  const usage = getUsageStats(user);

  const scrollToFAQ = () => {
    const faqElement = document.getElementById('faq');
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center justify-between px-2 py-2 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-lg shadow-black/5 w-full max-w-5xl ring-1 ring-white/50">

        {/* Logo Area */}
        <div className="flex items-center gap-3 pl-4 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur opacity-40 rounded-full scale-75"></div>
            <div className="relative">
              <Logo size={32} />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AdSave</span>
            <span className="text-gray-400 font-semibold">.app</span>
          </span>
        </div>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-black/5">
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all flex items-center gap-2">
            <Chrome size={14} className="text-blue-600/80"/> {t.nav?.chromeExt || 'Chrome Extension'}
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-500/80"/> {t.nav?.tutorial || 'Tutorial'}
          </button>
          <button onClick={scrollToFAQ} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all flex items-center gap-2">
            <HelpCircle size={14} className="text-slate-400"/> {t.nav?.faq || 'FAQ'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 pr-2">

          {/* Credits Badge */}
          <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${usage.remaining > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            <Zap size={14} className={usage.remaining > 0 ? "fill-amber-500 text-amber-500" : "text-slate-400"} />
            <span>{usage.remaining}/{usage.limit}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
            title="Switch Language"
          >
            <Languages size={20} />
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-full">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
              <span className="max-w-[100px] truncate">{user.displayName}</span>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors shadow-md shadow-slate-900/10"
            >
              {usage.remaining === 0 && <Crown size={14} className="text-yellow-300" />}
              <span>{usage.remaining === 0 ? 'Upgrade Pro' : (t.nav?.getStarted || 'Get Started')}</span>
            </button>
          )}
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
};
