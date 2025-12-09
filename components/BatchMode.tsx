import React, { useState } from 'react';
import { Layers, Loader2, CheckCircle2, XCircle, FileVideo, ImageIcon, RotateCcw } from './Icons';
import { useLanguage } from '../lib/i18n';
import { BatchItem } from '../types';
import { parseAdLink } from '../services/adService';
import { addToHistory } from '../services/historyService';

interface BatchModeProps {
  onHistoryUpdate: () => void;
}

export const BatchMode: React.FC<BatchModeProps> = ({ onHistoryUpdate }) => {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleStart = async () => {
    // Split by newline and filter empty
    const urls = inputText.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    if (urls.length === 0) return;

    // Create initial items
    const initialItems: BatchItem[] = urls.map((url, index) => ({
      id: `batch-${Date.now()}-${index}`,
      url,
      status: 'pending'
    }));

    setItems(initialItems);
    setIsProcessing(true);
    setProgress({ current: 0, total: initialItems.length });

    // Process sequentially
    for (let i = 0; i < initialItems.length; i++) {
      const currentId = initialItems[i].id;
      
      // Update status to processing
      setItems(prev => prev.map(item => 
        item.id === currentId ? { ...item, status: 'processing' } : item
      ));

      try {
        // Call Service
        const data = await parseAdLink(initialItems[i].url, language, () => {});
        
        // Success
        setItems(prev => prev.map(item => 
          item.id === currentId ? { ...item, status: 'completed', data } : item
        ));
        
        // Add to global history
        addToHistory(data);
        onHistoryUpdate();

      } catch (error: any) {
        // Error
        setItems(prev => prev.map(item => 
          item.id === currentId ? { ...item, status: 'failed', error: error.message || 'Error' } : item
        ));
      }

      setProgress(prev => ({ ...prev, current: prev.current + 1 }));
    }

    setIsProcessing(false);
  };

  const resetBatch = () => {
    setItems([]);
    setInputText('');
    setIsProcessing(false);
  };

  // Render Input Form if no items in queue
  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.batch.placeholder}
            className="w-full h-48 p-4 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-fb-blue focus:ring-4 focus:ring-blue-50/50 transition-all resize-none shadow-sm"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
              {inputText.split('\n').filter(l => l.trim()).length} URLs
            </span>
          </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={!inputText.trim()}
          className={`mt-4 w-full h-12 flex items-center justify-center gap-2 bg-fb-blue text-white font-bold rounded-xl transition-all duration-200 ${
            !inputText.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-fb-dark hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Layers size={20} />
          {t.batch.btn_start}
        </button>
      </div>
    );
  }

  // Render Results List
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
           <h3 className="font-bold text-gray-900">
             {t.batch.progress.replace('{current}', String(progress.current)).replace('{total}', String(progress.total))}
           </h3>
           {isProcessing && (
             <div className="w-48 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
               <div 
                 className="h-full bg-fb-blue transition-all duration-300"
                 style={{ width: `${(progress.current / progress.total) * 100}%` }}
               ></div>
             </div>
           )}
        </div>
        
        {!isProcessing && (
          <button 
            onClick={resetBatch}
            className="flex items-center gap-2 text-sm text-fb-blue font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            {t.batch.btn_new}
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-all ${
              item.status === 'processing' ? 'border-fb-blue shadow-md ring-2 ring-blue-50' : 'border-gray-200'
            }`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {item.status === 'pending' && <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />}
              {item.status === 'processing' && <Loader2 className="w-8 h-8 text-fb-blue animate-spin" />}
              {item.status === 'completed' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
              {item.status === 'failed' && <XCircle className="w-8 h-8 text-yellow-600" />}
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                 <p className="text-xs font-mono text-gray-400 truncate max-w-[200px] sm:max-w-md">
                   {item.url}
                 </p>
              </div>

              {item.status === 'processing' && (
                <p className="text-sm font-medium text-fb-blue">{t.batch.status_processing}</p>
              )}

              {item.status === 'failed' && (
                <p className="text-sm font-medium text-gray-900">{item.error || t.batch.status_failed}</p>
              )}

              {item.status === 'completed' && item.data && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.data.publisherAvatar} className="w-5 h-5 rounded-full" alt="" />
                    <span className="text-sm font-bold text-gray-900">{item.data.publisherName}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">• {item.data.fileSize}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {item.status === 'completed' && item.data && (
              <div className="flex items-center gap-2 flex-shrink-0">
                 <a 
                   href={item.data.videoUrl} 
                   download="video.mp4"
                   target="_blank"
                   rel="noreferrer"
                   className="p-2 text-fb-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                   title={t.batch.action_video}
                 >
                   <FileVideo size={18} />
                 </a>
                 <a 
                   href={item.data.posterUrl} 
                   download="cover.jpg"
                   target="_blank"
                   rel="noreferrer"
                   className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                   title={t.batch.action_cover}
                 >
                   <ImageIcon size={18} />
                 </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};