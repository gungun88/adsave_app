# Google 登录配置完成指南

## ✅ 已完成的配置

1. **Firebase SDK 安装** - ✅ 已安装
2. **Firebase 配置文件** - ✅ lib/firebase.ts
3. **认证上下文更新** - ✅ lib/authContext.tsx（已集成真实 Firebase Auth）
4. **环境变量模板** - ✅ .env.example

## 🚀 接下来的步骤

### 1. 创建 Firebase 项目

访问 [Firebase Console](https://console.firebase.google.com/)

1. 点击 **"添加项目"** 或 **"Add project"**
2. 输入项目名称（例如：`adsave-app`）
3. 可选：启用 Google Analytics
4. 创建项目

### 2. 启用 Google 登录

1. 在 Firebase 控制台，点击左侧菜单 **"Authentication"**（身份验证）
2. 点击 **"Get started"**（开始使用）
3. 选择 **"Sign-in method"**（登录方法）标签
4. 找到 **"Google"**，点击启用
5. 输入项目的公开名称和支持电子邮件
6. 点击 **"保存"**

### 3. 添加 Web 应用

1. 在项目概览页面，点击 Web 图标（</>）
2. 输入应用昵称（例如：`AdSave Web`）
3. **重要**: 勾选 **"Also set up Firebase Hosting"**（可选）
4. 点击 **"注册应用"**

### 4. 获取配置信息

Firebase 会显示类似这样的配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### 5. 配置环境变量

编辑 `.env` 文件，填入你的 Firebase 配置：

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

### 6. 配置授权域名

1. 在 Firebase Console > Authentication > Settings
2. 找到 **"Authorized domains"**（授权域名）
3. 添加你的域名：
   - `localhost`（开发环境，默认已添加）
   - `adsave.app`（生产环境）
   - 任何其他需要的域名

### 7. 重启开发服务器

```bash
# 重启前端
npm run dev

# 或者如果使用 Vite
npm run dev
```

## 🔒 安全注意事项

1. **不要提交 .env 文件到 Git**
   - .env 文件已在 .gitignore 中
   - 只提交 .env.example 模板

2. **API Key 安全**
   - Firebase API Key 可以公开（客户端使用）
   - 安全规则在 Firebase 控制台配置

3. **生产环境配置**
   - 在托管平台（Vercel/Netlify）设置环境变量
   - 不要在代码中硬编码敏感信息

## ✨ 功能说明

### 登录流程
1. 用户点击 "Login with Google" 按钮
2. 弹出 Google 登录窗口
3. 用户选择 Google 账号并授权
4. 自动获取用户信息（姓名、邮箱、头像）
5. 保存到本地存储和状态管理

### 登出流程
1. 用户点击头像登出
2. 清除 Firebase 会话
3. 清除本地存储
4. 重置应用状态

## 📝 代码说明

### lib/firebase.ts
- Firebase 初始化配置
- Google Auth Provider 设置

### lib/authContext.tsx
- 使用 `signInWithPopup` 实现 Google 登录
- 使用 `onAuthStateChanged` 监听认证状态
- 自动转换 Firebase User 到应用 User 类型

## 🐛 常见问题

### 问题 1: "Firebase: Error (auth/popup-blocked)"
**解决**: 浏览器阻止了弹窗，请允许弹窗或使用其他浏览器

### 问题 2: "Firebase: Error (auth/unauthorized-domain)"
**解决**: 在 Firebase Console 的授权域名中添加当前域名

### 问题 3: 环境变量未加载
**解决**:
- 确保 .env 文件在项目根目录
- 确保变量名以 `VITE_` 开头
- 重启开发服务器

## 📚 参考文档

- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)

---

配置完成后，你的应用就可以使用真实的 Google 登录了！🎉
