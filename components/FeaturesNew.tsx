import React from 'react';
import { ShieldCheck, Video, BrainCircuit, Layers } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
  color?: string;
}> = ({ icon, title, desc, className, color = "bg-slate-100 text-slate-900" }) => (
  <div className={`p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between ${className}`}>
    <div>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

interface FeaturesProps {
  onTutorialClick?: () => void;
}

export const FeaturesNew: React.FC<FeaturesProps> = ({ onTutorialClick }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto mt-24 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.features?.title || 'Why Top Marketers Choose AdSave'}</h2>
        <p className="text-slate-500">{t.features?.subtitle || 'Everything you need to analyze, save, and iterate on winning creatives.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <FeatureCard
          icon={<Video size={20} />}
          title={t.features?.sourceTitle || '1080p Source'}
          desc={t.features?.sourceDesc || 'Get the raw file directly from CDN. No compression artifacts.'}
          color="bg-blue-50 text-blue-600"
        />

        <FeatureCard
          icon={<ShieldCheck size={20} />}
          title={t.features?.stealthTitle || 'Stealth Mode'}
          desc={t.features?.stealthDesc || 'Advanced fingerprinting protection prevents detection.'}
          color="bg-green-50 text-green-600"
        />

        <FeatureCard
          icon={<Layers size={20} />}
          title={t.features?.batchTitle || 'Batch Parse'}
          desc={t.features?.batchDesc || 'Queue up to 50 URLs at once via direct bulk paste.'}
          color="bg-orange-50 text-orange-600"
        />

        <div className="p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 flex items-center justify-center text-center">
            <div>
               <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">{t.features?.statsTitle || '10M+'}</h3>
               <p className="text-sm text-slate-500 font-medium">{t.features?.statsDesc || 'Ads Processed'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
