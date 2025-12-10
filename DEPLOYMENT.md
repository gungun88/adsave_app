# AdSave.app 宝塔面板部署指南

## 📋 部署前准备

### 服务器要求
- **操作系统**: Linux (推荐 Ubuntu 20.04+ 或 CentOS 7+)
- **内存**: 至少 2GB RAM (推荐 4GB+)
- **存储**: 至少 10GB 可用空间
- **Node.js**: 18.x 或更高版本
- **宝塔面板**: 已安装并配置好

### 必需软件
- Node.js (通过宝塔面板安装)
- PM2 (进程管理器)
- Nginx (已包含在宝塔面板)

### 可选软件（推荐）
- **Redis** (缓存服务，提升性能)
  - 安装后可实现持久化缓存
  - 多实例部署时共享缓存
  - 详见：[Redis 集成指南](backend/REDIS_SETUP.md)

---

## 🚀 部署步骤

### 第一步: 在宝塔面板安装必要软件

1. **登录宝塔面板**
   - 访问: `http://你的服务器IP:8888`
   
2. **安装 Node.js**
   - 软件商店 → 运行环境 → Node.js
   - 选择版本: **v18.x** 或更高
   - 点击安装

3. **安装 PM2**
   ```bash
   npm install -g pm2
   ```

### 第二步: 创建网站

1. **在宝塔面板创建网站**
   - 网站 → 添加站点
   - 域名: `你的域名.com`
   - 根目录: `/www/wwwroot/adsave_app`
   - PHP版本: 纯静态
   - 创建数据库: 否

2. **配置 SSL 证书** (推荐)
   - 在网站设置中配置 SSL
   - 使用 Let's Encrypt 免费证书或上传自己的证书

### 第三步: 上传代码到服务器

**方式 1: 使用 Git (推荐)**
```bash
# SSH 连接到服务器
cd /www/wwwroot
git clone https://github.com/gungun88/adsave_app.git
cd adsave_app
```

**方式 2: 使用宝塔面板文件管理**
- 打包项目为 zip 文件
- 通过宝塔面板上传到 `/www/wwwroot/adsave_app`
- 解压缩

### 第四步: 配置环境变量

```bash
cd /www/wwwroot/adsave_app

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件,填入你的 Firebase 配置
nano .env
```

在 `.env` 文件中填入:
```env
VITE_FIREBASE_API_KEY=你的API密钥
VITE_FIREBASE_AUTH_DOMAIN=你的项目ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目ID
VITE_FIREBASE_STORAGE_BUCKET=你的项目ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
VITE_FIREBASE_APP_ID=你的应用ID
VITE_FIREBASE_MEASUREMENT_ID=你的测量ID
```

### 第五步: 安装依赖和构建前端

```bash
# 安装前端依赖
npm install

# 构建前端
npm run build

# 安装后端依赖
cd backend
npm install

# (可选) 配置 Redis - 详见 backend/REDIS_SETUP.md
# 如果不配置 Redis，系统会自动使用内存缓存

# 安装 Playwright 浏览器
npx playwright install chromium
npx playwright install-deps
```

### 第六步: 配置 PM2 启动后端

```bash
# 在项目根目录创建 PM2 配置
cd /www/wwwroot/adsave_app

# 使用 PM2 启动后端
pm2 start backend/server.js --name "adsave-backend"

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

### 第七步: 配置 Nginx 反向代理

在宝塔面板中配置 Nginx:

1. **网站设置 → 配置文件**
2. **添加以下配置**:

```nginx
# 前端静态文件
location / {
    root /www/wwwroot/adsave_app/dist;
    try_files $uri $uri/ /index.html;
    index index.html;
}

# 后端 API 代理
location /api/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}
```

3. **保存并重载配置**

### 第八步: 更新 Firebase 授权域名

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择你的项目
3. **Authentication → Settings → Authorized domains**
4. 添加你的域名: `你的域名.com`

### 第九步: 验证部署

1. 访问你的域名: `https://你的域名.com`
2. 测试 Google 登录功能
3. 测试视频下载功能

---

## 🔧 常用命令

### PM2 管理命令
```bash
# 查看运行状态
pm2 status

# 查看日志
pm2 logs adsave-backend

# 重启服务
pm2 restart adsave-backend

# 停止服务
pm2 stop adsave-backend

# 删除服务
pm2 delete adsave-backend
```

### 更新部署
```bash
cd /www/wwwroot/adsave_app

# 拉取最新代码
git pull origin main

# 重新构建前端
npm install
npm run build

# 更新后端依赖
cd backend
npm install
cd ..

# 重启后端服务
pm2 restart adsave-backend

# 重载 Nginx
nginx -s reload

# 验证部署
pm2 status
pm2 logs adsave-backend --lines 20
```

### 快速回滚到上一个版本
```bash
cd /www/wwwroot/adsave_app

# 查看提交历史
git log --oneline -5

# 回滚到指定版本 (替换 COMMIT_HASH 为实际的提交哈希)
git reset --hard COMMIT_HASH

# 重新构建和重启
npm run build
pm2 restart adsave-backend
```

---

## ⚠️ 故障排除

### 1. "服务暂时不可用" 错误

**症状**: 前端显示 "服务暂时不可用,请稍后重试"

**原因**:
- 后端服务未运行
- 后端端口被占用
- Nginx 代理配置错误

**解决方案**:
```bash
# 1. 检查后端状态
pm2 status

# 2. 如果状态是 stopped 或 errored
pm2 logs adsave-backend --lines 50

# 3. 重启服务
pm2 restart adsave-backend

# 4. 如果重启失败,删除并重新创建
pm2 delete adsave-backend
cd /www/wwwroot/adsave_app
pm2 start ecosystem.config.js

# 5. 检查端口占用
netstat -tunlp | grep 3001

# 6. 测试后端是否响应
curl http://localhost:3001/api/parse -X POST -H "Content-Type: application/json" -d '{"url":"test"}'
```

### 2. CSS 文件 404 错误

**症状**: 浏览器控制台显示 CSS 文件加载失败

**原因**:
- 前端未正确构建
- Nginx root 路径配置错误
- dist 目录不存在或为空

**解决方案**:
```bash
cd /www/wwwroot/adsave_app

# 1. 检查 dist 目录
ls -la dist/

# 2. 如果 dist 为空或不存在,重新构建
npm install
npm run build

# 3. 验证 dist 目录内容
ls -la dist/
# 应该看到 index.html, assets/ 等文件

# 4. 检查 Nginx 配置中的 root 路径
# 应该是: root /www/wwwroot/adsave_app/dist;

# 5. 重载 Nginx
nginx -s reload
```

### 3. CORS 错误

**症状**: 控制台显示 "Access to fetch has been blocked by CORS policy"

**原因**:
- Nginx 反向代理配置错误
- 后端 CORS 中间件问题

**解决方案**:
```bash
# 1. 检查 Nginx 配置中是否有 /api/ 代理
# 在宝塔面板 → 网站设置 → 配置文件中查找:
# location /api/ {
#     proxy_pass http://127.0.0.1:3001/;
#     ...
# }

# 2. 确认配置正确后重载 Nginx
nginx -t
nginx -s reload

# 3. 测试 API 代理
curl https://adsave.app/api/parse -X POST -H "Content-Type: application/json" -d '{"url":"test"}'
```

### 4. Playwright 安装失败
```bash
# 手动安装系统依赖
sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# 重新安装 Playwright
cd /www/wwwroot/adsave_app/backend
npx playwright install chromium
npx playwright install-deps
```

### 5. 后端服务一直重启 (crash loop)

**症状**: `pm2 status` 显示 restart 次数不断增加

**解决方案**:
```bash
# 1. 查看详细错误日志
pm2 logs adsave-backend --err --lines 100

# 2. 常见原因:
# - Node.js 版本不兼容 (需要 v18+)
# - 依赖包未正确安装
# - 代码语法错误

# 3. 验证 Node.js 版本
node -v
# 应该是 v18.x 或更高

# 4. 清理并重新安装依赖
cd /www/wwwroot/adsave_app/backend
rm -rf node_modules package-lock.json
npm install

# 5. 测试后端是否能手动启动
node server.js
# 如果能看到 "Backend server running on http://localhost:3001" 说明代码没问题
# 按 Ctrl+C 停止,然后用 PM2 启动
pm2 start ecosystem.config.js
```

### 6. 视频解析速度慢 (10秒+)

**原因**: 服务器性能不足或网络延迟

**解决方案**:
```bash
# 1. 检查服务器资源
free -h  # 查看内存
top  # 查看 CPU 使用率

# 2. 如果内存不足 (< 2GB 可用)
# 考虑升级服务器或添加 swap

# 3. 检查网络延迟
ping facebook.com

# 4. 优化已在最新代码中实现
# 拉取最新优化代码
cd /www/wwwroot/adsave_app
git pull origin main
pm2 restart adsave-backend
```

### 7. Google 登录失败

**症状**: 点击登录按钮后弹窗失败或显示错误

**解决方案**:
```bash
# 1. 检查 Firebase 配置
cat /www/wwwroot/adsave_app/.env
# 确认所有 VITE_FIREBASE_* 变量都已正确配置

# 2. 验证域名已添加到 Firebase
# 访问: https://console.firebase.google.com/project/YOUR_PROJECT/authentication/settings
# 在 Authorized domains 中添加你的域名

# 3. 检查浏览器控制台
# 按 F12 打开开发者工具,查看 Console 标签中的错误信息

# 4. 常见错误码:
# - auth/unauthorized-domain: 域名未授权
# - auth/api-key-not-valid: API 密钥无效
# - auth/operation-not-allowed: Google 登录未启用
```

---

## 🔧 日常维护

### 监控服务状态
```bash
# 查看所有 PM2 进程
pm2 status

# 查看实时日志
pm2 logs adsave-backend

# 查看资源使用情况
pm2 monit

# 查看详细信息
pm2 show adsave-backend
```

### 清理日志文件
```bash
# PM2 日志可能会变得很大
pm2 flush  # 清空所有日志

# 或者只清空特定应用的日志
pm2 flush adsave-backend
```

### 备份数据
```bash
# 备份整个项目
cd /www/wwwroot
tar -czf adsave_app_backup_$(date +%Y%m%d).tar.gz adsave_app/

# 备份 .env 文件 (重要!)
cp /www/wwwroot/adsave_app/.env /root/backups/

# 使用宝塔面板计划任务自动备份
# 宝塔面板 → 计划任务 → 添加任务
```

### 性能监控
```bash
# 查看 Nginx 访问日志
tail -f /www/wwwlogs/adsave_app_access.log

# 查看 Nginx 错误日志
tail -f /www/wwwlogs/adsave_app_error.log

# 统计访问量
cat /www/wwwlogs/adsave_app_access.log | wc -l
```

---

## 🚀 性能优化建议 (已实现)

### 后端优化
- ✅ 浏览器复用 (减少启动时间)
- ✅ 激进资源阻止 (加快页面加载)
- ✅ 减少等待时间 (优化 delay)
- ✅ 优化超时设置

### 前端优化
- ✅ Gzip 压缩 (Nginx 配置)
- ✅ 静态资源缓存
- ✅ 代码分割 (Vite 自动)

### 预期性能
- **视频解析**: 5-7秒 (优化前 10秒+)
- **页面加载**: < 2秒
- **下载速度**: 取决于网络和视频大小

---

## 🔒 安全建议

1. **修改宝塔面板默认端口**
2. **配置防火墙规则**
3. **定期更新系统和软件**
4. **使用 HTTPS**
5. **定期备份代码和配置**

---

## 📞 支持

如遇到问题,请查看:
- [项目 GitHub](https://github.com/gungun88/adsave_app)
- [宝塔面板文档](https://www.bt.cn/bbs/)
- [PM2 文档](https://pm2.keymetrics.io/)
