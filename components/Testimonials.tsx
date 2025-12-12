import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const reviews = {
  en: [
    {
      name: "Sarah Jenkins",
      role: "E-commerce Manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "AdSave is a lifesaver! I used to screen record ads and they looked terrible. Now I get crisp 1080p files instantly. The AI analysis is just the cherry on top."
    },
    {
      name: "Mike Ross",
      role: "Digital Marketer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      text: "The 'Stealth Mode' is real. I download hundreds of competitor ads daily for research and haven't hit a single block. Absolutely essential tool."
    },
    {
      name: "Emily Chen",
      role: "Creative Strategist",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
      text: "The batch download feature saves my team about 10 hours a week. We just dump the links and go grab coffee. Highly recommended for agencies."
    },
    {
      name: "David Miller",
      role: "Dropshipper",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "I was skeptical about the AI hook generator, but the first variation it suggested actually outperformed my original copy by 30%. Worth every penny."
    },
    {
      name: "Jessica Wu",
      role: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Finally, a tool that downloads the actual raw video file without compression artifacts. My editors love working with the source files from AdSave."
    },
    {
      name: "Tom Baker",
      role: "Agency Owner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      text: "The interface is clean, fast, and no-nonsense. It does exactly what it says. The hook analysis helps us pitch better concepts to clients."
    }
  ],
  zh: [
    {
      name: "李娜",
      role: "电商运营总监",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "AdSave 简直是救星！以前我只能录屏，画质很差。现在能瞬间下载 1080p 的高清原片，AI 分析功能更是锦上添花。"
    },
    {
      name: "张伟",
      role: "数字营销专家",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      text: "\"隐身模式\"真的很强。我每天下载数百个竞对广告做研究，从未被封锁过。这是做素材分析的必备神器。"
    },
    {
      name: "陈薇",
      role: "创意策略师",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
      text: "批量下载功能每周为我的团队节省了大约 10 个小时。我们只需把链接丢进去，喝杯咖啡就搞定了。强烈推荐给广告公司。"
    },
    {
      name: "王强",
      role: "跨境电商卖家",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "一开始我对 AI 写文案持怀疑态度，但它建议的第一个\"黄金前三秒\"文案，实测点击率竟然比原版高出 30%。太值了。"
    },
    {
      name: "刘婷",
      role: "短视频编导",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "终于找到一个能下载无压缩原片的工具了。画质非常清晰，没有水印，后期剪辑处理起来非常方便。"
    },
    {
      name: "赵雷",
      role: "广告代理商",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      text: "界面干净、快速，没有废话。它完美解决了我们的痛点。AI 钩子分析帮助我们向客户提案时更有说服力。"
    }
  ]
};

const ReviewCard = ({ review }: { review: any }) => (
  <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/40 w-full mb-6 break-inside-avoid hover:border-blue-200 transition-colors">
    <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
    </div>
    <div className="text-slate-700 leading-relaxed mb-6 font-medium text-sm">
      "{review.text}"
    </div>
    <div className="flex items-center gap-3">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
      />
      <div className="flex flex-col">
        <div className="text-sm font-bold text-slate-900 leading-none mb-1">{review.name}</div>
        <div className="text-xs text-slate-400 font-medium">{review.role}</div>
      </div>
    </div>
  </div>
);

export const Testimonials: React.FC = () => {
  const { t, language } = useLanguage();
  const currentReviews = reviews[language];

  const createLoop = (items: typeof currentReviews) => {
     return [...items, ...items, ...items, ...items];
  };

  const col1 = createLoop(currentReviews.slice(0, 2));
  const col2 = createLoop(currentReviews.slice(2, 4));
  const col3 = createLoop(currentReviews.slice(4, 6));

  return (
    <div className="w-full max-w-7xl mx-auto mt-32 px-4 mb-20">

      {/* Header */}
      <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-12 text-center">
        <div className="flex justify-center">
            <div className="border border-slate-200 bg-white py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 mb-5 shadow-sm">
                {t.testimonials?.tag || 'User Reviews'}
            </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            {t.testimonials?.title || 'Loved by 10,000+ Creators'}
        </h2>
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
            {t.testimonials?.sub || 'See how marketers are scaling their ad testing with AdSave.'}
        </p>
      </div>

      {/* Scrolling Container */}
      <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] h-[600px] overflow-hidden">

        {/* Column 1 - Slow */}
        <div className="w-full max-w-xs">
            <div className="animate-scroll-vertical pause-on-hover" style={{ animationDuration: '40s' }}>
                {col1.map((review, i) => <ReviewCard key={`c1-${i}`} review={review} />)}
            </div>
        </div>

        {/* Column 2 - Medium (Hidden on mobile) */}
        <div className="hidden md:block w-full max-w-xs">
             <div className="animate-scroll-vertical pause-on-hover" style={{ animationDuration: '30s', animationDelay: '-5s' }}>
                {col2.map((review, i) => <ReviewCard key={`c2-${i}`} review={review} />)}
            </div>
        </div>

        {/* Column 3 - Fast (Hidden on tablet/mobile) */}
        <div className="hidden lg:block w-full max-w-xs">
             <div className="animate-scroll-vertical pause-on-hover" style={{ animationDuration: '35s', animationDelay: '-10s' }}>
                {col3.map((review, i) => <ReviewCard key={`c3-${i}`} review={review} />)}
            </div>
        </div>

      </div>
    </div>
  );
};
