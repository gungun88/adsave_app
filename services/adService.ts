import { AdData } from '../types';
import { Language } from '../lib/i18n';

// Helper type for Chrome API (to avoid TS errors if types aren't installed)
declare const chrome: any;

/**
 * Checks if the code is running inside a Chrome Extension environment.
 */
const isExtension = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
};

/**
 * THE INJECTED SCRAPER SCRIPT (Chrome Extension Logic - Paused)
 */
function scraperFunction() {
  return new Promise((resolve) => {
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
    (async () => {
      try {
        window.scrollTo(0, 500);
        await wait(1500); 

        const videoEl = document.querySelector('video');
        let videoUrl = videoEl ? videoEl.src : null;
        let posterUrl = videoEl ? videoEl.poster : null;

        if (!posterUrl) {
            const imgs = Array.from(document.querySelectorAll('img'));
            const bestImg = imgs.find(img => img.src.includes('fbcdn') && img.width > 200);
            if (bestImg) posterUrl = bestImg.src;
        }

        let publisherName = "Unknown Publisher";
        const h1 = document.querySelector('h1'); 
        if (h1) {
            publisherName = h1.innerText;
        } else {
            const profileLink = document.querySelector('a[href*="/facebook.com/"] span');
            if (profileLink) publisherName = (profileLink as HTMLElement).innerText;
        }

        let publisherAvatar = "https://via.placeholder.com/50";
        const avatarImg = document.querySelector('img[style*="border-radius"]');
        if (avatarImg) publisherAvatar = (avatarImg as HTMLImageElement).src;

        let primaryText = "";
        const textDiv = document.querySelector('div[style*="white-space: pre-wrap"]');
        if (textDiv) {
            primaryText = (textDiv as HTMLElement).innerText;
        } else {
            const blocks = Array.from(document.querySelectorAll('div[dir="auto"]'));
            const largestBlock = blocks.sort((a, b) => (b as HTMLElement).innerText.length - (a as HTMLElement).innerText.length)[0];
            if (largestBlock) primaryText = (largestBlock as HTMLElement).innerText;
        }

        const statusSpan = Array.from(document.querySelectorAll('span')).find(s => s.innerText === 'Active' || s.innerText === 'Inactive');
        const isActive = statusSpan ? statusSpan.innerText === 'Active' : true;

        resolve({
          success: true,
          data: {
            publisherName,
            publisherAvatar,
            isActive,
            primaryText,
            videoUrl,
            posterUrl,
            headline: 'Ad Library Video',
            ctaType: 'Learn More',
            resolution: videoEl ? `${videoEl.videoWidth}x${videoEl.videoHeight}` : 'HD',
            fileSize: 'Unknown'
          }
        });
      } catch (e: any) {
        resolve({ success: false, error: e.toString() });
      }
    })();
  });
}

// Demo ads removed - we now throw proper errors instead

export const parseAdLink = async (url: string, lang: Language, onProgress: (msg: string) => void): Promise<AdData> => {
  
  // ============================================================
  // PATH A: CHROME EXTENSION (Paused)
  // ============================================================
  if (isExtension()) {
    return new Promise((resolve, reject) => {
      onProgress(lang === 'zh' ? 'Extension mode...' : 'Extension mode...');
      // ... extension logic kept for future enablement ...
      reject(new Error("Extension mode is currently paused. Please use Web mode."));
    });
  }

  // ============================================================
  // PATH B: WEB BROWSER (Real Backend -> Fallback to Mock)
  // ============================================================
  
  // 1. Validation
  if (!url.includes('facebook.com/ads/library') && !url.includes('facebook.com/ad_library')) {
    const errorMsg = lang === 'zh' 
      ? '链接无效。请输入正确的 Facebook 广告资料库链接。' 
      : 'Invalid URL. Please provide a valid Facebook Ad Library link.';
    throw new Error(errorMsg);
  }

  // 2. Try Connecting to Backend
  try {
    onProgress(lang === 'zh' ? '正在连接云端解析服务...' : 'Connecting to cloud parser...');
    
    // We attempt to fetch from the local backend server
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout (Playwright needs more time)

    const response = await fetch('http://localhost:3001/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    onProgress(lang === 'zh' ? '解析成功！' : 'Parsing successful!');
    
    const data = await response.json();
    
    return {
      id: data.id || 'unknown',
      publisherName: data.publisherName || 'Facebook Advertiser',
      publisherAvatar: data.publisherAvatar || 'https://via.placeholder.com/50',
      isActive: data.isActive,
      startDate: new Date().toLocaleDateString(),
      primaryText: data.primaryText || '',
      headline: 'Ad Library Video',
      ctaType: 'Learn More',
      videoUrl: data.videoUrl,
      posterUrl: data.posterUrl,
      videoDuration: data.videoDuration || 'Unknown',
      resolution: data.resolution || 'HD',
      fileSize: data.fileSize || 'Unknown',
      isDemo: false
    };

  } catch (error: any) {
    console.error("Failed to parse ad:", error);

    // Provide user-friendly error messages without exposing technical details

    // Timeout error
    if (error.name === 'AbortError') {
      const errorMsg = lang === 'zh'
        ? '解析超时，请稍后重试。'
        : 'Parsing timeout, please try again later.';
      throw new Error(errorMsg);
    }

    // Video not found (image ad or expired)
    if (error.message && error.message.includes('Could not find video URL')) {
      const errorMsg = lang === 'zh'
        ? '无法找到视频。可能的原因：\n\n• 这是图片广告（非视频广告）\n• 广告已过期或被删除\n• 视频未自动播放\n\n请尝试其他广告链接。'
        : 'Video not found. Possible reasons:\n\n• This is an image ad (not a video ad)\n• The ad has expired or been removed\n• Video did not autoplay\n\nPlease try a different ad link.';
      throw new Error(errorMsg);
    }

    // Network/backend errors - hide technical details from users
    if (error.message && (error.message.includes('Failed to fetch') ||
                          error.message.includes('fetch') ||
                          error.message.includes('Network'))) {
      const errorMsg = lang === 'zh'
        ? '服务暂时不可用，请稍后重试。'
        : 'Service temporarily unavailable, please try again later.';
      throw new Error(errorMsg);
    }

    // Server error (500, 400, etc.) - hide technical details
    if (error.message && (error.message.includes('Server returned') ||
                          error.message.includes('500') ||
                          error.message.includes('400') ||
                          error.message.includes('404'))) {
      const errorMsg = lang === 'zh'
        ? '解析失败，请检查链接是否正确或稍后重试。'
        : 'Parsing failed, please check if the link is correct or try again later.';
      throw new Error(errorMsg);
    }

    // Generic error fallback - always user-friendly
    const errorMsg = lang === 'zh'
      ? '解析失败，请稍后重试。'
      : 'Parsing failed, please try again later.';
    throw new Error(errorMsg);
  }
};