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

# 重启后端服务
pm2 restart adsave-backend
```

---

## ⚠️ 常见问题

### 1. Playwright 安装失败
```bash
# 手动安装依赖
sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
```

### 2. 后端无法启动
```bash
# 检查端口占用
netstat -tunlp | grep 3001

# 查看 PM2 日志
pm2 logs adsave-backend --lines 100
```

### 3. 前端无法访问后端
- 检查 Nginx 配置是否正确
- 确认后端运行在 3001 端口
- 检查防火墙设置

### 4. Google 登录失败
- 确认域名已添加到 Firebase 授权域名列表
- 检查 .env 配置是否正确
- 查看浏览器控制台错误信息

---

## 📊 性能优化建议

1. **启用 Gzip 压缩** (在宝塔面板 Nginx 设置中)
2. **配置 CDN** (可选,加速静态资源)
3. **监控服务器资源** (宝塔面板内置监控)
4. **定期备份数据** (宝塔面板计划任务)

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
