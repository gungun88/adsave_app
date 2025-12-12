import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

export const translations = {
  en: {
    nav: {
      chromeExt: 'Chrome Extension',
      tutorial: 'Tutorial',
      faq: 'FAQ',
      login: 'Login',
      getStarted: 'Get Started',
      credits: 'Credits Left'
    },
    header: {
      how: "How it works",
      pricing: "Pricing",
      api: "API",
      faq: "FAQ",
      login: "Login with Google",
      logout: "Logout",
      credits: "Credits"
    },
    hero: {
      title_prefix: "Download",
      title_highlight: "Facebook Ad",
      title_suffix: "Videos",
      full_title: "Download Facebook Ad Videos",
      subtitle: "Save high-quality videos and ad copy from the Facebook Ad Library. Powered by advanced headless browser technology.",
      placeholder: "Paste Facebook Ad Library URL here...",
      btn_download: "Download",
      btn_processing: "Processing...",
      example: "Example: https://www.facebook.com/ads/library/?id=123...",
      error_title: "Error Processing Ad",
      mode_single: "Single Link",
      mode_batch: "Batch Mode",
      extension_btn: "Install Chrome Extension",
      extension_desc: "Faster & More Convenient",
      view_tutorial: "View Video Tutorial",
      stats_hours: "Hours Saved",
      stats_rating: "Rating"
    },
    tutorial: {
      title: "How It Works",
      subtitle: "Simple 3-step process to download Facebook ads"
    },
    batch: {
      placeholder: "Paste multiple Facebook Ad URLs here (one per line)...\nExample:\nhttps://www.facebook.com/ads/library/?id=123...\nhttps://www.facebook.com/ads/library/?id=456...",
      btn_start: "Start Batch Process",
      btn_new: "New Batch",
      progress: "Processed {current} of {total}",
      status_pending: "Pending",
      status_processing: "Processing...",
      status_failed: "Failed",
      action_video: "Video",
      action_cover: "Cover",
    },
    history: {
      title: "Recent Downloads",
      clear: "Clear History",
      view: "View Result",
      empty: "No recent history found."
    },
    features: {
      title: "Why Top Marketers Choose AdSave",
      subtitle: "Everything you need to analyze, save, and iterate on winning creatives.",
      sourceTitle: "1080p Source",
      sourceDesc: "Get the raw file directly from CDN. No compression artifacts.",
      stealthTitle: "Stealth Mode",
      stealthDesc: "Advanced fingerprinting protection prevents detection.",
      batchTitle: "Batch Parse",
      batchDesc: "Queue up to 50 URLs at once via direct bulk paste.",
      statsTitle: "10M+",
      statsDesc: "Ads Processed",
      s1_t: "Copy Link",
      s1_d: "Find the ad in Facebook Ad Library and copy the URL from the browser address bar.",
      s2_t: "Paste & Process",
      s2_d: "Paste the link into the box above. Our headless browser engine will parse the media assets.",
      s3_t: "Download",
      s3_d: "Preview the video and click the download button to save the MP4 file to your device."
    },
    testimonials: {
      tag: "User Reviews",
      title: "Loved by 10,000+ Creators",
      sub: "See how marketers are scaling their ad testing with AdSave."
    },
    faq: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Have other questions? Contact us at support@adsave.app"
    },
    footer: {
      copyright: "© 2025 • AdSave.app All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      close: "Close",
      friendlyLinks: "Partners & Resources",
      contact: "Contact Us"
    },
    faq_section: {
      title: "Frequently Asked Questions",
      q1: "Is this tool free?",
      a1: "Yes, FB AdsSaver is free with daily limits. Login to increase your limit.",
      q2: "Does it work on mobile?",
      a2: "Absolutely! It works seamlessly on iPhone, Android, Mac, and Windows.",
      q3: "Where are videos saved?",
      a3: "Videos are automatically saved to your browser's default 'Downloads' folder."
    },
    result: {
      active: "Active",
      inactive: "Inactive",
      copy: "Copy ad text",
      download_options: "Download Options",
      dl_video: "Download HD Video",
      dl_thumb: "Download Thumbnail",
      meta: "Video Size: {size} • Duration: {duration}",
      demo_title: "Demo Mode",
      demo_desc: "This is a frontend simulation. Real video downloading requires a backend server to bypass Facebook security. The Ad ID has been parsed from your link, but the video content is a placeholder."
    },
    status: {
      title: "Processing Request"
    },
    limits: {
      guest_title: "Daily Limit Reached",
      guest_msg: "You have reached the daily limit of 5 downloads for guest users.",
      guest_action: "Login to Get 50/Day",
      user_title: "Daily Limit Reached",
      user_msg: "You have reached the daily limit of 50 downloads. Please come back tomorrow.",
      remaining: "Daily Remaining: {count}"
    }
  },
  zh: {
    nav: {
      chromeExt: '谷歌扩展',
      tutorial: '教程',
      faq: 'FAQ',
      login: '登录',
      getStarted: '开始使用',
      credits: '剩余额度'
    },
    header: {
      how: "使用教程",
      pricing: "定价",
      api: "API",
      faq: "常见问题",
      login: "谷歌登录",
      logout: "退出登录",
      credits: "今日额度"
    },
    hero: {
      title_prefix: "Facebook 广告资料库",
      title_highlight: "终极下载解析神器",
      title_suffix: "",
      full_title: "Facebook 广告资料库 终极下载解析神器",
      subtitle: "只需一键，即可解析并下载 Facebook 广告资料库中的高清视频与文案素材。支持无头浏览器模拟技术，轻松绕过反爬虫限制。",
      placeholder: "在此粘贴 Facebook 广告链接...",
      btn_download: "立即下载",
      btn_processing: "正在处理...",
      example: "示例链接: https://www.facebook.com/ads/library/?id=123...",
      error_title: "解析失败",
      mode_single: "单条解析",
      mode_batch: "批量模式",
      extension_btn: "安装 Chrome 扩展",
      extension_desc: "更快捷、更方便",
      view_tutorial: "查看视频教程",
      stats_hours: "节省时间",
      stats_rating: "用户评分"
    },
    tutorial: {
      title: "使用教程",
      subtitle: "简单三步，轻松下载 Facebook 广告"
    },
    batch: {
      placeholder: "在此粘贴多个 Facebook 广告链接（每行一个）...\n例如：\nhttps://www.facebook.com/ads/library/?id=123...\nhttps://www.facebook.com/ads/library/?id=456...",
      btn_start: "开始批量处理",
      btn_new: "开始新任务",
      progress: "已处理 {current} / {total}",
      status_pending: "等待中",
      status_processing: "解析中...",
      status_failed: "失败",
      action_video: "视频",
      action_cover: "封面",
    },
    history: {
      title: "最近下载记录",
      clear: "清空记录",
      view: "查看详情",
      empty: "暂无历史记录"
    },
    features: {
      title: "为什么顶尖营销人员选择 AdSave",
      subtitle: "分析、保存和迭代爆款素材所需的一切。",
      sourceTitle: "1080p 原画质",
      sourceDesc: "直接从 CDN 获取原始文件。无压缩损耗，画质无损。",
      stealthTitle: "隐身模式",
      stealthDesc: "先进的指纹保护技术，轻松绕过反爬虫检测。",
      batchTitle: "批量解析",
      batchDesc: "支持批量粘贴，一次队列处理多达 50 个链接。",
      statsTitle: "1000万+",
      statsDesc: "成功下载",
      s1_t: "复制链接",
      s1_d: "在 Facebook 广告资料库中找到目标广告，点击资料库\"...\"复制URL。",
      s2_t: "粘贴并解析",
      s2_d: "将链接粘贴到上方输入框。我们的云端引擎将自动解析视频资源。",
      s3_t: "下载保存",
      s3_d: "预览视频内容，点击下载按钮即可保存高清 MP4 文件到您的设备。"
    },
    testimonials: {
      tag: "用户评价",
      title: "超过 10,000+ 创作者的信赖",
      sub: "看看顶尖营销人员如何使用 AdSave 提高效率。"
    },
    faq: {
      badge: "常见问题",
      title: "常见问题解答",
      subtitle: "还有其他问题吗？请通过 support@adsave.app 联系我们"
    },
    footer: {
      copyright: "© 2025 • AdSave.app 版权所有。",
      privacy: "隐私政策",
      terms: "服务条款",
      close: "关闭",
      friendlyLinks: "友情链接",
      contact: "联系我们"
    },
    faq_section: {
      title: "常见问题解答",
      q1: "这个工具是免费的吗？",
      a1: "FB AdsSaver 基础功能免费。未登录用户每日 5 次，登录用户每日 50 次。",
      q2: "支持手机下载吗？",
      a2: "当然！我们完美支持 iPhone、Android、Mac 和 Windows 等所有设备。",
      q3: "下载的视频保存在哪里？",
      a3: "视频会自动保存到您浏览器的默认“下载”文件夹中。"
    },
    result: {
      active: "活跃中",
      inactive: "已停止",
      copy: "复制文案",
      download_options: "下载选项",
      dl_video: "下载高清视频",
      dl_thumb: "下载封面图",
      meta: "视频大小: {size} • 时长: {duration}",
      demo_title: "演示模式",
      demo_desc: "这是一个前端模拟演示。真实的视频下载需要后端服务器支持以绕过 Facebook 安全机制。我们已成功从链接中解析出广告 ID，但下方展示的视频内容为示例占位符。"
    },
    status: {
      title: "正在处理请求"
    },
    limits: {
      guest_title: "今日免费额度已用完",
      guest_msg: "未登录用户每日限制解析 5 条广告。",
      guest_action: "登录升级为 50 条/日",
      user_title: "今日额度已用完",
      user_msg: "您已达到每日 50 条下载上限，请明天再来。",
      remaining: "今日剩余: {count}"
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh'); // Default to Chinese

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
