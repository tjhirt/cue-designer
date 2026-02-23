import type { JointPin as JointPinType } from "../../../types"
import type { Orientation } from "./CueRenderer"

type Props = {
  jointPin: JointPinType
  position: number
  offset: number
  thickness: number
  length: number
  orientation: Orientation
}

export function JointPin({ jointPin, position, offset, thickness, length, orientation }: Props) {
  const isHorizontal = orientation === "horizontal"

  if (isHorizontal) {
    const x = position
    const y = offset
    const centerX = x + length - thickness / 2
    const centerY = y + thickness / 2
    const radius = thickness * 0.3

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={length}
          height={thickness}
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

  const x = offset
  const y = position
  const centerX = x + thickness / 2
  const centerY = y + thickness / 2
  const radius = thickness * 0.3

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={thickness}
        height={length}
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
