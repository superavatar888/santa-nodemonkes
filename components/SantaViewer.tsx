"use client"

import { useState, useEffect } from "react"

const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const defaultResolution = isMobile ? 280 : 560

interface Metadata {
  id: number
  inscription: number
  attributes: {
    Body: string
    [key: string]: string
  }
}

type BodyColorType = {
  [key: string]: string
} & {
  albino: string
  alien: string
  beak: string
  binary: string
  boned: string
  bot: string
  brown: string
  dark: string
  deathbot: string
  dos: string
  gold: string
  green: string
  grey: string
  hyena: string
  ion: string
  light: string
  medium: string
  mempool: string
  moon: string
  patriot: string
  pepe: string
  pink: string
  purple: string
  rainbow: string
  red: string
  safemode: string
  striped: string
  underlord: string
  vhs: string
  white: string
  wrapped: string
  zombie: string
}

const BODY_COLORS: BodyColorType = {
  albino: "#BDADAD",
  alien: "#04CFE7",
  beak: "#F8AC00",
  binary: "#010101",
  boned: "#000000",
  bot: "#484848",
  brown: "#310000",
  dark: "#482510",
  deathbot: "#282831",
  dos: "#0002A5",
  gold: "#FFAA01",
  green: "#002205",
  grey: "#232A30",
  hyena: "#BA8837",
  ion: "#060F26",
  light: "#B7844F",
  medium: "#945321",
  mempool: "#BE0B3A",
  moon: "#3501BB",
  patriot: "#0D0060",
  pepe: "#127602",
  pink: "#E944CE",
  purple: "#38034A",
  rainbow: "#009DFF",
  red: "#630001",
  safemode: "#000DFF",
  striped: "#110654",
  underlord: "#9C0901",
  vhs: "#0600FF",
  white: "#c7bcb6",
  wrapped: "#FFFFFF",
  zombie: "#104119",
}

export default function SantaViewer() {
  const [id, setId] = useState("1")
  const [resolution, setResolution] = useState(defaultResolution)
  const [bgColor, setBgColor] = useState("#ffffff")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("")
  const [isError, setIsError] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [metadata, setMetadata] = useState<Metadata[]>([])
  const [metadataLoaded, setMetadataLoaded] = useState(false)

  useEffect(() => {
    loadMetadata()
  }, [])

  useEffect(() => {
    updateImage(id)
  }, [id])

  const loadMetadata = async () => {
    const metadataUrls = [
      "https://pub-ce8a03b190984a3d99332e13b7d5e3cb.r2.dev/metadata.json",
      "https://metadata.138148178.xyz/metadata.json",
    ]

    for (const url of metadataUrls) {
      try {
        showStatus("正在加载元数据...")
        const response = await fetch(url, {
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setMetadata(data)
        setMetadataLoaded(true)
        showStatus(
          `元数据加载完成 (${data.length} 个NFT) - 数据源: ${url.includes("pub-ce8a03b") ? "R2主源" : "备用源"}`,
        )
        return
      } catch (error) {
        console.error(`Failed to load metadata from ${url}:`, error)
        if (url === metadataUrls[metadataUrls.length - 1]) {
          showStatus("无法加载元数据，自动背景功能将不可用。", true)
          setMetadataLoaded(false)
        }
      }
    }
  }

  const showStatus = (message: string, error = false) => {
    setStatus(message)
    setIsError(error)
  }

  const validateAndSetId = (inputId: string) => {
    const parsedId = Number.parseInt(inputId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      setId(inputId)
      showStatus(`显示图片 ID: ${inputId}`)
    } else {
      showStatus("请输入1-10000之间的有效ID", true)
    }
  }

  const updateImage = (imageId: string) => {
    const parsedId = Number.parseInt(imageId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      setImageUrl(`https://santamonkes.138148178.xyz/merged/${imageId}.png`)
    } else {
      setImageUrl("")
    }
  }

  const getAutoBackground = (imageId: number) => {
    const item = metadata.find((item) => item.id === imageId)
    if (item?.attributes?.Body) {
      const bodyType = item.attributes.Body.toLowerCase()
      return (BODY_COLORS as BodyColorType)[bodyType] || null
    }
    return null
  }

  const updateBackground = (type: "auto" | "custom") => {
    if (type === "auto") {
      if (!metadataLoaded) {
        showStatus("元数据未加载，无法使用自动背景功能。", true)
        return
      }
      const imageId = Number.parseInt(id, 10)
      if (!isNaN(imageId)) {
        const autoBg = getAutoBackground(imageId)
        if (autoBg) {
          setBgColor(autoBg)
          showStatus(`背景已更新: 自动背景 (${autoBg})`)
        } else {
          showStatus("无法为此ID找到自动背景颜色", true)
        }
      }
    } else {
      setShowColorPicker(!showColorPicker)
    }
  }

  const downloadImage = async () => {
    if (!imageUrl) {
      showStatus("没有可供下载的图片", true)
      return
    }

    showStatus("正在准备下载...")

    try {
      // 方法1: 尝试使用 fetch 下载
      const response = await fetch(imageUrl, {
        mode: "cors",
        credentials: "omit",
      })

      if (!response.ok) {
        throw new Error("Fetch failed")
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const img = new Image()
      img.src = blobUrl

      img.onload = () => {
        try {
          // 创建源 canvas
          const srcCanvas = document.createElement("canvas")
          const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true })
          if (!srcCtx) {
            showStatus("无法创建图片，浏览器支持不足。", true)
            URL.revokeObjectURL(blobUrl)
            return
          }

          const originalWidth = img.naturalWidth
          const originalHeight = img.naturalHeight
          srcCanvas.width = originalWidth
          srcCanvas.height = originalHeight
          srcCtx.drawImage(img, 0, 0)

          // 创建目标 canvas
          const destCanvas = document.createElement("canvas")
          destCanvas.width = resolution
          destCanvas.height = resolution
          const destCtx = destCanvas.getContext("2d", { willReadFrequently: true })
          if (!destCtx) {
            showStatus("无法创建图片，浏览器支持不足。", true)
            URL.revokeObjectURL(blobUrl)
            return
          }

          // 填充背景色
          destCtx.fillStyle = bgColor
          destCtx.fillRect(0, 0, resolution, resolution)

          // 禁用图像平滑以保持像素风格
          destCtx.imageSmoothingEnabled = false

          // 将源图片缩放绘制到目标 canvas
          destCtx.drawImage(srcCanvas, 0, 0, originalWidth, originalHeight, 0, 0, resolution, resolution)

          // 转换为 blob 并下载
          destCanvas.toBlob((outputBlob) => {
            if (outputBlob) {
              const downloadLink = document.createElement("a")
              downloadLink.href = URL.createObjectURL(outputBlob)
              downloadLink.download = `santa-nodemonke-${id}-${resolution}px-HD.png`
              document.body.appendChild(downloadLink)
              downloadLink.click()
              document.body.removeChild(downloadLink)
              URL.revokeObjectURL(downloadLink.href)
              showStatus("高清图片已开始下载！")
            } else {
              showStatus("生成图片失败", true)
            }
            URL.revokeObjectURL(blobUrl)
          }, "image/png")
        } catch (error) {
          console.error("[v0] Canvas error:", error)
          showStatus("处理图片时出错", true)
          URL.revokeObjectURL(blobUrl)
        }
      }

      img.onerror = () => {
        showStatus("加载图片失败", true)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error("[v0] Fetch failed:", error)

      // 方法2: 如果 fetch 失败，尝试使用隐藏的 img 元素
      try {
        const img = new Image()
        // 不设置 crossOrigin，让浏览器使用默认行为
        img.src = imageUrl

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas")
            canvas.width = resolution
            canvas.height = resolution
            const ctx = canvas.getContext("2d", { willReadFrequently: true })

            if (!ctx) {
              throw new Error("Canvas context not available")
            }

            // 填充背景
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, resolution, resolution)
            ctx.imageSmoothingEnabled = false

            // 直接绘制图片（按比例缩放）
            const scale = resolution / Math.max(img.naturalWidth, img.naturalHeight)
            const scaledWidth = img.naturalWidth * scale
            const scaledHeight = img.naturalHeight * scale
            const x = (resolution - scaledWidth) / 2
            const y = (resolution - scaledHeight) / 2

            ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

            // 尝试转换为 blob
            canvas.toBlob((blob) => {
              if (blob) {
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = `santa-nodemonke-${id}-${resolution}px-HD.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
                showStatus("图片已下载！")
              } else {
                throw new Error("Failed to create blob")
              }
            }, "image/png")
          } catch (canvasError) {
            console.error("[v0] Canvas fallback failed:", canvasError)
            // 方法3: 直接下载原始图片
            const link = document.createElement("a")
            link.href = imageUrl
            link.download = `santa-nodemonke-${id}.png`
            link.target = "_blank"
            link.rel = "noopener noreferrer"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            showStatus("使用备用下载方式（原始图片）")
          }
        }

        img.onerror = () => {
          // 方法3: 最终备用方案 - 直接下载
          const link = document.createElement("a")
          link.href = imageUrl
          link.download = `santa-nodemonke-${id}.png`
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          showStatus("使用直接下载方式")
        }
      } catch (finalError) {
        console.error("[v0] All download methods failed:", finalError)
        showStatus("下载失败，请稍后重试", true)
      }
    }
  }

  return (
    <div
      style={{
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        maxWidth: "800px",
        margin: "40px auto",
        color: "white",
      }}
    >
      <div style={{ marginBottom: "30px", paddingTop: "10px" }}>
        <h1
          style={{
            fontFamily: '"Mountains of Christmas", cursive',
            fontSize: "3.5rem",
            fontWeight: "700",
            color: "#E63946",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            marginBottom: "8px",
            lineHeight: "1.2",
          }}
        >
          Santa Nodemonkes Viewer
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#F1FAEE",
            margin: "0",
          }}
        >
          Create your festive Nodemonke!
        </p>
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          background: metadataLoaded ? "rgba(22, 163, 74, 0.5)" : "rgba(251, 191, 36, 0.5)",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#F1FAEE",
          border: metadataLoaded ? "1px solid #16A34A" : "1px solid #FBBF24",
        }}
      >
        Status: {metadataLoaded ? "✅ Metadata Loaded" : "⚠️ Metadata Loading Failed"}
      </div>

      <div style={{ margin: "20px 0" }}>
        <input
          id="idInput"
          type="text"
          defaultValue={id}
          onChange={(e) => validateAndSetId(e.target.value)}
          placeholder="Enter ID"
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "220px",
            marginRight: "10px",
            border: "2px solid #A8DADC",
            borderRadius: "8px",
            background: "rgba(29, 53, 87, 0.7)",
            color: "white",
          }}
        />
        <div style={{ fontSize: "12px", color: "#F1FAEE", marginTop: "8px" }}>Enter an ID between 1-10000</div>
      </div>

      <div style={{ margin: "30px 0" }}>
        <label htmlFor="resolutionInput" style={{ marginRight: "10px", fontSize: "16px", color: "#F1FAEE" }}>
          Resolution (px):
        </label>
        <input
          id="resolutionInput"
          type="number"
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
          min={28}
          max={1200}
          step={28}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "120px",
            border: "2px solid #A8DADC",
            borderRadius: "8px",
            background: "rgba(29, 53, 87, 0.7)",
            color: "white",
          }}
        />
        <div style={{ fontSize: "12px", color: "#F1FAEE", marginTop: "8px" }}>
          Adjust the size of the image (Original: 28x28)
        </div>
      </div>

      <div style={{ margin: "20px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => updateBackground("auto")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#457B9D",
            color: "white",
            border: "none",
            borderRadius: "8px",
            transition: "background 0.3s",
          }}
        >
          Auto Background
        </button>
        <button
          onClick={() => updateBackground("custom")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#A8DADC",
            color: "#1D3557",
            border: "none",
            borderRadius: "8px",
            transition: "background 0.3s",
          }}
        >
          Custom Color
        </button>
        {showColorPicker && (
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ marginLeft: "10px", height: "40px", width: "40px", border: "none", background: "transparent" }}
          />
        )}
      </div>

      <div style={{ margin: "20px 0" }}>
        <button
          onClick={downloadImage}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            cursor: "pointer",
            background: "#E63946",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            transition: "transform 0.2s",
          }}
        >
          Save Image
        </button>
      </div>

      <div
        style={{
          width: resolution,
          height: resolution,
          margin: "30px auto",
          backgroundColor: bgColor,
          border: "3px dashed #A8DADC",
          overflow: "hidden",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-color 0.5s",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Nodemonke ${id}`}
            style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          />
        ) : (
          <div style={{ color: "#F1FAEE" }}>Enter a valid ID</div>
        )}
      </div>

      {status && (
        <div
          style={{
            margin: "10px 0",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            background: isError ? "rgba(230, 57, 70, 0.7)" : "rgba(69, 123, 157, 0.7)",
            color: "#F1FAEE",
            border: isError ? "1px solid #E63946" : "1px solid #457B9D",
          }}
        >
          {status}
        </div>
      )}
    </div>
  )
}
