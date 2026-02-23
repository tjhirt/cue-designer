import type { InlayConfig } from "../types"

export type PointPath = {
  color: string
  d: string
}

function getVisiblePoints(pointCount: number): { xRatio: number; widthRatio: number }[] {
  const angleStep = (2 * Math.PI) / pointCount
  const points: { xRatio: number; widthRatio: number }[] = []

  for (let i = 0; i < pointCount; i++) {
    const angle = i * angleStep
    const normalizedAngle = ((angle + Math.PI) % (2 * Math.PI)) - Math.PI
    
    if (normalizedAngle < -Math.PI / 2 || normalizedAngle > Math.PI / 2) {
      continue
    }

    const xRatio = Math.sin(normalizedAngle)
    
    const cosAngle = Math.cos(normalizedAngle)
    const widthRatio = Math.max(0.5, cosAngle)
    
    points.push({ xRatio, widthRatio })
  }

  return points.sort((a, b) => a.xRatio - b.xRatio)
}

function getDefaultPointWidth(sectionWidth: number, pointCount: number): number {
  const visiblePoints = getVisiblePoints(pointCount)
  if (visiblePoints.length < 2) return sectionWidth / 2
  
  let minWidth = Infinity
  
  for (let i = 0; i < visiblePoints.length - 1; i++) {
    const p1 = visiblePoints[i]
    const p2 = visiblePoints[i + 1]
    
    const gap = (p2.xRatio - p1.xRatio) * (sectionWidth / 2)
    const sumWidthRatios = p1.widthRatio + p2.widthRatio
    
    const width = (gap * 2) / sumWidthRatios
    minWidth = Math.min(minWidth, width)
  }
  
  return minWidth
}

export function getDefaultPointWidthForType(sectionWidth: number, inlayType: string): number {
  const pointCount = getPointCount(inlayType)
  if (pointCount === 0) return sectionWidth / 3
  return getDefaultPointWidth(sectionWidth, pointCount)
}

export function generatePointInlayPaths(
  config: InlayConfig,
  width: number,
  height: number,
  startX: number,
  startY: number
): PointPath[] {
  const pointCount = getPointCount(config.type)
  if (pointCount === 0) return []

  const pointLength = Math.min(config.pointLength ?? height * 0.7, height - 2)
  const startPosition = config.startPosition ?? "bottom"
  const defaultWidth = getDefaultPointWidth(width, pointCount)
  const basePointWidth = config.pointWidth ?? defaultWidth

  const visiblePoints = getVisiblePoints(pointCount)

  const layers: { color: string; inset: number }[] = [
    { color: config.color, inset: 0 },
    ...config.veneers.map((v, i) => ({
      color: v.color,
      inset: (i + 1) * 2,
    })),
  ]

  const paths: PointPath[] = []

  layers.forEach((layer) => {
    const layerPaths: string[] = []
    const inset = layer.inset
    const layerStartX = startX + inset
    const layerWidth = width - inset * 2
    const layerEndX = layerStartX + layerWidth
    const centerX = layerStartX + layerWidth / 2
    const layerHeight = Math.max(pointLength - inset * 2, 10)

    visiblePoints.forEach((point) => {
      const tipX = centerX + (layerWidth / 2) * point.xRatio
      const halfBase = (basePointWidth / 2) * point.widthRatio * (layerWidth / width)
      
      if (halfBase < 1) return

      const baseY = startPosition === "bottom" 
        ? startY + height - inset
        : startY + inset
      const tipY = startPosition === "bottom"
        ? startY + height - layerHeight - inset
        : startY + layerHeight + inset

      const leftX = Math.max(layerStartX, tipX - halfBase)
      const rightX = Math.min(layerEndX, tipX + halfBase)

      if (rightX <= leftX) return

      const path = `M ${tipX} ${tipY} L ${leftX} ${baseY} L ${rightX} ${baseY} Z`
      layerPaths.push(path)
    })

    if (layerPaths.length > 0) {
      paths.push({
        color: layer.color,
        d: layerPaths.join(" "),
      })
    }
  })

  return paths.reverse()
}

function getPointCount(type: string): number {
  switch (type) {
    case "4-point":
      return 4
    case "6-point":
      return 6
    case "8-point":
      return 8
    default:
      return 0
  }
}
