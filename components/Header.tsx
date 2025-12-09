import React, { useState, useRef, useEffect } from 'react';
import { Download, LanguagesIcon, Zap, Loader2 } from './Icons';
import { useLanguage } from '../lib/i18n';
import { useAuth } from '../lib/authContext';
import { getUsageStats } from '../services/usageService';

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, loginWithGoogle, logout, isLoading } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [usage, setUsage] = useState({ remaining: 0, limit: 5 });

  // Update usage stats periodically or when user changes
  useEffect(() => {
    const updateStats = () => {
      const stats = getUsageStats(user);
      setUsage({ remaining: stats.remaining, limit: stats.limit });
    };
    
    updateStats();
    // Simple interval to keep UI in sync if multiple tabs open (optional)
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm(language === 'zh' ? '确定要退出登录吗？' : 'Are you sure you want to log out?')) {
      logout();
      setIsUserMenuOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#1877F2"/>
              <g transform="translate(8, 8)">
                <path d="M12 15V3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AdSave</span>
                <span className="text-gray-400 font-semibold">.app</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Credits Display */}
              <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-fb-blue px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                <Zap size={14} className="fill-current" />
                <span>{t.header.credits}: {usage.remaining}/{usage.limit}</span>
              </div>

              {/* Language Switcher */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2 text-gray-500 hover:text-fb-blue hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  <LanguagesIcon size={20} />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in z-50">
                    <button 
                      onClick={() => { setLanguage('zh'); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${language === 'zh' ? 'text-fb-blue font-semibold' : 'text-gray-700'}`}
                    >
                      中文
                    </button>
                    <button 
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${language === 'en' ? 'text-fb-blue font-semibold' : 'text-gray-700'}`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* User / Login */}
              {user ? (
                 <div className="relative" ref={userMenuRef}>
                   <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                   >
                     <div className="hidden md:block text-right">
                       <div className="text-xs font-bold text-gray-900">{user.name}</div>
                       <div className="text-[10px] text-gray-500">Free Plan</div>
                     </div>
                     <div className="relative group">
                       <img
                         src={user.avatar}
                         alt="User"
                         className="w-9 h-9 rounded-full border border-gray-200"
                         onError={(e) => {
                           e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=1877F2&color=fff&size=128";
                         }}
                       />
                     </div>
                   </button>

                   {/* User Dropdown Menu */}
                   {isUserMenuOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in z-50">
                       <div className="px-4 py-3 border-b border-gray-100">
                         <div className="text-sm font-bold text-gray-900">{user.name}</div>
                         <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                       </div>
                       <button
                         onClick={handleLogout}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                         </svg>
                         {t.header.logout}
                       </button>
                     </div>
                   )}
                 </div>
              ) : (
                <button 
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-4 rounded-full transition-colors text-sm flex items-center gap-2 shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span className="hidden sm:inline">{t.header.login}</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};