import { RingLayer } from "../../types"

type Props = {
  rings: RingLayer[]
  x: number
  y: number
  width: number
}

export function RingStack({ rings, x, y, width }: Props) {
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
            width={width}
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

export function getRingsHeight(rings: RingLayer[]): number {
  return rings.reduce((sum, r) => sum + r.thickness, 0)
}
