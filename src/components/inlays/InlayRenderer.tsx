import type { InlayConfig } from "../../types"
import { PointInlay } from "./PointInlay"

type Props = {
  config: InlayConfig
  x: number
  y: number
  width: number
  height: number
}

export function InlayRenderer({ config, x, y, width, height }: Props) {
  switch (config.type) {
    case "4-point":
    case "6-point":
    case "8-point":
      return <PointInlay config={config} x={x} y={y} width={width} height={height} />

    case "diamond":
    case "greek-key":
    case "butterfly":
    case "tribal":
    case "abalone":
      return null

    default:
      return null
  }
}
