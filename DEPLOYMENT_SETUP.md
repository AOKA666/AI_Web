# 线上部署配置指南

## 问题：登录后跳转到 localhost

如果你部署到线上后，登录会自动跳转到 localhost，需要配置环境变量。

## 解决方案

### 1. 在部署平台设置环境变量

在你的部署平台（Vercel、Netlify、Railway 等）设置以下环境变量：

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

将 `your-domain.com` 替换为你的实际域名，例如：
- Vercel: `https://your-project.vercel.app`
- 自定义域名: `https://www.yourwebsite.com`

### 2. Vercel 部署示例

在 Vercel Dashboard 中：

1. 进入你的项目
2. 点击 **Settings** > **Environment Variables**
3. 添加新变量：
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-project.vercel.app`（或你的自定义域名）
   - **Environments**: 选择 `Production` 和 `Preview`
4. 保存后重新部署

### 3. Netlify 部署示例

在 Netlify Dashboard 中：

1. 进入你的站点
2. 点击 **Site settings** > **Build & deploy** > **Environment**
3. 添加环境变量：
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-site.netlify.app`
4. 保存后重新部署

### 4. 其他平台

对于任何部署平台，都需要设置 `NEXT_PUBLIC_SITE_URL` 为你的线上域名。

## 验证

部署后访问你的网站，点击登录，应该会：
1. 跳转到 Google OAuth 页面
2. 授权后跳转回你的网站（不是 localhost）
3. 显示登录状态

## 本地开发

本地开发时，`.env.local` 文件中的配置会生效：
```
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

这样本地和线上都能正常工作。
