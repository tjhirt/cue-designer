import type { CueDesign, SectionKey, Section } from "../../../types"
import { SectionRenderer } from "./SectionRenderer"
import { JointPin } from "./JointPin"

export const CUE_HEIGHT = 60

export type Orientation = "horizontal" | "vertical"

export type CueRendererProps = {
  design: CueDesign
  orientation: Orientation
  cueThickness: number
  selectedSection?: SectionKey | null
  hoveredSection?: SectionKey | null
  onSectionSelect?: (key: SectionKey) => void
  onSectionHover?: (key: SectionKey | null) => void
  padding?: number
}

export function CueRenderer({
  design,
  orientation,
  cueThickness,
  selectedSection = null,
  hoveredSection = null,
  onSectionSelect,
  onSectionHover,
  padding = 20,
}: CueRendererProps) {
  const isHorizontal = orientation === "horizontal"
  const jointPinLength = 79

  const sections: { key: SectionKey; section: Section }[] = [
    { key: "jointCollar", section: design.jointCollar },
    { key: "forearm", section: design.forearm },
    { key: "handle", section: design.handle },
    { key: "buttSleeve", section: design.buttSleeve },
    { key: "buttCap", section: design.buttCap },
  ]

  const sectionsLength = sections.reduce(
    (sum, { section }) => sum + section.length,
    0
  )
  const totalLength = jointPinLength + sectionsLength

  const svgWidth = isHorizontal ? totalLength + padding * 2 : cueThickness + padding * 2
  const svgHeight = isHorizontal ? cueThickness + padding * 2 : totalLength + padding * 2

  const sectionPositions: { key: SectionKey; position: number; length: number }[] = []
  let currentPos = isHorizontal ? padding : padding + jointPinLength

  sections.forEach(({ key, section }) => {
    sectionPositions.push({ key, position: currentPos, length: section.length })
    currentPos += section.length
  })

  const jointPinPos = isHorizontal ? padding : padding

  const renderJointPin = () => (
    <JointPin
      jointPin={design.jointPin}
      position={jointPinPos}
      offset={isHorizontal ? padding : padding}
      thickness={cueThickness}
      length={jointPinLength}
      orientation={orientation}
    />
  )

  const renderSection = (key: SectionKey, section: Section) => {
    const pos = sectionPositions.find((p) => p.key === key)!
    const isHighlighted = hoveredSection === key
    const isSelected = selectedSection === key

    return (
      <SectionRenderer
        key={key}
        sectionKey={key}
        section={section}
        position={pos.position}
        offset={isHorizontal ? padding : padding}
        thickness={cueThickness}
        orientation={orientation}
        onHover={onSectionHover}
        onSelect={onSectionSelect}
        isHighlighted={isHighlighted}
        isSelected={isSelected}
      />
    )
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ background: "#1a1a1a" }}
    >
      {isHorizontal ? (
        <>
          {renderJointPin()}
          {sections.map(({ key, section }) => renderSection(key, section))}
        </>
      ) : (
        <>
          {sections.map(({ key, section }) => renderSection(key, section))}
          {renderJointPin()}
        </>
      )}
    </svg>
  )
}

export function getTotalCueLengthCm(design: { jointCollar: Section; forearm: Section; handle: Section; buttSleeve: Section; buttCap: Section }): number {
  const pxPerCm = 24
  const lengthPx = design.jointCollar.length + design.forearm.length + design.handle.length + design.buttSleeve.length + design.buttCap.length
  return lengthPx / pxPerCm
}

export function cmToInches(cm: number): number {
  return cm * 0.393701
}
