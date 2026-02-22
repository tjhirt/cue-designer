import type { InlayConfig } from "../types"

export type PointInlayPath = {
  color: string
  d: string
}

export function generatePointInlayPaths(
  config: InlayConfig,
  width: number,
  height: number,
  startX: number,
  startY: number
): PointInlayPath[] {
  const pointCount = getPointCount(config.type)
  if (pointCount === 0) return []

  const pointLength = config.pointLength ?? height * 0.6
  const paths: PointInlayPath[] = []

  const allLayers: { color: string; offset: number }[] = [
    { color: config.color, offset: 0 },
    ...config.veneers.map((v, i) => ({
      color: v.color,
      offset: (i + 1) * 3,
    })),
  ]

  const angleStep = (2 * Math.PI) / pointCount

  allLayers.forEach((layer) => {
    const points: string[] = []
    const layerWidth = width - layer.offset * 2
    const layerHeight = Math.min(pointLength, height - 4)

    for (let i = 0; i < pointCount; i++) {
      const angle = i * angleStep - Math.PI / 2
      const tipX = startX + layer.offset + layerWidth / 2 + Math.cos(angle) * (layerWidth / 2 - 2)
      const tipY = startY + 2

      const baseAngleLeft = angle + Math.PI / pointCount
      const baseAngleRight = angle - Math.PI / pointCount
      const baseRadius = layerWidth / 2 - 4

      const baseLeftX = startX + layer.offset + layerWidth / 2 + Math.cos(baseAngleLeft) * baseRadius
      const baseLeftY = startY + layerHeight
      const baseRightX = startX + layer.offset + layerWidth / 2 + Math.cos(baseAngleRight) * baseRadius
      const baseRightY = startY + layerHeight

      points.push(
        `M ${tipX} ${tipY} L ${baseLeftX} ${baseLeftY} L ${baseRightX} ${baseRightY} Z`
      )
    }

    paths.push({
      color: layer.color,
      d: points.join(" "),
    })
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
