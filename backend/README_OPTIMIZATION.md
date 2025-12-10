# 后端性能优化总结

## 📊 优化成果

本项目已完成全面的性能优化，包括：

1. ✅ **内存缓存** (默认启用)
2. ✅ **Redis 缓存** (可选，推荐生产环境)
3. ✅ **详细性能监控**
4. ✅ **等待时间优化**
5. ✅ **自动降级策略**

---

## 🎯 性能提升

### 首次解析（冷启动）
- **优化前**: ~12.57 秒
- **优化后**: ~10 秒
- **提升**: 约 20%

### 缓存命中（重复请求）
- **优化前**: ~12.57 秒
- **优化后**: < 100ms
- **提升**: 99%+

---

## 📁 文件说明

### 核心文件

- **`server.js`** - 主服务器文件，已集成缓存和性能监控
- **`config/redis.js`** - Redis 配置文件
- **`.env.example`** - 环境变量模板

### 文档

- **`OPTIMIZATION.md`** - 性能优化详细说明
- **`REDIS_SETUP.md`** - Redis 安装和配置指南（宝塔面板）
- **`README_OPTIMIZATION.md`** - 本文件

---

## 🚀 快速开始

### 选项 1: 使用内存缓存（默认）

无需任何配置，直接启动：

```bash
cd backend
npm install
node server.js
```

系统会自动使用内存缓存。

**优点**:
- ✅ 无需额外安装
- ✅ 配置简单
- ✅ 性能优秀

**缺点**:
- ❌ 服务器重启后缓存丢失
- ❌ 多实例无法共享缓存

---

### 选项 2: 使用 Redis 缓存（推荐）

#### 本地开发环境

1. **安装 Redis**
   ```bash
   # macOS
   brew install redis
   brew services start redis

   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis

   # Windows
   # 下载并安装 Redis for Windows
   ```

2. **启动项目**
   ```bash
   cd backend
   npm install
   node server.js
   ```

系统会自动检测并连接 Redis。

#### 生产环境（宝塔面板）

详细步骤请参考：**[REDIS_SETUP.md](REDIS_SETUP.md)**

简要步骤：
1. 宝塔面板安装 Redis
2. 配置 `.env` 文件
3. 重启后端服务

**优点**:
- ✅ 缓存持久化
- ✅ 多实例共享
- ✅ 自动过期管理

---

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```bash
# Redis Configuration (可选)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache TTL (秒)
CACHE_TTL=300    # 5 分钟

# Server Port
PORT=3001
```

### 缓存时间调整

根据需求调整 `CACHE_TTL`：

- **开发环境**: 60-300 秒（1-5 分钟）
- **生产环境**: 300-1800 秒（5-30 分钟）
- **高流量场景**: 1800-3600 秒（30-60 分钟）

---

## 📈 监控和调试

### 查看性能日志

启动服务后，每次请求会显示详细的性能日志：

```bash
[Start] Processing: https://www.facebook.com/ads/library/?id=123
[Perf] Browser ready: 50ms
[Perf] Page loaded: 8500ms
[Perf] DOM extraction completed: 9200ms
[Perf] Total processing time: 10200ms
[Cache] Redis saved: https://...
```

### 缓存命中日志

```bash
[Cache] Hit! Returning cached data
[Perf] Cache retrieval: 2ms
```

### 使用 PM2 查看日志

```bash
# 实时日志
pm2 logs adsave-backend

# 查看最近 100 行
pm2 logs adsave-backend --lines 100

# 只看错误日志
pm2 logs adsave-backend --err
```

---

## 🔍 故障排查

### Redis 连接失败

**症状**: 日志显示 `Redis not available, using memory cache`

**原因**: Redis 未安装或未启动

**解决**:
- 检查 Redis 是否运行: `redis-cli ping`
- 系统会自动降级到内存缓存，不影响功能

### 性能没有提升

**可能原因**:
1. 缓存未命中（每次都是新链接）
2. Redis 未正确配置
3. 网络延迟（Facebook 服务器响应慢）

**检查方法**:
1. 测试相同链接两次
2. 查看日志确认缓存命中
3. 检查 `[Perf]` 日志定位瓶颈

---

## 🎓 技术细节

### 缓存策略

1. **优先 Redis**: 如果 Redis 可用，优先使用
2. **降级机制**: Redis 失败时自动降级到内存缓存
3. **透明切换**: 上层代码无需关心使用哪种缓存

### 性能优化点

1. **浏览器复用**: 多个请求共享同一个浏览器实例
2. **网络拦截优化**: 阻止不必要的资源加载
3. **等待时间优化**: 减少不必要的延迟
4. **智能缓存**: 自动管理缓存过期

### 数据流程

```
用户请求
    ↓
检查缓存（Redis/Memory）
    ↓ (未命中)
启动 Playwright
    ↓
访问 Facebook 页面
    ↓
提取视频信息
    ↓
保存到缓存
    ↓
返回结果
```

---

## 📚 相关文档

- [性能优化详解](OPTIMIZATION.md)
- [Redis 安装指南](REDIS_SETUP.md)
- [宝塔面板部署](../DEPLOYMENT.md)

---

## 🤝 贡献

如果您有更好的优化建议，欢迎提交 PR 或 Issue！

---

## 📄 许可

MIT License
