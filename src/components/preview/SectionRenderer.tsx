import type { Section, SectionKey } from "../../types"
import { RingStack } from "./RingStack"
import { InlayRenderer } from "../inlays/InlayRenderer"

type Props = {
  sectionKey: SectionKey
  section: Section
  x: number
  y: number
  height: number
  onHover: (key: SectionKey | null) => void
  onSelect: (key: SectionKey) => void
  isHighlighted: boolean
  isSelected: boolean
}

export function SectionRenderer({ sectionKey, section, x, y, height, onHover, onSelect, isHighlighted, isSelected }: Props) {
  const totalLength = section.length

  const leftRingsWidth = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const rightRingsWidth = section.ringsBottom.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const mainBodyLength = totalLength - leftRingsWidth - rightRingsWidth
  const mainBodyX = x + leftRingsWidth

  const selectionColor = isSelected ? "#4af" : isHighlighted ? "#4af" : "transparent"
  const selectionOpacity = isSelected ? 0.6 : isHighlighted ? 0.4 : 0

  return (
    <g
      onMouseEnter={() => onHover(sectionKey)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(sectionKey)}
      style={{ cursor: "pointer" }}
    >
      {section.ringsTop.length > 0 && (
        <RingStack
          rings={section.ringsTop}
          x={x}
          y={y}
          height={height}
          direction="horizontal"
        />
      )}

      <rect
        x={mainBodyX}
        y={y}
        width={mainBodyLength}
        height={height}
        fill={section.baseColor}
        stroke="#111"
        strokeWidth={0.5}
      />

      {section.inlay && (
        <InlayRenderer
          config={section.inlay}
          x={mainBodyX}
          y={y}
          width={mainBodyLength}
          height={height}
        />
      )}

      {section.ringsBottom.length > 0 && (
        <RingStack
          rings={section.ringsBottom}
          x={mainBodyX + mainBodyLength}
          y={y}
          height={height}
          direction="horizontal"
        />
      )}

      {(isHighlighted || isSelected) && (
        <rect
          x={x - 2}
          y={y - 2}
          width={totalLength + 4}
          height={height + 4}
          fill="none"
          stroke={selectionColor}
          strokeWidth={isSelected ? 3 : 2}
          opacity={selectionOpacity}
          style={{ pointerEvents: "none" }}
        />
      )}
    </g>
  )
}

export function getSectionLength(section: Section): number {
  return section.length
}
