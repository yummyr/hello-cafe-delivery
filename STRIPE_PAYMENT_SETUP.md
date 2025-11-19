# Stripe支付集成完成指南

## 🎉 支付功能已成功实现！

完整的Stripe支付集成已经完成，包括前后端支付页面、Webhook回调和订单状态管理。

## 📋 功能概览

### ✅ 已完成功能
- ✅ Stripe支付服务层完整实现
- ✅ 前端支付页面组件，支持多种测试卡号
- ✅ 后端支付API端点（PaymentIntent, Checkout Session）
- ✅ Stripe Webhook处理支付成功回调
- ✅ 订单状态自动更新（支付成功、失败）
- ✅ 数据库字段支持（stripe_session_id, stripe_payment_intent_id, payment_time）

### 🔧 技术实现
- **后端**: Spring Boot + Stripe Java SDK
- **前端**: React + Stripe React Elements
- **数据库**: MySQL，新增Stripe相关字段
- **安全**: Webhook签名验证

## 🚀 启动指南

### 1. 环境变量配置

在 `application.yml` 中配置以下环境变量：

```yaml
stripe:
  secret-key: ${stripe.secret-key}            # Stripe Secret Key (sk_test_...)
  publishable-key: ${stripe.publishable-key}  # Stripe Publishable Key (pk_test_...)
  webhook:
    secret: ${stripe.webhook.secret}         # Webhook签名密钥

frontend:
  url: ${frontend.url:http://localhost:3000}  # 前端URL，用于重定向
```

### 2. 启动后端服务

```bash
cd hello-cafe-api
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 3. 启动前端服务

```bash
cd hello-cafe-app
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 💳 测试支付流程

### 1. 访问支付页面

```
http://localhost:3000/payment
```

### 2. 测试卡号

支付页面已内置测试卡号信息：

| 卡类型 | 卡号 | 到期日期 | CVC |
|--------|------|----------|-----|
| Visa | 4242 4242 4242 4242 | 任何未来日期 | 任意3位 |
| Mastercard | 5555 5555 5555 4444 | 任何未来日期 | 任意3位 |
| 失败测试 | 4000 0000 0000 9995 | 任何未来日期 | 任意3位 |

### 3. 支付流程

1. **用户访问支付页面** → 显示支付表单和测试卡信息
2. **输入测试卡号** → 使用任意测试卡号
3. **提交支付** → 前端调用Stripe处理支付
4. **支付成功** → 自动跳转到成功页面
5. **Webhook回调** → 后端自动更新订单状态为"已支付"

## 🔌 API端点

### 支付相关端点

```http
POST   /api/payment/create-payment-intent     # 创建PaymentIntent
POST   /api/payment/create-checkout-session   # 创建Checkout会话
POST   /api/payment/confirm-payment           # 确认支付状态
GET    /api/payment/verify-session/{id}       # 验证支付会话
GET    /api/payment/order/{orderId}           # 获取订单支付信息
POST   /api/payment/webhook                   # Stripe Webhook端点
GET    /api/payment/webhook/test              # Webhook测试端点
```

### 请求示例

#### 创建PaymentIntent
```bash
curl -X POST http://localhost:8080/api/payment/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000,
    "currency": "usd",
    "orderId": "123"
  }'
```

#### 响应格式
```json
{
  "code": 1,
  "data": {
    "clientSecret": "pi_123...",
    "paymentIntentId": "pi_123..."
  },
  "msg": "success"
}
```

## 📊 订单状态管理

### 支付状态映射
- `支付成功`: 订单状态 → 4 (PAID), payStatus → 1 (已支付)
- `支付失败`: 订单状态 → 0 (PAYMENT_FAILED), payStatus → 0 (未支付)

### 数据库字段
```sql
-- 新增字段
stripe_session_id VARCHAR(255)        -- Stripe会话ID
stripe_payment_intent_id VARCHAR(255) -- Stripe支付意图ID
payment_time DATETIME                 -- 支付时间
```

## 🔄 Webhook配置

### 1. Stripe Dashboard设置

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 **Developers → Webhooks**
3. 点击 **Add endpoint**
4. 设置端点URL: `https://your-domain.com/api/payment/webhook`
5. 选择监听事件:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`

### 2. 本地测试Webhook

使用Stripe CLI测试Webhook：

```bash
# 安装Stripe CLI
npm install -g stripe-cli

# 登录Stripe
stripe login

# 转发Webhook事件到本地
stripe listen --forward-to localhost:8080/api/payment/webhook
```

## 🎯 使用场景

### 1. 购物车支付
```javascript
// 从购物车跳转到支付页面
navigate(`/payment?amount=${cartTotal * 100}`);
```

### 2. 订单支付
```javascript
// 支付特定订单
navigate(`/payment?orderId=${orderId}&amount=${orderAmount * 100}`);
```

### 3. 支付成功回调
```javascript
// 支付成功后重定向到
// /payment/success?payment_intent=pi_123...
```

## 🐛 故障排除

### 常见问题

1. **Stripe API密钥错误**
   - 确保使用测试密钥 (sk_test_...)
   - 检查环境变量配置

2. **Webhook签名验证失败**
   - 确保Webhook密钥配置正确
   - 检查请求头中的Stripe-Signature

3. **订单状态未更新**
   - 检查Webhook端点是否可访问
   - 查看后端日志确认事件处理

4. **前端支付失败**
   - 确保Stripe publishable key正确
   - 检查网络请求和CORS配置

### 调试日志

后端日志包含详细的支付处理信息：

```bash
# 查看Spring Boot应用日志
tail -f logs/application.log

# 搜索支付相关日志
grep "stripe\|payment" logs/application.log
```

## 🔒 安全注意事项

1. **API密钥管理**
   - 永远不要在前端代码中暴露Secret Key
   - 使用环境变量存储敏感信息

2. **Webhook安全**
   - 始终验证Webhook签名
   - 实现重放攻击防护

3. **PCI合规**
   - 使用Stripe Elements确保PCI合规
   - 不要处理或存储原始卡号

## 📈 扩展功能

### 可选扩展
- [ ] 订阅支付 (Stripe Subscriptions)
- [ ] 退款处理
- [ ] 部分退款
- [ ] 多币种支持
- [ ] Apple Pay / Google Pay
- [ ] 保存支付方式

---

🎉 **恭喜！Stripe支付集成已完全完成！**

现在您可以：
1. 启动前后端服务
2. 使用测试卡号进行支付测试
3. 在Stripe Dashboard中查看交易记录
4. 监控订单状态自动更新

如有问题，请参考故障排除部分或查看详细日志。