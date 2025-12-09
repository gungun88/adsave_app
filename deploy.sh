#!/bin/bash

# AdSave.app 部署脚本
# 使用方法: bash deploy.sh

set -e

echo "======================================"
echo "  AdSave.app 自动部署脚本"
echo "======================================"
echo ""

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 步骤 1: 检查 Node.js
echo -e "${YELLOW}[1/8]${NC} 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未安装 Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo ""

# 步骤 2: 检查 PM2
echo -e "${YELLOW}[2/8]${NC} 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 未安装,正在安装...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✓ PM2 已安装${NC}"
echo ""

# 步骤 3: 检查环境变量
echo -e "${YELLOW}[3/8]${NC} 检查环境变量..."
if [ ! -f .env ]; then
    echo -e "${RED}错误: .env 文件不存在${NC}"
    echo -e "${YELLOW}请复制 .env.example 为 .env 并配置 Firebase 信息${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env 文件存在${NC}"
echo ""

# 步骤 4: 创建日志目录
echo -e "${YELLOW}[4/8]${NC} 创建日志目录..."
mkdir -p logs
echo -e "${GREEN}✓ 日志目录已创建${NC}"
echo ""

# 步骤 5: 安装前端依赖
echo -e "${YELLOW}[5/8]${NC} 安装前端依赖..."
npm install --production=false
echo -e "${GREEN}✓ 前端依赖安装完成${NC}"
echo ""

# 步骤 6: 构建前端
echo -e "${YELLOW}[6/8]${NC} 构建前端..."
npm run build
echo -e "${GREEN}✓ 前端构建完成${NC}"
echo ""

# 步骤 7: 安装后端依赖
echo -e "${YELLOW}[7/8]${NC} 安装后端依赖..."
cd backend
npm install --production
echo -e "${GREEN}✓ 后端依赖安装完成${NC}"

# 安装 Playwright
echo -e "${YELLOW}安装 Playwright 浏览器...${NC}"
npx playwright install chromium --with-deps
echo -e "${GREEN}✓ Playwright 安装完成${NC}"
cd ..
echo ""

# 步骤 8: 启动后端服务
echo -e "${YELLOW}[8/8]${NC} 启动后端服务..."

# 停止旧服务(如果存在)
pm2 delete adsave-backend 2>/dev/null || true

# 使用 PM2 启动
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启(仅首次需要)
pm2 startup 2>/dev/null || true

echo -e "${GREEN}✓ 后端服务启动成功${NC}"
echo ""

# 显示状态
pm2 status

echo ""
echo "======================================"
echo -e "${GREEN}  部署完成!${NC}"
echo "======================================"
echo ""
echo "前端文件位置: ./dist"
echo "后端服务状态: pm2 status"
echo "查看日志: pm2 logs adsave-backend"
echo ""
echo "下一步:"
echo "1. 配置 Nginx 反向代理"
echo "2. 添加域名到 Firebase 授权域名列表"
echo "3. 访问你的域名测试功能"
echo ""
