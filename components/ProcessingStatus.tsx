import React from 'react';
import { Loader2 } from './Icons';
import { useLanguage } from '../lib/i18n';

interface ProcessingStatusProps {
  status: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <div className="relative">
          <div className="absolute inset-0 bg-fb-blue opacity-20 rounded-full animate-ping"></div>
          <div className="relative bg-white p-2 rounded-full border-2 border-fb-blue">
            <Loader2 className="animate-spin text-fb-blue" size={32} />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">{t.status.title}</h3>
          <p className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
            {status}
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-xs">
          <div className="h-full bg-fb-blue animate-progress-indeterminate"></div>
        </div>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 30%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};