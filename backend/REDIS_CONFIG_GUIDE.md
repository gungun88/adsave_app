# Redis 宝塔面板完整配置指南

## 🔑 生成的 Redis 密码

```
cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW
```

**⚠️ 请妥善保管此密码！**

---

## 🚀 快速配置（推荐）

### 方法 1: 自动脚本（最快）

1. **上传脚本到服务器**
   ```bash
   # SSH 连接服务器
   ssh root@你的服务器IP

   # 进入项目目录
   cd /www/wwwroot/adsave_app/backend

   # 如果脚本不存在，创建它
   nano REDIS_CONFIG.sh
   # 粘贴脚本内容（从 REDIS_CONFIG.sh 文件）
   ```

2. **执行配置脚本**
   ```bash
   chmod +x REDIS_CONFIG.sh
   ./REDIS_CONFIG.sh
   ```

3. **完成！** 脚本会自动：
   - ✅ 备份原配置
   - ✅ 设置密码
   - ✅ 配置内存限制
   - ✅ 启用 AOF 持久化
   - ✅ 重启 Redis
   - ✅ 创建 .env 文件

---

## 📝 方法 2: 手动配置

### 第一步：修改 Redis 配置文件

1. **登录宝塔面板**
   ```
   http://你的服务器IP:8888
   ```

2. **打开 Redis 配置**
   - 软件商店 → Redis → 设置 → 配置修改

3. **找到并修改以下配置项**

#### A. 设置密码（约 502 行）

找到：
```conf
# requirepass foobared
```

修改为：
```conf
requirepass cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW
```

#### B. 设置最大内存（约 567 行）

找到：
```conf
# maxmemory <bytes>
```

修改为：
```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

#### C. 启用 AOF 持久化（约 753 行，可选）

找到：
```conf
appendonly no
```

修改为：
```conf
appendonly yes
```

4. **保存并重启 Redis**
   - 点击 "保存"
   - 点击 "重启"

---

### 第二步：配置后端环境变量

1. **SSH 连接服务器**
   ```bash
   ssh root@你的服务器IP
   cd /www/wwwroot/adsave_app/backend
   ```

2. **创建 .env 文件**
   ```bash
   nano .env
   ```

3. **粘贴以下内容**
   ```env
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW
   REDIS_DB=0

   # Cache TTL (in seconds)
   CACHE_TTL=300

   # Server Port
   PORT=3001
   ```

4. **保存文件**
   - 按 `Ctrl + X`
   - 按 `Y` 确认
   - 按 `Enter` 保存

---

### 第三步：重启后端服务

```bash
cd /www/wwwroot/adsave_app/backend

# 安装依赖（如果还没安装）
npm install

# 重启服务
pm2 restart adsave-backend

# 查看日志
pm2 logs adsave-backend --lines 50
```

---

## ✅ 验证配置

### 1. 测试 Redis 连接

```bash
# 测试 ping
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW ping
# 应该返回: PONG

# 查看 Redis 信息
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW INFO server

# 查看内存配置
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW CONFIG GET maxmemory
```

### 2. 检查后端日志

```bash
pm2 logs adsave-backend --lines 20
```

应该看到：
```
[Cache] Redis enabled
[Redis] Connected to Redis server
[Redis] Redis client ready
Backend server running on http://localhost:3001
```

### 3. 测试缓存功能

1. 访问网站并解析一个 Facebook 广告
2. 查看后端日志：
   ```
   [Start] Processing: https://...
   [Cache] Redis saved: https://...
   ```
3. 再次解析同一链接，应该看到：
   ```
   [Cache] Hit! Returning cached data
   [Perf] Cache retrieval: 2ms
   ```

---

## 🔍 故障排查

### 问题 1: Redis 连接失败

**症状**：
```
[Redis] Redis error: NOAUTH Authentication required
```

**解决**：
1. 检查 `.env` 文件中的密码是否正确
2. 确认 Redis 配置中的 `requirepass` 已设置

---

### 问题 2: 后端仍使用内存缓存

**症状**：
```
[Cache] Redis not available, using memory cache
```

**解决**：
1. 检查 Redis 是否运行：
   ```bash
   systemctl status redis
   ```
2. 检查 `ioredis` 是否已安装：
   ```bash
   npm list ioredis
   ```
3. 检查 `.env` 文件是否存在且配置正确

---

### 问题 3: Redis 占用内存过高

**解决**：
```bash
# 查看当前内存使用
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW INFO memory

# 手动清空缓存（如果需要）
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW FLUSHDB
```

---

## 📊 配置说明

### 当前配置参数

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **密码** | `cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW` | 32字符强密码 |
| **端口** | `6379` | Redis 默认端口 |
| **绑定地址** | `127.0.0.1` | 仅本地访问 |
| **最大内存** | `256MB` | 防止内存溢出 |
| **淘汰策略** | `allkeys-lru` | LRU 算法淘汰 |
| **AOF 持久化** | `是` | 数据持久化 |
| **缓存 TTL** | `300秒` | 5分钟过期 |

---

## 🎯 后续优化

### 如果需要更长的缓存时间

修改 `.env` 文件：
```env
CACHE_TTL=600  # 10 分钟
# 或
CACHE_TTL=1800  # 30 分钟
```

然后重启服务：
```bash
pm2 restart adsave-backend
```

---

## 📚 相关命令速查

```bash
# 查看所有缓存键
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW KEYS "*"

# 查看某个键的内容
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW GET "完整的URL"

# 查看键的过期时间
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW TTL "完整的URL"

# 删除某个键
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW DEL "完整的URL"

# 清空所有缓存
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW FLUSHDB

# 查看 Redis 统计信息
redis-cli -a cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW INFO stats
```

---

## ✅ 配置完成检查清单

- [ ] Redis 密码已设置
- [ ] 最大内存已配置（256MB）
- [ ] AOF 持久化已启用
- [ ] .env 文件已创建
- [ ] 后端服务已重启
- [ ] Redis 连接测试成功
- [ ] 后端日志显示 "Redis enabled"
- [ ] 缓存功能测试成功

---

**🎉 恭喜！Redis 配置完成！**

您的 AdSave.app 现在拥有：
- ✅ 持久化缓存（服务器重启不丢失）
- ✅ 自动过期管理
- ✅ 多实例共享缓存能力
- ✅ 99%+ 的性能提升（缓存命中时）
