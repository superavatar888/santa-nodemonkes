"use client"

import { useState, useEffect } from "react"

// --- 配置区域 ---
// 你的自定义域名是 https://santa.138148178.xyz/
// 所以这里留空即可，不需要加仓库名
const REPO_PATH = "" 

// 如果是在手机上，分辨率设低一点，电脑上设高一点
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

type BodyColorType = { [key: string]: string } & { [key: string]: string }

const BODY_COLORS: BodyColorType = {
  albino: "#BDADAD", alien: "#04CFE7", beak: "#F8AC00", binary: "#010101",
  boned: "#000000", bot: "#484848", brown: "#310000", dark: "#482510",
  deathbot: "#282831", dos: "#0002A5", gold: "#FFAA01", green: "#002205",
  grey: "#232A30", hyena: "#BA8837", ion: "#060F26", light: "#B7844F",
  medium: "#945321", mempool: "#BE0B3A", moon: "#3501BB", patriot: "#0D0060",
  pepe: "#127602", pink: "#E944CE", purple: "#38034A", rainbow: "#009DFF",
  red: "#630001", safemode: "#000DFF", striped: "#110654", underlord: "#9C0901",
  vhs: "#0600FF", white: "#c7bcb6", wrapped: "#FFFFFF", zombie: "#104119",
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
        const response = await fetch(url)
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        setMetadata(data)
        setMetadataLoaded(true)
        showStatus(`元数据加载完成 (${data.length} 个NFT)`)
        return
      } catch (error) {
        console.error(`Metadata load failed:`, error)
      }
    }
    showStatus("无法加载元数据 (但不影响手动查看图片)", true)
  }

  const showStatus = (message: string, error = false) => {
    setStatus(message)
    setIsError(error)
  }

  const validateAndSetId = (inputId: string) => {
    const parsedId = Number.parseInt(inputId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      setId(inputId)
    }
  }

  // --- 核心修改：路径逻辑 ---
  const updateImage = (imageId: string) => {
    const parsedId = Number.parseInt(imageId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      // 对应你仓库里的 /public/assets/merged/
      // 在浏览器中访问路径是 /assets/merged/
      setImageUrl(`${REPO_PATH}/assets/merged/${imageId}.png`)
    } else {
      setImageUrl("")
    }
  }

  const getAutoBackground = (imageId: number) => {
    const item = metadata.find((item) => item.id === imageId)
    if (item?.attributes?.Body) {
      return BODY_COLORS[item.attributes.Body.toLowerCase()] || null
    }
    return null
  }

  const updateBackground = (type: "auto" | "custom") => {
    if (type === "auto") {
      if (!metadataLoaded) {
        showStatus("元数据未加载，无法使用自动背景。", true)
        return
      }
      const imageId = Number.parseInt(id, 10)
      const autoBg = getAutoBackground(imageId)
      if (autoBg) {
        setBgColor(autoBg)
        showStatus(`已应用自动背景: ${autoBg}`)
      } else {
        showStatus("未找到对应的背景色", true)
      }
    } else {
      setShowColorPicker(!showColorPicker)
    }
  }

  // --- 纯前端下载逻辑 ---
  const downloadImage = async () => {
    if (!imageUrl) return

    showStatus("正在生成图片...")

    try {
      // 1. 加载图片
      const img = new Image()
      // 同源图片(自定义域名下)不需要 crossOrigin，或者设置为 anonymous 也没问题
      img.src = imageUrl

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("图片加载失败"))
      })

      // 2. 准备 Canvas
      const canvas = document.createElement("canvas")
      canvas.width = resolution
      canvas.height = resolution
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        showStatus("浏览器不支持 Canvas", true)
        return
      }

      ctx.imageSmoothingEnabled = false // 像素风格，关闭抗锯齿

      // 3. 绘制背景
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, resolution, resolution)

      // 4. 绘制图片
      ctx.drawImage(img, 0, 0, resolution, resolution)

      // 5. 导出并下载
      canvas.toBlob((blob) => {
        if (!blob) {
          showStatus("图片生成失败", true)
          return
        }
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `santa-nodemonke-${id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        showStatus("✅ 图片已下载")
      }, "image/png")

    } catch (error) {
      console.error(error)
      showStatus("下载出错，请尝试手动长按保存", true)
    }
  }

  // --- 样式定义 ---
  const containerStyle: React.CSSProperties = {
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
  }

  const titleStyle: React.CSSProperties = {
    fontFamily: '"Mountains of Christmas", cursive',
    fontSize: "3.5rem",
    fontWeight: "700",
    color: "#E63946",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    marginBottom: "8px",
    lineHeight: "1.2",
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #A8DADC",
    borderRadius: "8px",
    background: "rgba(29, 53, 87, 0.7)",
    color: "white",
  }

  const btnStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#457B9D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "background 0.3s",
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: "30px", paddingTop: "10px" }}>
        <h1 style={titleStyle}>Santa Nodemonkes Viewer</h1>
        <p style={{ fontSize: "1.25rem", color: "#F1FAEE", margin: "0" }}>
          Create your festive Nodemonke!
        </p>
      </div>

      <div style={{
        marginBottom: "20px", padding: "10px",
        background: metadataLoaded ? "rgba(22, 163, 74, 0.5)" : "rgba(251, 191, 36, 0.5)",
        borderRadius: "8px", fontSize: "14px", color: "#F1FAEE",
        border: metadataLoaded ? "1px solid #16A34A" : "1px solid #FBBF24",
      }}>
        Status: {metadataLoaded ? "✅ Metadata Loaded" : "⚠️ Metadata Loading Failed"}
      </div>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={id}
          onChange={(e) => validateAndSetId(e.target.value)}
          placeholder="Enter ID"
          style={{ ...inputStyle, width: "220px", marginRight: "10px" }}
        />
        <div style={{ fontSize: "12px", color: "#F1FAEE", marginTop: "8px" }}>Enter an ID between 1-10000</div>
      </div>

      <div style={{ margin: "30px 0" }}>
        <label style={{ marginRight: "10px", fontSize: "16px", color: "#F1FAEE" }}>Resolution (px):</label>
        <input
          type="number"
          value={resolution}
          onChange={(e) => setResolution(Number(e.target.value))}
          min={28} max={1200} step={28}
          style={{ ...inputStyle, width: "120px" }}
        />
      </div>

      <div style={{ margin: "20px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
        <button onClick={() => updateBackground("auto")} style={btnStyle}>Auto Background</button>
        <button onClick={() => updateBackground("custom")} style={{ ...btnStyle, background: "#A8DADC", color: "#1D3557" }}>
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
            ...btnStyle,
            padding: "12px 24px",
            fontSize: "18px",
            background: "#E63946",
            fontWeight: "bold"
          }}
        >
          Save Image
        </button>
      </div>

      <div style={{
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
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Nodemonke ${id}`}
            style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          />
        ) : (
          <div style={{ color: "#F1FAEE" }}>Enter a valid ID</div>
        )}
      </div>

      {status && (
        <div style={{
          margin: "10px 0", padding: "12px", borderRadius: "8px", textAlign: "center",
          background: isError ? "rgba(230, 57, 70, 0.7)" : "rgba(69, 123, 157, 0.7)",
          color: "#F1FAEE",
          border: isError ? "1px solid #E63946" : "1px solid #457B9D",
        }}>
          {status}
        </div>
      )}
    </div>
  )
}
