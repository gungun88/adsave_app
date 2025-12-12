import React from 'react';
import { useLanguage } from '../lib/i18n';

export const FAQNew: React.FC = () => {
  const { t, language: lang } = useLanguage();

  const faqData = {
    en: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Have other questions? Contact us at support@adsave.app",
      items: [
        {
          q: "Is AdSave Pro free to use?",
          a: "Yes! Free users get 5 parsing credits daily. Want more? Simply register and login to instantly upgrade to 50 credits/day for free. No credit card required."
        },
        {
          q: "How fast is the video download speed?",
          a: "Our web parser is fast, but for the ultimate experience, install our Chrome Extension. It achieves 0-second parsing speed by extracting the video source directly from your browser cache."
        },
        {
          q: "Does it support batch downloading?",
          a: "Absolutely. Switch to 'Batch Parse' mode, paste a list of Facebook Ad Library URLs (one per line), and we'll process them all at once. Perfect for agency workflows."
        },
        {
          q: "What is the 'Stealth Mode' technology?",
          a: "We use advanced browser fingerprinting protection to simulate human behavior. This allows you to scrape high volumes of ads without getting blocked by Facebook's anti-crawler systems."
        },
        {
          q: "Can I download images and ad copy too?",
          a: "Currently, we only support downloading videos from the Facebook Ad Library."
        },
        {
          q: "Are the downloads watermarked?",
          a: "Never. We provide the raw source file direct from the CDN. The video quality is identical to what the user sees on Facebook, with no watermarks or compression added."
        }
      ]
    },
    zh: {
      badge: "常见问题",
      title: "常见问题解答",
      subtitle: "还有其他问题吗？请通过 support@adsave.app 联系我们",
      items: [
        {
          q: "AdSave Pro 是免费的吗？有次数限制吗？",
          a: "是的！免费访客用户每日可解析 5 次。如果您需要更多额度，只需注册并登录，即可立即免费升级至 50 次/日！无需绑定信用卡。"
        },
        {
          q: "视频解析下载速度有多快？",
          a: "网页版速度很快，但如果您追求极致效率，请安装我们的谷歌扩展（Chrome Extension）。它能直接提取浏览器缓存源文件，实现 0 秒级别的极速解析下载。"
        },
        {
          q: "支持批量下载吗？",
          a: "完全支持。切换到\"批量解析\"模式，粘贴多个 Facebook 广告库链接（每行一个），我们就能一次性处理队列。这是广告公司和投手团队的最爱。"
        },
        {
          q: "什么是\"隐身模式\"技术？",
          a: "我们使用先进的浏览器指纹保护技术来模拟真实人类行为。这使您能够高频采集广告素材，而无需担心被 Facebook 的反爬虫系统屏蔽或封锁 IP。"
        },
        {
          q: "除了视频，还能下载文案和图片吗？",
          a: "目前仅支持facebook广告资料库视频下载。"
        },
        {
          q: "下载的素材有水印吗？",
          a: "绝无水印。我们提供的是直接来自 CDN 的原始源文件。画质与用户在 Facebook 上看到的一模一样，没有任何二次压缩或水印添加。"
        }
      ]
    }
  }[lang];

  // Use local faqData for the items, but use t.faq for header if available
  const headerData = t.faq || { badge: faqData.badge, title: faqData.title, subtitle: faqData.subtitle };
  const itemsData = faqData.items;

  return (
    <div id="faq" className="w-full max-w-7xl mx-auto mt-24 mb-32 px-4 scroll-mt-32">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 border-slate-200 bg-white text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          {headerData.badge}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {headerData.title}
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          {headerData.subtitle}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {itemsData.map((item: any, index: number) => (
          <div key={index} className="flex gap-4 group">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-sm font-bold text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm">
              {index + 1}
            </span>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">{item.q}</h3>
              </div>
              <p className="text-base text-slate-500 leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
