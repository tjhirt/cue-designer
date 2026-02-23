import type { JointPin as JointPinType } from "../../types"

type Props = {
  jointPin: JointPinType
  x: number
  y: number
  height: number
  length: number
}

export function JointPin({ jointPin, x, y, height, length }: Props) {
  const centerX = x + length - height / 2
  const centerY = y + height / 2
  const radius = height * 0.3

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={length}
        height={height}
        fill={jointPin.color}
        stroke="#333"
        strokeWidth={0.5}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill={jointPin.color}
        stroke="#222"
        strokeWidth={1}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.4}
        fill="#222"
      />
    </g>
  )
}
