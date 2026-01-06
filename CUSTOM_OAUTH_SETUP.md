# 配置自定义 Google OAuth 应用

默认情况下，Supabase 使用它托管的 OAuth 应用，用户登录时会看到 "继续前往 kutusnugnadzofhdoybk.supabase.co"。

要改成 "AIAgeEditor"，需要创建自己的 Google OAuth 应用。

## 步骤 1：在 Google Cloud Console 配置 OAuth 同意屏幕

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 进入 **APIs & Services** > **OAuth consent screen**
4. 选择 **External**（外部用户）类型，点击 **Create**
5. 填写应用信息：
   - **App name**: `AIAgeEditor` ⭐（这个名称会显示给用户）
   - **User support email**: 你的邮箱
   - **Developer contact email**: 你的邮箱
6. 点击 **Save and Continue**
7. Scopes 页面可以跳过，点击 **Save and Continue**
8. Test users 页面可以跳过，点击 **Save and Continue**
9. 最后返回 Console

## 步骤 2：创建 OAuth 客户端 ID

1. 进入 **APIs & Services** > **Credentials**
2. 点击 **Create Credentials** > **OAuth client ID**
3. 应用类型选择 **Web application**
4. 名称填写：`AIAgeEditor Web Client`
5. 添加授权重定向 URI：
   ```
   https://kutusnugnadzofhdoybk.supabase.co/auth/v1/callback
   ```
6. 点击 **Create**
7. 记录下：
   - Client ID
   - Client Secret

## 步骤 3：在 Supabase 中配置自定义 OAuth

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** > **Providers** > **Google**
4. 启用 Google provider
5. 勾选 **Use a custom OAuth client**
6. 填入：
   - **Client ID**: 刚才创建的 Google OAuth Client ID
   - **Client Secret**: 刚才创建的 Google OAuth Client Secret
7. 保存配置

## 步骤 3：测试

现在用户登录时会看到：
```
继续前往 AIAgeEditor
```

而不是：
```
继续前往 kutusnugnadzofhdoybk.supabase.co
```

## 注意事项

- 需要确保 Google OAuth 应用的重定向 URI 包含你的 Supabase 项目 URL
- 如果你有自己的域名，可以在 Google OAuth 应用中添加自己的域名作为重定向 URI
- 修改后可能需要等待几分钟才能生效
