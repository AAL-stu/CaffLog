# CaffLog 云数据库安全规则配置

在微信开发者工具 → 云开发控制台 → 数据库 → 安全规则中，为各集合配置以下规则。

## 集合安全规则

### coffee_beans（咖啡豆品种）— 所有用户可读，仅管理员可写

```json
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

### brew_methods（冲煮方式）— 所有用户可读

```json
{
  "read": true,
  "write": false
}
```

### brand_drinks（品牌饮品）— 所有用户可读

```json
{
  "read": true,
  "write": false
}
```

### intake_records（摄入记录）— 仅创建者可读写

```json
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

## 安全规则说明

- `auth.openid`：当前用户的微信 OpenID
- `doc._openid`：记录创建者的 OpenID
- `intake_records` 的读写权限限定为记录创建者本人，实现用户数据隔离
- `coffee_beans`、`brew_methods`、`brand_drinks` 为预置只读数据，所有用户可读取
- 预置数据通过 `dataInit` 云函数写入，云函数具有服务端权限，不受安全规则限制

## 注意事项

- 安全规则在云开发控制台依次配置，逐个集合设置
- 修改安全规则后即时生效，无需重新部署
- 如果 `intake_records` 需要支持管理员查看（如数据统计），可额外添加自定义安全规则
