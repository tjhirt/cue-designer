import { useState, useEffect } from "react"
import { useCueStore } from "../../store/useCueStore"
import { CueRenderer, CUE_HEIGHT } from "../preview/core"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1

export function VerticalPreview() {
  const design = useCueStore((state) => state.design)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z + delta)))
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
  const fitToScreen = () => setZoom(1)

  return (
    <div className="vertical-preview">
      <div className="zoom-controls">
        <button onClick={zoomOut} disabled={zoom <= ZOOM_MIN}>
          -
        </button>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={ZOOM_STEP}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <button onClick={zoomIn} disabled={zoom >= ZOOM_MAX}>
          +
        </button>
        <button onClick={fitToScreen}>Fit</button>
        <span className="zoom-value">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="vertical-cue-container" style={{ transform: `scale(${zoom})` }}>
        <CueRenderer
          design={design}
          orientation="vertical"
          cueThickness={CUE_HEIGHT}
        />
      </div>
    </div>
  )
}
