import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import { randomUUID } from "crypto"
import path from "path"

export const runtime = "nodejs"

function extFromMime(mime?: string) {
  if (!mime) return "png"
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg"
  if (mime.includes("png")) return "png"
  if (mime.includes("webp")) return "webp"
  return "png"
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "缺少图片数据" }, { status: 400 })
    }

    // 如果是公网URL，直接返回
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return NextResponse.json({ url: image })
    }

    // 仅支持 data URL(base64)
    if (!image.startsWith("data:")) {
      return NextResponse.json({ error: "不支持的图片格式" }, { status: 400 })
    }

    const commaIdx = image.indexOf(",")
    const header = image.slice(0, commaIdx)
    const base64 = image.slice(commaIdx + 1)
    const mimeMatch = /data:(.*);base64/.exec(header)
    const ext = extFromMime(mimeMatch?.[1])

    const buffer = Buffer.from(base64, "base64")

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const filename = `${randomUUID()}.${ext}`
    const filePath = path.join(uploadsDir, filename)
    await fs.writeFile(filePath, buffer)

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000"
    const proto = req.headers.get("x-forwarded-proto") || "http"
    const absoluteUrl = `${proto}://${host}/uploads/${filename}`

    return NextResponse.json({ url: absoluteUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "未知错误" }, { status: 500 })
  }
}
