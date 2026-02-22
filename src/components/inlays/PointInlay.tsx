import type { InlayConfig } from "../../types"
import { generatePointInlayPaths } from "../../geometry/pointInlay"

type Props = {
  config: InlayConfig
  x: number
  y: number
  width: number
  height: number
}

export function PointInlay({ config, x, y, width, height }: Props) {
  const paths = generatePointInlayPaths(config, width, height, x, y)

  return (
    <g>
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={path.color}
          stroke="#111"
          strokeWidth={0.3}
        />
      ))}
    </g>
  )
}
