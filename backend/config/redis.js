const Redis = require('ioredis');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true, // Don't connect immediately, wait for first command
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis connection events
redis.on('connect', () => {
  console.log('[Redis] Connected to Redis server');
});

redis.on('ready', () => {
  console.log('[Redis] Redis client ready');
});

redis.on('error', (err) => {
  console.error('[Redis] Redis error:', err.message);
});

redis.on('close', () => {
  console.log('[Redis] Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('[Redis] Reconnecting to Redis...');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Redis] SIGTERM received, closing Redis connection...');
  await redis.quit();
});

process.on('SIGINT', async () => {
  console.log('[Redis] SIGINT received, closing Redis connection...');
  await redis.quit();
  process.exit(0);
});

module.exports = redis;
