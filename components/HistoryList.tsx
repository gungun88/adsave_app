import React from 'react';
import { AdData } from '../types';
import { useLanguage } from '../lib/i18n';
import { Play, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: AdData[];
  onSelect: (ad: AdData) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  const { t } = useLanguage();

  if (history.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {t.history.title}
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </h3>
        <button 
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} />
          {t.history.clear}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md hover:border-fb-blue/30 transition-all cursor-pointer flex gap-3 items-center overflow-hidden"
          >
            {/* Thumbnail with Publisher Avatar */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={item.posterUrl}
                alt={item.publisherName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                <Play size={12} className="text-white opacity-80" fill="white" />
              </div>
              {/* Publisher Avatar Overlay */}
              <div className="absolute bottom-1 right-1">
                <img
                  src={item.publisherAvatar}
                  alt={item.publisherName}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">
                {item.publisherName}
              </h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                ID: {item.id}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded bg-gray-50">
                   {item.resolution}
                </span>
                <span className={`text-[10px] font-medium ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};