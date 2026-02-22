import type { Section, SectionKey } from "../../types"
import { RingStack } from "./RingStack"

type Props = {
  sectionKey: SectionKey
  section: Section
  x: number
  y: number
  width: number
  onHover: (key: SectionKey | null) => void
}

export function SectionRenderer({ sectionKey, section, x, y, width, onHover }: Props) {
  const baseHeight = section.length

  const topRingsHeight = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

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
