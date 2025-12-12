import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Send, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

type LegalType = 'privacy' | 'terms' | 'contact' | null;

export const FooterNew: React.FC = () => {
  const { t, language: lang } = useLanguage();
  const [activeModal, setActiveModal] = useState<LegalType>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModal]);

  const footerT = {
    en: {
      copyright: "© 2025 • AdSave.app All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      close: "Close",
      friendlyLinks: "Partners & Resources",
      contact: "Contact Us"
    },
    zh: {
      copyright: "© 2025 • AdSave.app 版权所有。",
      privacy: "隐私政策",
      terms: "服务条款",
      close: "关闭",
      friendlyLinks: "友情链接",
      contact: "联系我们"
    }
  }[lang];

  const displayT = t.footer || footerT;

  // Friendly Links Data with i18n support
  const friendlyLinks = lang === 'zh' ? [
    { name: 'doingfb跨境论坛', url: 'https://doingfb.com/' },
    { name: '跨境担保平台', url: 'https://merchant.doingfb.com/' },
    { name: 'Facebook BM切换器', url: 'https://bmswitcher.com/' }
  ] : [
    { name: 'doingfb Forum', url: 'https://doingfb.com/' },
    { name: 'Merchant Platform', url: 'https://merchant.doingfb.com/' },
    { name: 'Facebook BM Switcher', url: 'https://bmswitcher.com/' }
  ];

  const legalContent = {
    privacy: {
        en: {
            title: "Privacy Policy",
            icon: <Shield size={24} className="text-green-600" />,
            content: `
                <h4 class="font-bold text-slate-900 mt-4 mb-2">1. Introduction</h4>
                <p class="mb-4">Welcome to AdSave.app. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                
                <h4 class="font-bold text-slate-900 mt-4 mb-2">2. Data We Collect</h4>
                <p class="mb-4">We do not collect any personal identification information (PII) from users who use our service in "Guest Mode". For registered users, we may collect email addresses solely for authentication purposes.</p>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li><strong>Usage Data:</strong> We may process data about your use of our website and services ("usage data"). The usage data may include your IP address, browser type and version, operating system, and referral source.</li>
                    <li><strong>Cookies:</strong> We use cookies to improve your experience and analyze traffic.</li>
                </ul>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">3. How We Use Your Data</h4>
                <p class="mb-4">We use the collected data for various purposes:</p>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>To provide and maintain our Service</li>
                    <li>To monitor the usage of our Service</li>
                    <li>To detect, prevent and address technical issues</li>
                </ul>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">4. Data Security</h4>
                <p class="mb-4">The security of your data is important to us, but remember that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            `
        },
        zh: {
            title: "隐私政策",
            icon: <Shield size={24} className="text-green-600" />,
            content: `
                <h4 class="font-bold text-slate-900 mt-4 mb-2">1. 简介</h4>
                <p class="mb-4">欢迎使用 AdSave.app。我们尊重您的隐私，并致力于保护您的个人数据。本隐私政策旨在告知您在访问我们需要时，我们如何处理您的数据。</p>
                
                <h4 class="font-bold text-slate-900 mt-4 mb-2">2. 我们收集的数据</h4>
                <p class="mb-4">对于使用“访客模式”的用户，我们不会收集任何个人身份信息 (PII)。对于注册用户，我们可能会收集仅用于身份验证的电子邮件地址。</p>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li><strong>使用数据：</strong> 我们可能会处理有关您使用我们网站和服务的数据（“使用数据”）。使用数据可能包括您的 IP 地址、浏览器类型和版本、操作系统以及推荐来源。</li>
                    <li><strong>Cookie：</strong> 我们使用 Cookie 来改善您的体验并分析流量。</li>
                </ul>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">3. 数据使用方式</h4>
                <p class="mb-4">我们将收集的数据用于以下目的：</p>
                <ul class="list-disc pl-5 mb-4 space-y-1">
                    <li>提供和维护我们的服务</li>
                    <li>监控服务的使用情况</li>
                    <li>检测、预防和解决技术问题</li>
                </ul>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">4. 数据安全</h4>
                <p class="mb-4">您的数据安全对我们至关重要，但请记住，互联网上的传输方法并非 100% 安全。虽然我们努力使用商业上可接受的方式来保护您的个人数据，但我们不能保证其绝对安全。</p>
            `
        }
    },
    terms: {
        en: {
            title: "Terms of Service",
            icon: <FileText size={24} className="text-blue-600" />,
            content: `
                <h4 class="font-bold text-slate-900 mt-4 mb-2">1. Acceptance of Terms</h4>
                <p class="mb-4">By accessing or using AdSave.app, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.</p>
                
                <h4 class="font-bold text-slate-900 mt-4 mb-2">2. Use License</h4>
                <p class="mb-4">Permission is granted to temporarily download copies of the materials (information or software) on AdSave's website for personal, non-commercial transitory viewing only.</p>
                <p class="mb-4">This tool is intended for educational and research purposes (e.g., ad analysis). You agree not to use this tool to infringe upon any copyrights or intellectual property rights.</p>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">3. Disclaimer</h4>
                <p class="mb-4">The materials on AdSave's website are provided on an 'as is' basis. AdSave makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">4. Limitations</h4>
                <p class="mb-4">In no event shall AdSave or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AdSave's website.</p>
            `
        },
        zh: {
            title: "服务条款",
            icon: <FileText size={24} className="text-blue-600" />,
            content: `
                <h4 class="font-bold text-slate-900 mt-4 mb-2">1. 条款接受</h4>
                <p class="mb-4">访问或使用 AdSave.app 即表示您同意受本服务条款的约束。如果您不同意条款的任何部分，则不得访问本服务。</p>
                
                <h4 class="font-bold text-slate-900 mt-4 mb-2">2. 使用许可</h4>
                <p class="mb-4">AdSave 授予您临时下载网站材料（信息或软件）副本的许可，仅供个人、非商业性的临时查看。</p>
                <p class="mb-4">本工具仅用于教育和研究目的（例如广告分析）。您同意不使用本工具侵犯任何版权或知识产权。</p>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">3. 免责声明</h4>
                <p class="mb-4">AdSave 网站上的材料按“原样”提供。AdSave 不作任何明示或暗示的保证，特此声明并否认所有其他保证，包括但不限于适销性、特定用途适用性或不侵犯知识产权或其他侵权行为的暗示保证或条件。</p>

                <h4 class="font-bold text-slate-900 mt-4 mb-2">4. 限制</h4>
                <p class="mb-4">在任何情况下，AdSave 或其供应商均不对因使用或无法使用 AdSave 网站上的材料而造成的任何损害（包括但不限于数据或利润损失或由于业务中断造成的损害）承担责任。</p>
            `
        }
    },
    contact: {
        en: {
            title: "Contact Us",
            icon: <Mail size={24} className="text-purple-600" />,
            content: `
                <div class="space-y-4 pt-2">
                    <p class="mb-6 text-slate-500">Have questions or need support? Reach out to us through the following channels:</p>
                    
                    <a href="https://t.me/doingfb" target="_blank" class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
                        <div class="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Telegram</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-blue-600">@doingfb</div>
                        </div>
                    </a>

                    <a href="mailto:info@doingfb.com" class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all group">
                        <div class="bg-orange-50 p-2.5 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-orange-600">info@doingfb.com</div>
                        </div>
                    </a>

                    <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-green-400 hover:shadow-md transition-all group cursor-pointer" onclick="navigator.clipboard.writeText('doingfb').then(() => alert('WeChat ID copied!'))">
                        <div class="bg-green-50 p-2.5 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">WeChat</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-green-600">doingfb</div>
                        </div>
                    </div>
                </div>
            `
        },
        zh: {
            title: "联系我们",
            icon: <Mail size={24} className="text-purple-600" />,
            content: `
                <div class="space-y-4 pt-2">
                    <p class="mb-6 text-slate-500">有任何问题或需要支持？请通过以下渠道联系我们：</p>
                    
                    <a href="https://t.me/doingfb" target="_blank" class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
                        <div class="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Telegram</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-blue-600">@doingfb</div>
                        </div>
                    </a>

                    <a href="mailto:info@doingfb.com" class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all group">
                        <div class="bg-orange-50 p-2.5 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-orange-600">info@doingfb.com</div>
                        </div>
                    </a>

                    <div class="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-green-400 hover:shadow-md transition-all group cursor-pointer" onclick="navigator.clipboard.writeText('doingfb').then(() => alert('微信号已复制!'))">
                        <div class="bg-green-50 p-2.5 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">WeChat</div>
                            <div class="text-slate-900 font-bold text-lg group-hover:text-green-600">doingfb</div>
                        </div>
                    </div>
                </div>
            `
        }
    }
  };

  return (
    <>
    <footer className="w-full max-w-7xl mx-auto px-4 relative z-30">
      
      {/* Friendly Links Section */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
         <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest select-none">
            <span className="w-8 h-px bg-slate-200"></span>
             {displayT.friendlyLinks}
            <span className="w-8 h-px bg-slate-200"></span>
         </div>
         <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {friendlyLinks.map((link, idx) => (
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all duration-300 text-sm font-medium"
                >
                    {link.name}
                </a>
            ))}
         </div>
      </div>

      <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-200 pt-8 pb-8 text-center text-sm font-medium text-slate-500 lg:flex-row lg:items-center lg:text-left transition-colors">
        <p>{displayT.copyright}</p>
        <ul className="flex justify-center gap-6 lg:justify-start">
          <li className="hover:text-slate-900 transition-colors cursor-pointer">
            <button onClick={() => setActiveModal('privacy')} className="hover:underline">{displayT.privacy}</button>
          </li>
          <li className="hover:text-slate-900 transition-colors cursor-pointer">
            <button onClick={() => setActiveModal('terms')} className="hover:underline">{displayT.terms}</button>
          </li>
          <li className="hover:text-slate-900 transition-colors cursor-pointer">
            <button onClick={() => setActiveModal('contact')} className="hover:underline">{displayT.contact}</button>
          </li>
        </ul>
      </div>
    </footer>

    {/* Legal Modal Overlay */}
    {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setActiveModal(null)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-2xl relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                            {legalContent[activeModal][lang].icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {legalContent[activeModal][lang].title}
                        </h3>
                    </div>
                    <button
                        onClick={() => setActiveModal(null)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div
                    className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: legalContent[activeModal][lang].content }}
                >
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={() => setActiveModal(null)}
                        className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        {displayT.close}
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};