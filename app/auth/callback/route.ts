import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 优先使用环境变量配置的 URL
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

      if (siteUrl && siteUrl !== 'http://localhost:3000') {
        // 线上环境，使用配置的域名
        return NextResponse.redirect(`${siteUrl}${next}`)
      }

      // 本地环境或未配置时，使用请求的 origin
      const forwardedHost = request.headers.get('x-forwarded-host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'

      if (forwardedHost) {
        // 部署平台（如 Vercel）提供的真实域名
        return NextResponse.redirect(`${protocol}://${forwardedHost}${next}`)
      }

      // 回退到 origin
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=true`)
}
