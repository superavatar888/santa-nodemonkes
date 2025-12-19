"use client"

import { useState, useEffect } from "react"

const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const defaultResolution = isMobile ? 280 : 560

export default function SantaViewer() {
  const [id, setId] = useState("1")
  const [resolution, setResolution] = useState(defaultResolution)
  const [bgColor, setBgColor] = useState("#ffffff")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("")
  const [isError, setIsError] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    updateImage(id)
  }, [id])

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
      setImageUrl(`/assets/merged/${imageId}.png`)
    } else {
      setImageUrl("")
    }
  }

  const updateBackground = (type: "auto" | "custom") => {
    let newBgColor: string
    switch (type) {
      case "auto":
        newBgColor = "#d32f2f" // Christmas Red
        setBgColor(newBgColor)
        showStatus(`背景已更新: 自动背景 (${newBgColor})`)
        break
      case "custom":
        setShowColorPicker(!showColorPicker)
        break
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
