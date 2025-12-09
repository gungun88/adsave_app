# FB AdsSaver 项目开发文档

## 1. 项目简介
**FB AdsSaver** 是一个专业的 Facebook 广告资料库（Ads Library）视频下载工具。它允许用户输入广告链接，解析并提取其中的高清视频、封面图和文案内容。

项目支持以下核心功能：
*   **单条/批量解析**：支持单个链接或批量链接处理。
*   **用户系统**：模拟 Google 登录，区分游客和注册用户。
*   **额度限制**：基于本地存储的每日下载次数限制（游客 5 次，登录用户 50 次）。
*   **多语言支持**：内置英文 (EN) 和中文 (ZH) 切换。
*   **无头浏览器后端**：使用 Playwright 模拟真实浏览器行为以绕过反爬机制。

---

## 2. 技术栈 (Tech Stack)

### 前端 (Frontend)
*   **核心框架**: React 18
*   **语言**: TypeScript
*   **样式库**: Tailwind CSS
*   **图标库**: Lucide React

### 后端 (Backend)
*   **运行时**: Node.js
*   **Web 框架**: Express
*   **核心爬虫**: Playwright (用于 Headless Browser 操作)

---

## 3. 项目目录结构

```text
/
├── backend/                  # 后端服务目录
│   └── server.js             # Express + Playwright 核心解析逻辑
├── public/                   # 静态资源
│   └── logo.svg              # 网站 Logo
├── src/
│   ├── components/           # UI 组件 (Header, ResultCard, Features 等)
│   ├── lib/                  # 核心上下文与库
│   │   ├── authContext.tsx   # 身份验证上下文 (Mock)
│   │   └── i18n.tsx          # 国际化语言包管理
│   ├── services/             # 业务逻辑服务
│   │   ├── adService.ts      # 广告解析服务 (连接后端或回退到 Mock)
│   │   ├── historyService.ts # 历史记录管理 (LocalStorage)
│   │   └── usageService.ts   # 每日额度计算逻辑
│   ├── types.ts              # TypeScript 类型定义
│   ├── App.tsx               # 主应用入口
│   └── index.tsx             # 渲染入口
└── package.json
```

---

## 4. 核心模块详解

### 4.1 广告解析逻辑 (`services/adService.ts`)
解析服务采用了 **"后端优先，前端兜底"** 的策略：

1.  **验证链接**：首先检查 URL 是否属于 Facebook Ads Library。
2.  **尝试连接后端**：
    *   向 `http://localhost:3001/api/parse` 发送请求。
    *   如果连接成功，返回真实的视频 URL 和元数据。
3.  **降级处理 (Demo Mode)**：
    *   如果后端不可用（网络错误或服务未启动），前端会自动捕获异常。
    *   系统将切换到 **演示模式**，返回预设的 `SAMPLE_ADS` 数据，确保 UI 展示逻辑正常，但视频内容为示例（如 Big Buck Bunny）。

### 4.2 后端爬虫服务 (`backend/server.js`)
这是项目的核心解析引擎。

*   **技术原理**：使用 `playwright` 启动一个无头 Chromium 浏览器。
*   **网络拦截**：
    *   通过 `page.route` 拦截字体和样式表以加快加载速度。
    *   通过 `page.on('response')` 监听网络流，自动捕获类型为 `media` 或后缀为 `.mp4` 的请求，从而提取真实的视频地址 (Video URL)。
*   **DOM 提取**：
    *   如果网络拦截失败，会尝试通过 JavaScript (`document.querySelector`) 直接从页面 DOM 中提取 `<video>` 标签。
    *   同时提取广告文案、发布者名称、CTA 按钮类型等信息。

### 4.3 用户鉴权与额度系统

#### 鉴权 (`lib/authContext.tsx`)
*   目前是一个 **模拟 (Mock)** 系统。
*   `loginWithGoogle` 函数通过 `setTimeout` 模拟网络延迟，然后将一个固定的 Mock User 对象存入 State 和 LocalStorage。
*   **注意**：在生产环境中，需替换为真实的 Firebase Auth 或 OAuth 逻辑。

#### 额度限制 (`services/usageService.ts`)
*   **存储方式**：基于 LocalStorage，Key 格式为 `fb_ads_usage_{userId}`。
*   **重置逻辑**：每次检查时会比对当前日期 (`YYYY-MM-DD`)。如果日期变更，计数器自动归零。
*   **限制规则**：
    *   未登录 (Guest): 5 次/天
    *   已登录 (User): 50 次/天

### 4.4 国际化 (`lib/i18n.tsx`)
*   使用 React Context 管理语言状态。
*   翻译文件是一个简单的 JSON 对象 `translations`，包含 `en` 和 `zh` 两个键值。
*   如需添加新文案，直接在该文件中扩展对象属性即可。

---

## 5. 安装与运行指南

### 前端启动
```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm start
# 访问 http://localhost:3000
```

### 后端启动 (必须启动后端才能进行真实解析)
```bash
# 1. 进入后端目录
cd backend

# 2. 安装后端依赖 (express, playwright, cors)
npm install express playwright cors

# 3. 安装 Playwright 浏览器内核 (首次运行必须)
npx playwright install chromium

# 4. 启动服务器
node server.js
# 服务器将运行在 http://localhost:3001
```

---

## 6. 注意事项与未来规划

1.  **Playwright 环境**：后端服务依赖 Playwright 环境。如果在 Docker 或云服务器 (如 Vercel/Render) 上部署，需要确保环境包含必要的系统依赖库。
2.  **Facebook 反爬**：Facebook 的 DOM 结构和反爬策略经常更新。如果解析失败，可能需要更新 `backend/server.js` 中的选择器逻辑或 User-Agent 配置。
3.  **安全性**：目前的 `authContext` 仅为前端演示。在正式上线前，必须接入真实的后端验证逻辑。
4.  **视频有效期**：Facebook 的 CDN 链接（尤其是 `fbcdn.net`）通常有有效期。解析出的 URL 需要尽快下载，否则可能会过期失效（403 Forbidden）。

---

## 7. 常见问题 (Troubleshooting)

*   **解析一直显示"演示模式"？**
    *   请检查后端服务是否已启动 (`node backend/server.js`)。
    *   检查前端 `services/adService.ts` 中的 API 地址是否指向了正确的后端端口。
*   **Logo 不显示？**
    *   确保 `public/logo.svg` 文件存在。
*   **下载失败？**
    *   如果是跨域问题 (CORS)，后端已配置 `cors` 中间件。如果是浏览器直接拦截了非同源下载，建议让用户右键“另存为”。
