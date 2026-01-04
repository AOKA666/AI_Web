import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { image, age } = await req.json()

    if (!process.env.ARK_API_KEY) {
      return NextResponse.json({ error: "Missing ARK_API_KEY env" }, { status: 500 })
    }

    if (!image || !age) {
      return NextResponse.json({ error: "Missing image or age" }, { status: 400 })
    }

    const prompt = `修改人物为${age}岁，衣服为同款但得体的样式`

    // Use URL for image-to-image per Ark docs
    let arkPayload: Record<string, any> = {
      model: "doubao-seedream-4-5-251128",
      prompt,
      size: "2K",
      response_format: "url",
      watermark: false,
    }
    arkPayload.image = image

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
      return NextResponse.json({ error: "Ark API error", detail: text }, { status: res.status })
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
