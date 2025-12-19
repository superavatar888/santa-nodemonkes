"use client"

import { useState, useEffect } from "react"

const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const defaultResolution = isMobile ? 280 : 560

const BASE_PATH = "/santa-nodemonkes"; // Manually define the base path for static assets

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
      "https://nodemonkes.4everland.store/metadata.json",
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
    const parsedId = parseInt(inputId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      setId(inputId)
      showStatus(`显示图片 ID: ${inputId}`)
    } else {
      showStatus("请输入1-10000之间的有效ID", true)
    }
  }

  const updateImage = (imageId: string) => {
    const parsedId = parseInt(imageId, 10)
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 10000) {
      setImageUrl(`${BASE_PATH}/assets/merged/${imageId}.png`)
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
      const imageId = parseInt(id, 10)
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

  return (
    <div
      style={{
        textAlign: "center",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "20px", paddingTop: "10px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginBottom: "8px",
            lineHeight: "1.2",
          }}
        >
          圣诞 Nodemonkes 查看器
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#666",
            margin: "0",
          }}
        >
          查看戴着圣诞帽的 Nodemonkes
        </p>
      </div>
      
      {/* 状态指示器 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          background: metadataLoaded ? "#e8f5e9" : "#fff3e0",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        状态: {metadataLoaded ? "✅ 元数据已加载" : "⚠️ 元数据加载失败"}
      </div>

      {/* ID 输入 */}
      <div style={{ margin: "20px 0" }}>
        <input
          id="idInput"
          type="text"
          defaultValue={id}
          onChange={(e) => validateAndSetId(e.target.value)}
          placeholder="输入ID"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "200px",
            marginRight: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          输入 1-10000 之间的 ID
        </div>
      </div>

      {/* 分辨率设置 */}
      <div style={{ margin: "20px 0" }}>
        <label htmlFor="resolutionInput" style={{ marginRight: "10px", fontSize: "14px" }}>
          分辨率 (px):
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
            padding: "8px",
            fontSize: "16px",
            width: "100px",
            marginRight: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          调整图片显示大小 (原始尺寸: 28x28)
        </div>
      </div>

      {/* 背景控制 */}
      <div style={{ margin: "20px 0" }}>
        <button onClick={() => updateBackground("auto")} style={{ padding: '8px 16px', marginRight: '10px', cursor: 'pointer' }}>自动背景</button>
        <button onClick={() => updateBackground("custom")} style={{ padding: '8px 16px', marginRight: '10px', cursor: 'pointer' }}>自定义背景</button>
        {showColorPicker && (
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        )}
      </div>

      {/* 预览区域 */}
      <div
        style={{
          width: resolution,
          height: resolution,
          margin: "20px auto",
          backgroundColor: bgColor,
          border: "2px dashed #ccc",
          overflow: "hidden",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Nodemonke ${id}`}
            style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          />
        ) : (
          <div style={{ color: "#999" }}>请输入有效ID</div>
        )}
      </div>

      {/* 状态消息 */}
      {status && (
        <div
          style={{
            margin: "10px 0",
            padding: "10px",
            borderRadius: "4px",
            textAlign: "center",
            background: isError ? "#ffebee" : "#e8f5e9",
            color: isError ? "#c62828" : "#2e7d32",
          }}
        >
          {status}
        </div>
      )}
    </div>
  )
}
