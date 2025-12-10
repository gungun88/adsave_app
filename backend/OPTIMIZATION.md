# 后端性能优化说明

## 📊 优化内容

### 1. ✅ 内存缓存机制
- **功能**: 对解析过的 Facebook 广告链接进行缓存
- **TTL**: 5 分钟
- **效果**: 相同链接的重复请求从 12.57 秒降至 < 100ms
- **自动清理**: 每分钟自动清理过期缓存

### 2. ✅ 性能监控日志
添加了详细的性能计时日志，监控各个阶段的耗时：
- Browser ready (浏览器准备)
- Context & page created (上下文创建)
- Page loaded (页面加载)
- Main container loaded (主容器加载)
- Scroll completed (滚动完成)
- DOM extraction completed (DOM 提取完成)
- Video duration extracted (视频时长提取)
- Poster extraction completed (封面提取完成)
- Total processing time (总处理时间)

### 3. ✅ 优化等待时间
- 主容器等待超时: 10秒 → 5秒
- 滚动后延迟: 500ms → 200ms
- 视频元数据等待: 1000ms → 500ms
- **预计节省**: 约 1.8 秒

### 4. ✅ 缓存命中统计
- 日志显示缓存命中和缓存年龄
- 日志显示缓存保存操作

## 📈 预期性能提升

### 首次请求（冷启动）
- **优化前**: ~12.57 秒
- **优化后**: ~10-11 秒
- **提升**: 约 15-20%

### 缓存命中（重复请求）
- **优化前**: ~12.57 秒
- **优化后**: < 100ms
- **提升**: 99%+

## 🚀 如何测试

### 1. 重启后端服务

如果使用 PM2:
```bash
cd backend
pm2 restart adsave-backend
pm2 logs adsave-backend
```

如果直接运行:
```bash
cd backend
# 先停止旧进程（Ctrl+C）
node server.js
```

### 2. 在前端测试解析

打开浏览器 DevTools → Network 标签:
1. 输入 Facebook 广告链接
2. 点击"单链解析"
3. 查看 `/api/parse` 请求的 **Waiting for server response** 时间

### 3. 测试缓存效果

1. 第一次解析某个链接（记录时间）
2. 立即再次解析同一个链接（应该 < 100ms）
3. 等待 5 分钟后再次解析（缓存过期，重新解析）

### 4. 查看详细日志

后端控制台会显示：
```
[Start] Processing: https://...
[Perf] Browser ready: 50ms
[Perf] Page loaded: 8500ms
[Perf] DOM extraction completed: 9200ms
[Perf] Total processing time: 10500ms
[Cache] Saved result for: https://...
```

第二次请求同一链接：
```
[Cache] Hit! Age: 3s, returning cached data
[Perf] Cache retrieval: 2ms
```

## 📝 日志说明

- `[Start]` - 开始处理请求
- `[Perf]` - 性能计时日志
- `[Cache]` - 缓存相关日志
- `[Timing]` - 各阶段详细计时

## 🔧 进一步优化建议

如果性能仍不满意，可以考虑：

1. **增加缓存时间**: 将 CACHE_TTL 从 5 分钟增加到 15-30 分钟
2. **使用 Redis**: 替换内存缓存为 Redis，支持多实例共享缓存
3. **预热缓存**: 对热门广告进行预解析
4. **并行化**: 进一步并行化 DOM 提取操作

## 📊 性能对比

| 场景 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首次解析 | 12.57s | ~10s | ~20% |
| 缓存命中 | 12.57s | <100ms | 99%+ |
| 5分钟内重复请求 | 12.57s | <100ms | 99%+ |

## 🎯 优化完成

所有计划的优化已实施完成，可以立即测试！
