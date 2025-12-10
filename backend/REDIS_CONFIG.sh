#!/bin/bash
# ============================================================================
# AdSave.app - Redis 配置脚本（宝塔面板）
# ============================================================================
# 此脚本将自动配置 Redis 以供 AdSave.app 使用
# 执行前请确保已通过宝塔面板安装 Redis
# ============================================================================

set -e  # 遇到错误立即退出

echo "========================================="
echo "  AdSave.app Redis 自动配置脚本"
echo "========================================="
echo ""

# Redis 密码（已随机生成）
REDIS_PASSWORD="cU8cdYonKihBzeiSb3uiEbDGJLoCIzbW"

# 配置文件路径（宝塔面板默认）
REDIS_CONF="/www/server/redis/redis.conf"

echo "步骤 1: 检查 Redis 配置文件..."
if [ ! -f "$REDIS_CONF" ]; then
    echo "❌ 错误: 找不到 Redis 配置文件: $REDIS_CONF"
    echo "请先通过宝塔面板安装 Redis"
    exit 1
fi
echo "✓ 配置文件存在"

echo ""
echo "步骤 2: 备份原配置文件..."
cp "$REDIS_CONF" "${REDIS_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✓ 备份完成: ${REDIS_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

echo ""
echo "步骤 3: 配置 Redis 密码..."
# 检查是否已有 requirepass 配置
if grep -q "^requirepass" "$REDIS_CONF"; then
    # 如果已存在，替换
    sed -i "s/^requirepass.*/requirepass $REDIS_PASSWORD/" "$REDIS_CONF"
    echo "✓ 密码已更新"
else
    # 如果不存在，在 SECURITY 部分添加
    sed -i "/^# requirepass/a requirepass $REDIS_PASSWORD" "$REDIS_CONF"
    echo "✓ 密码已设置"
fi

echo ""
echo "步骤 4: 配置最大内存..."
# 设置最大内存为 256MB
if grep -q "^maxmemory" "$REDIS_CONF"; then
    sed -i "s/^maxmemory.*/maxmemory 256mb/" "$REDIS_CONF"
else
    sed -i "/^# maxmemory <bytes>/a maxmemory 256mb" "$REDIS_CONF"
fi

# 设置内存淘汰策略
if grep -q "^maxmemory-policy" "$REDIS_CONF"; then
    sed -i "s/^maxmemory-policy.*/maxmemory-policy allkeys-lru/" "$REDIS_CONF"
else
    sed -i "/^# maxmemory-policy/a maxmemory-policy allkeys-lru" "$REDIS_CONF"
fi
echo "✓ 内存配置完成（256MB, LRU 淘汰策略）"

echo ""
echo "步骤 5: 启用 AOF 持久化（可选）..."
sed -i "s/^appendonly no/appendonly yes/" "$REDIS_CONF"
echo "✓ AOF 持久化已启用"

echo ""
echo "步骤 6: 重启 Redis 服务..."
# 尝试多种重启方式
if command -v systemctl &> /dev/null; then
    systemctl restart redis
    echo "✓ Redis 服务已重启（systemctl）"
elif [ -f /etc/init.d/redis ]; then
    /etc/init.d/redis restart
    echo "✓ Redis 服务已重启（init.d）"
else
    echo "⚠ 请手动通过宝塔面板重启 Redis 服务"
fi

echo ""
echo "步骤 7: 测试 Redis 连接..."
sleep 2  # 等待服务完全启动

if redis-cli -a "$REDIS_PASSWORD" ping > /dev/null 2>&1; then
    echo "✓ Redis 连接测试成功！"
else
    echo "⚠ Redis 连接测试失败，请检查服务状态"
fi

echo ""
echo "步骤 8: 配置后端环境变量..."
BACKEND_DIR="/www/wwwroot/adsave_app/backend"
ENV_FILE="$BACKEND_DIR/.env"

if [ -d "$BACKEND_DIR" ]; then
    # 创建 .env 文件
    cat > "$ENV_FILE" << EOF
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD
REDIS_DB=0

# Cache TTL (in seconds)
CACHE_TTL=300

# Server Port
PORT=3001
EOF
    echo "✓ 后端环境变量已配置: $ENV_FILE"
else
    echo "⚠ 后端目录不存在: $BACKEND_DIR"
    echo "   请手动创建 .env 文件"
fi

echo ""
echo "========================================="
echo "  ✓ Redis 配置完成！"
echo "========================================="
echo ""
echo "📋 配置信息："
echo "   Redis 密码: $REDIS_PASSWORD"
echo "   最大内存:   256MB"
echo "   淘汰策略:   allkeys-lru"
echo "   AOF 持久化: 已启用"
echo ""
echo "🔐 重要提示："
echo "   1. 请妥善保管 Redis 密码"
echo "   2. 后端 .env 文件已自动生成"
echo "   3. 备份文件位置: ${REDIS_CONF}.backup.*"
echo ""
echo "🚀 下一步："
echo "   1. 重启后端服务: pm2 restart adsave-backend"
echo "   2. 查看日志: pm2 logs adsave-backend"
echo "   3. 测试缓存功能"
echo ""
echo "========================================="
