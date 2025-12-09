import React from 'react';
import { 
  Download, 
  Link as LinkIcon, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileVideo,
  Image as ImageIcon,
  Copy,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  XCircle,
  FileText,
  RotateCcw
} from 'lucide-react';

export const LanguagesIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path>
  </svg>
);

export const ChromeIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="21.17" x2="12" y1="8" y2="8"></line>
    <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
    <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
  </svg>
);

export { 
  Download, 
  LinkIcon, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileVideo,
  ImageIcon,
  Copy,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  XCircle,
  FileText,
  RotateCcw
};