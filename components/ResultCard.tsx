import React, { useState } from 'react';
import { AdData } from '../types';
import { Download, FileVideo, ImageIcon, Play, CheckCircle2, Copy, AlertCircle } from './Icons';
import { useLanguage } from '../lib/i18n';
import { API_ENDPOINTS } from '../config';

interface ResultCardProps {
  data: AdData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<'video' | 'image' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.primaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (url: string, filename: string, type: 'video' | 'image') => {
    try {
      setDownloading(type);

      // Fetch the file through our backend proxy
      const response = await fetch(API_ENDPOINTS.download, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert(t.lang === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up">
      {/* Demo Warning Banner - Only show if isDemo is true */}
      {data.isDemo && (
        <div className="bg-orange-50 border-b border-orange-100 px-6 py-3 flex items-start gap-3">
          <AlertCircle className="text-orange-500 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <h4 className="text-sm font-bold text-orange-800">{t.result.demo_title}</h4>
            <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
              {t.result.demo_desc}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Left Column: Media Preview */}
        <div className="lg:w-2/5 bg-black relative group">
          <div className="aspect-[1/1] lg:aspect-auto lg:h-full flex items-center justify-center bg-gray-900 overflow-hidden">
             {/* Use poster as background, video on top */}
             <video 
                poster={data.posterUrl} 
                src={data.videoUrl}
                controls 
                className="w-full h-full object-contain"
             />
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Header: Publisher Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={data.publisherAvatar}
                  alt={data.publisherName}
                  className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                />
                <div className="flex flex-col gap-1 items-start">
                  <div className="font-bold text-base text-gray-900 leading-none">{data.publisherName}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 leading-none">
                    <span>ID: {data.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`flex items-center gap-1 ${data.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${data.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {data.isActive ? t.result.active : t.result.inactive}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400 border border-gray-200 rounded px-2 py-1">
                {data.resolution}
              </span>
            </div>

            {/* Content: Ad Copy */}
            <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 relative group">
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                        {data.primaryText}
                    </p>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-500 hover:text-fb-blue opacity-0 group-hover:opacity-100 transition-all"
                        title={t.result.copy}
                    >
                        {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
                {data.headline && (
                    <div className="mt-2 font-bold text-gray-900 text-sm">
                        {data.headline}
                    </div>
                )}
                {data.ctaType && (
                    <div className="mt-2 inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded uppercase">
                        CTA: {data.ctaType}
                    </div>
                )}
            </div>
          </div>

          {/* Footer: Downloads */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.result.download_options}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => handleDownload(data.videoUrl, 'facebook_ad_video_hd.mp4', 'video')}
                    disabled={downloading === 'video'}
                    className="flex items-center justify-center gap-2 w-full bg-fb-blue hover:bg-fb-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileVideo size={18} />
                    <span>{downloading === 'video' ? (t.lang === 'zh' ? '下载中...' : 'Downloading...') : t.result.dl_video}</span>
                </button>

                <button
                    onClick={() => handleDownload(data.posterUrl, 'facebook_ad_thumbnail.jpg', 'image')}
                    disabled={downloading === 'image'}
                    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-2.5 px-4 rounded-lg transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ImageIcon size={18} />
                    <span>{downloading === 'image' ? (t.lang === 'zh' ? '下载中...' : 'Downloading...') : t.result.dl_thumb}</span>
                </button>
            </div>
            <p className="text-center text-xs text-gray-400 pt-2">
                {t.result.meta.replace('{size}', data.fileSize).replace('{duration}', data.videoDuration)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};