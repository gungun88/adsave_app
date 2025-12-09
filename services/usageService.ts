import { User } from '../lib/authContext';

const USAGE_KEY_PREFIX = 'fb_ads_usage_';
const LIMIT_GUEST = 5;
const LIMIT_USER = 50;

interface DailyUsage {
  date: string;
  count: number;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const getStorageKey = (userId?: string) => {
  // Separate storage for guest and specific users
  return `${USAGE_KEY_PREFIX}${userId || 'guest'}`;
};

export const getUsageStats = (user: User | null) => {
  const today = getTodayString();
  const key = getStorageKey(user?.id);
  const limit = user ? LIMIT_USER : LIMIT_GUEST;

  try {
    const recordStr = localStorage.getItem(key);
    if (!recordStr) {
      return { count: 0, limit, remaining: limit };
    }

    const record: DailyUsage = JSON.parse(recordStr);

    // If date is different, reset
    if (record.date !== today) {
      localStorage.removeItem(key);
      return { count: 0, limit, remaining: limit };
    }

    return { 
      count: record.count, 
      limit, 
      remaining: Math.max(0, limit - record.count) 
    };
  } catch (e) {
    return { count: 0, limit, remaining: limit };
  }
};

export const incrementUsage = (user: User | null): boolean => {
  const stats = getUsageStats(user);
  
  if (stats.count >= stats.limit) {
    return false;
  }

  const today = getTodayString();
  const key = getStorageKey(user?.id);
  
  const newRecord: DailyUsage = {
    date: today,
    count: stats.count + 1
  };

  localStorage.setItem(key, JSON.stringify(newRecord));
  return true;
};

export const checkCanDownload = (user: User | null): { allowed: boolean; message?: string } => {
  const stats = getUsageStats(user);
  if (stats.count >= stats.limit) {
    if (!user) {
      return { allowed: false, message: 'limit_guest' };
    } else {
      return { allowed: false, message: 'limit_user' };
    }
  }
  return { allowed: true };
};
