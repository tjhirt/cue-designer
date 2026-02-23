import type { RingLayer } from "../../../types"

type Props = {
  rings: RingLayer[]
  x: number
  y: number
  width?: number
  height?: number
  direction?: "vertical" | "horizontal"
}

export function RingStack({ rings, x, y, width, height, direction = "vertical" }: Props) {
  if (direction === "horizontal") {
    let currentX = x

    return (
      <g>
        {rings.map((ring) => {
          const ringX = currentX
          currentX += ring.thickness
          return (
            <rect
              key={ring.id}
              x={ringX}
              y={y}
              width={ring.thickness}
              height={height ?? 0}
              fill={ring.color}
              stroke="#111"
              strokeWidth={0.3}
            />
          )
        })}
      </g>
    )
  }

  let currentY = y

  return (
    <g>
      {rings.map((ring) => {
        const ringY = currentY
        currentY += ring.thickness
        return (
          <rect
            key={ring.id}
            x={x}
            y={ringY}
            width={width ?? 0}
            height={ring.thickness}
            fill={ring.color}
            stroke="#111"
            strokeWidth={0.3}
          />
        )
      })}
    </g>
  )
}

export function getRingsThickness(rings: RingLayer[]): number {
  return rings.reduce((sum, r) => sum + r.thickness, 0)
}
