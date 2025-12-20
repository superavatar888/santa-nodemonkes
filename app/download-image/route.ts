import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imageUrl = searchParams.get("url")
  const width = Number.parseInt(searchParams.get("width") || "420")
  const height = Number.parseInt(searchParams.get("height") || "420")
  const bgColor = searchParams.get("bg") || "#ffffff"

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")

    // 由于服务器端没有 canvas，我们返回原始图片数据和参数，让客户端处理
    // 但为了绕过 CORS，我们直接返回图片数据

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="santa-nodemonke-${width}x${height}.png"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
