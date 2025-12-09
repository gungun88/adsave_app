import React from 'react';
import { LinkIcon, Download, Play } from './Icons';
import { useLanguage } from '../lib/i18n';

interface FeaturesProps {
  onTutorialClick?: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onTutorialClick }) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-fb-blue rounded-2xl flex items-center justify-center mb-6">
                <LinkIcon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.features.s1_t}</h3>
              <p className="text-gray-500">
                {t.features.s1_d}
                {onTutorialClick && (
                  <>
                    {' '}
                    <button
                      onClick={onTutorialClick}
                      className="text-fb-blue hover:text-fb-dark font-medium transition-colors underline"
                    >
                      {t.hero.view_tutorial}
                    </button>
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-fb-blue rounded-2xl flex items-center justify-center mb-6">
                <Play size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.features.s2_t}</h3>
              <p className="text-gray-500">{t.features.s2_d}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-fb-blue rounded-2xl flex items-center justify-center mb-6">
                <Download size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t.features.s3_t}</h3>
              <p className="text-gray-500">{t.features.s3_d}</p>
            </div>
          </div>
        </div>

        {/* FAQ Section (Replaces Technical Features Grid) */}
        <div className="max-w-3xl mx-auto pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            {t.faq_section.title}
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.faq_section.q1}</h3>
              <p className="text-gray-600 leading-relaxed">{t.faq_section.a1}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.faq_section.q2}</h3>
              <p className="text-gray-600 leading-relaxed">{t.faq_section.a2}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:bg-gray-100 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.faq_section.q3}</h3>
              <p className="text-gray-600 leading-relaxed">{t.faq_section.a3}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};