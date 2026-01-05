import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { image, age } = await req.json()

    // 调试：打印 API Key 的前8位（用于确认是否加载成功）
    console.log("ARK_API_KEY exists:", !!process.env.ARK_API_KEY)
    console.log("ARK_API_KEY prefix:", process.env.ARK_API_KEY?.substring(0, 8))

    if (!process.env.ARK_API_KEY) {
      return NextResponse.json({ error: "Missing ARK_API_KEY env" }, { status: 500 })
    }

    if (!image || !age) {
      return NextResponse.json({ error: "Missing image or age" }, { status: 400 })
    }

    const prompt = `修改人物为${age}岁，衣服为同款但得体的样式`

    // ARK API 支持 base64 data URL 或公网 URL
    let arkPayload: Record<string, any> = {
      model: "doubao-seedream-4-5-251128",
      prompt,
      size: "2K",
      response_format: "url",
      watermark: false,
      image: image // 可以是 base64 (data:image/...) 或 公网 URL
    }

    const res = await fetch(
      // The Ark Images Generate API path may differ; adjust if needed per docs.
      "https://ark.cn-beijing.volces.com/api/v3/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ARK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arkPayload),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("ARK API Error Details:", {
        status: res.status,
        statusText: res.statusText,
        body: text
      })
      return NextResponse.json({
        error: "Ark API error",
        detail: text,
        status: res.status,
        statusText: res.statusText
      }, { status: res.status })
    }

    const data = await res.json()
    const url = data?.data?.[0]?.url
    if (!url) {
      return NextResponse.json({ error: "No URL in response", data }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
}
