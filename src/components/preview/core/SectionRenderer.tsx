import type { Section, SectionKey } from "../../../types"
import type { Orientation } from "./CueRenderer"
import { RingStack } from "./RingStack"
import { InlayRenderer } from "../../inlays/InlayRenderer"

type Props = {
  sectionKey: SectionKey
  section: Section
  position: number
  offset: number
  thickness: number
  orientation: Orientation
  onHover?: (key: SectionKey | null) => void
  onSelect?: (key: SectionKey) => void
  isHighlighted: boolean
  isSelected: boolean
}

export function SectionRenderer({
  sectionKey,
  section,
  position,
  offset,
  thickness,
  orientation,
  onHover,
  onSelect,
  isHighlighted,
  isSelected,
}: Props) {
  const isHorizontal = orientation === "horizontal"
  const totalLength = section.length

  const startRingsThickness = section.ringsTop.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const endRingsThickness = section.ringsBottom.reduce(
    (sum, r) => sum + r.thickness,
    0
  )

  const mainBodyLength = totalLength - startRingsThickness - endRingsThickness

  const selectionColor = isSelected ? "#4af" : isHighlighted ? "#4af" : "transparent"
  const selectionOpacity = isSelected ? 0.6 : isHighlighted ? 0.4 : 0

  if (isHorizontal) {
    const x = position
    const y = offset
    const mainBodyX = x + startRingsThickness

    return (
      <g
        onMouseEnter={() => onHover?.(sectionKey)}
        onMouseLeave={() => onHover?.(null)}
        onClick={() => onSelect?.(sectionKey)}
        style={{ cursor: "pointer" }}
      >
        {section.ringsTop.length > 0 && (
          <RingStack
            rings={section.ringsTop}
            x={x}
            y={y}
            height={thickness}
            direction="horizontal"
          />
        )}

        <rect
          x={mainBodyX}
          y={y}
          width={mainBodyLength}
          height={thickness}
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
            height={thickness}
          />
        )}

        {section.ringsBottom.length > 0 && (
          <RingStack
            rings={section.ringsBottom}
            x={mainBodyX + mainBodyLength}
            y={y}
            height={thickness}
            direction="horizontal"
          />
        )}

        {(isHighlighted || isSelected) && (
          <rect
            x={x - 2}
            y={y - 2}
            width={totalLength + 4}
            height={thickness + 4}
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

  const x = offset
  const y = position
  const mainBodyY = y + startRingsThickness

  return (
    <g
      onMouseEnter={() => onHover?.(sectionKey)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(sectionKey)}
      style={{ cursor: "pointer" }}
    >
      {section.ringsTop.length > 0 && (
        <RingStack
          rings={section.ringsTop}
          x={x}
          y={y}
          width={thickness}
          direction="vertical"
        />
      )}

      <rect
        x={x}
        y={mainBodyY}
        width={thickness}
        height={mainBodyLength}
        fill={section.baseColor}
        stroke="#111"
        strokeWidth={0.5}
      />

      {section.inlay && (
        <InlayRenderer
          config={section.inlay}
          x={x}
          y={mainBodyY}
          width={thickness}
          height={mainBodyLength}
        />
      )}

      {section.ringsBottom.length > 0 && (
        <RingStack
          rings={section.ringsBottom}
          x={x}
          y={mainBodyY + mainBodyLength}
          width={thickness}
          direction="vertical"
        />
      )}

      {(isHighlighted || isSelected) && (
        <rect
          x={x - 2}
          y={y - 2}
          width={thickness + 4}
          height={totalLength + 4}
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
