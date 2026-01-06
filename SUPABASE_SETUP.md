# Supabase Google 登录配置指南

## 概述

本项目已经配置好了 Supabase Google 登录功能（服务器端认证方式）。以下是配置步骤。

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com)
2. 注册或登录账号
3. 创建一个新项目

## 步骤 2: 配置 Google OAuth 提供商

1. 在 Supabase Dashboard 中，导航到 **Authentication > Providers**
2. 找到 **Google** 提供商并启用它
3. 配置以下设置：
   - **Client ID**: 从 Google Cloud Console 获取（见步骤 3）
   - **Client Secret**: 从 Google Cloud Console 获取（见步骤 3）
   - **Redirect URL**: 添加 `http://localhost:3000/auth/callback`（开发环境）

## 步骤 3: 在 Google Cloud Console 创建 OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建一个新项目或选择现有项目
3. 导航到 **APIs & Services > Credentials**
4. 点击 **Create Credentials > OAuth client ID**
5. 配置 OAuth 同意屏幕：
   - 应用类型：Web 应用
   - 名称：你的应用名称
   - 授权域：添加 `localhost`（开发环境）和你的生产域名
6. 创建 OAuth 客户端 ID：
   - 应用类型：Web 应用
   - 名称：Supabase Auth
   - 已授权的重定向 URI：
     - `https://[你的项目ID].supabase.co/auth/v1/callback`
7. 复制 **Client ID** 和 **Client Secret**

## 步骤 4: 配置环境变量

1. 复制 `.env.local.example` 文件并重命名为 `.env.local`
2. 在 Supabase Dashboard 中，导航到 **Settings > API**
3. 复制以下值到 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. 添加可选的环境变量（用于生产环境）：

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 步骤 5: 运行应用

```bash
pnpm dev
```

访问 `http://localhost:3000`，应用会自动重定向到登录页面。

## 文件结构

```
├── lib/supabase/
│   ├── server.ts         # 服务器端 Supabase 客户端
│   └── middleware.ts     # 中间件辅助函数
├── app/
│   ├── login/            # 登录页面
│   │   └── page.tsx
│   ├── auth/callback/    # OAuth 回调路由
│   │   └── route.ts
│   └── api/auth/
│       ├── login/        # 登录 API 路由
│       │   └── route.ts
│       └── logout/       # 登出 API 路由
│           └── route.ts
├── middleware.ts         # Next.js 中间件（路由保护）
└── .env.local.example    # 环境变量示例
```

## 如何使用

### 登录

用户访问应用时，如果未登录会自动重定向到 `/login` 页面。点击"使用 Google 登录"按钮即可开始 Google OAuth 流程。

### 登出

在你的应用中添加登出按钮，调用 `/api/auth/logout` API：

```tsx
<form action="/api/auth/logout" method="POST">
  <button type="submit">登出</button>
</form>
```

### 访问用户信息

在任何服务器组件中，你可以获取当前用户信息：

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      {user ? (
        <p>欢迎, {user.email}</p>
      ) : (
        <p>未登录</p>
      )}
    </div>
  )
}
```

### 保护特定路由

默认情况下，所有路由都需要登录。如果你想修改这个行为，编辑 `middleware.ts`：

```typescript
// 允许未登录用户访问某些路由
if (
  !user &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/auth/callback') &&
  !request.nextUrl.pathname.startsWith('/public') // 添加公开路由
) {
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
```

## 生产环境部署

1. 更新 `.env.local` 或在部署平台设置环境变量
2. 在 Google Cloud Console 中添加生产域名的重定向 URI：
   - `https://[你的域名]/auth/callback`
3. 在 Supabase Dashboard 的 **Authentication > URL Configuration** 中添加：
   - Redirect URL: `https://[你的域名]/auth/callback`
4. 在 `.env.local` 中设置 `NEXT_PUBLIC_SITE_URL`

## 故障排除

### 问题：登录后未重定向
- 检查 `NEXT_PUBLIC_SITE_URL` 环境变量
- 确认 Supabase Dashboard 中的 Redirect URL 配置正确

### 问题：CORS 错误
- 确保在 Supabase Dashboard 的 **Authentication > URL Configuration** 中添加了你的域名

### 问题：中间件未生效
- 确保在项目根目录（`middleware.ts`）而不是 `app/` 目录
- 重启开发服务器

## 参考文档

- [Supabase Auth - Social Login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase - Server-Side Rendering](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
