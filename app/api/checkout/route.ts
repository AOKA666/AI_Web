import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.CREEM_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "缺少 CREEM_API_KEY 环境变量" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const { productId, successUrl, units = 1, discountCode, requestId } = body || {}

    if (!productId) {
      return NextResponse.json({ error: "缺少 productId" }, { status: 400 })
    }

    // 非必需，但如果已登录则透传用户信息到 metadata 方便后续回调关联
    let metadata: Record<string, any> | undefined
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        metadata = {
          userId: data.user.id,
          email: data.user.email,
        }
      }
    } catch {
      // ignore auth errors, allow anonymous checkout
    }

    const payload: Record<string, any> = {
      product_id: productId,
      success_url: successUrl,
      units,
      discount_code: discountCode,
      request_id: requestId,
      metadata,
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])

    const baseUrl = (process.env.CREEM_API_BASE || "https://api.creem.io").replace(/\/$/, "")
    const creemRes = await fetch(`${baseUrl}/v1/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    })

    const data = await creemRes.json().catch(() => ({}))
    if (!creemRes.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "创建 checkout 失败", detail: data },
        { status: creemRes.status },
      )
    }

    const url = data?.url || data?.checkout_url || data?.checkoutUrl || data?.data?.url
    if (!url) {
      return NextResponse.json(
        { error: "Creem 返回结果缺少跳转链接", detail: data },
        { status: 502 },
      )
    }

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "未知错误" }, { status: 500 })
  }
}
