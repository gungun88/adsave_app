export interface AdData {
  id: string;
  publisherName: string;
  publisherAvatar: string;
  isActive: boolean;
  startDate: string;
  primaryText: string;
  headline?: string;
  ctaType: string;
  videoUrl: string;
  posterUrl: string;
  videoDuration: string;
  resolution: string;
  fileSize: string;
  isDemo?: boolean;
}

export interface ProcessingStep {
  id: number;
  message: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ApiError {
  message: string;
  code: string;
}

export type BatchStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface BatchItem {
  id: string; // unique internal id for the list
  url: string;
  status: BatchStatus;
  data?: AdData;
  error?: string;
}