import type { JointPin as JointPinType } from "../../types"

type Props = {
  jointPin: JointPinType
  x: number
  y: number
  width: number
  height: number
}

export function JointPin({ jointPin, x, y, width, height }: Props) {
  const centerX = x + width / 2
  const radius = Math.min(width, height) * 0.3

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={jointPin.color}
        stroke="#333"
        strokeWidth={0.5}
      />
      <circle
        cx={centerX}
        cy={y + height / 2}
        r={radius}
        fill={jointPin.color}
        stroke="#222"
        strokeWidth={1}
      />
      <circle
        cx={centerX}
        cy={y + height / 2}
        r={radius * 0.4}
        fill="#222"
      />
    </g>
  )
}
