import type { Section, SectionKey } from "../../types"
import { RingStack } from "./RingStack"

type Props = {
  sectionKey: SectionKey
  section: Section
  x: number
  y: number
  width: number
  isHighlighted: boolean
  onHover: (key: SectionKey | null) => void
}

export function SectionRenderer({ sectionKey, section, x, y, width, isHighlighted, onHover }: Props) {
  const baseHeight = section.length

  const topRingsHeight = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const bottomRingsHeight = section.ringsBottom.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const totalHeight = topRingsHeight + baseHeight + bottomRingsHeight

  return (
    <g
      onMouseEnter={() => onHover(sectionKey)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={x}
        y={y + topRingsHeight}
        width={width}
        height={baseHeight}
        fill={section.baseColor}
        stroke="#111"
        strokeWidth={0.5}
      />
      {section.ringsTop.length > 0 && (
        <RingStack
          rings={section.ringsTop}
          x={x}
          y={y}
          width={width}
        />
      )}
      {section.ringsBottom.length > 0 && (
        <RingStack
          rings={section.ringsBottom}
          x={x}
          y={y + topRingsHeight + baseHeight}
          width={width}
        />
      )}
      {isHighlighted && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={totalHeight + 4}
          fill="none"
          stroke="#4af"
          strokeWidth={3}
          opacity={0.8}
          style={{ pointerEvents: "none" }}
        />
      )}
    </g>
  )
}

export function getSectionHeight(section: Section): number {
  const topRingsHeight = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )
  const bottomRingsHeight = section.ringsBottom.reduce(
    (sum, r) => sum + r.thickness,
    0
  )
  return section.length + topRingsHeight + bottomRingsHeight
}
