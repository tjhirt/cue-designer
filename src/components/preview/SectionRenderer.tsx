import { Section } from "../../types"
import { RingStack } from "./RingStack"

type Props = {
  section: Section
  x: number
  y: number
  width: number
}

export function SectionRenderer({ section, x, y, width }: Props) {
  const baseHeight = section.length

  const topRingsHeight = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )
  const bottomRingsHeight = section.ringsBottom.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const totalHeight = baseHeight + topRingsHeight + bottomRingsHeight

  return (
    <g>
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
