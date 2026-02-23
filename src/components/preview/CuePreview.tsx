import { useCueStore } from "../../store/useCueStore"
import { JointPin } from "./JointPin"
import { SectionRenderer, getSectionLength } from "./SectionRenderer"
import type { SectionKey, Section } from "../../types"

export const CUE_HEIGHT = 60
const JOINT_PIN_LENGTH = 79
const SVG_PADDING = 20

export function CuePreview() {
  const design = useCueStore((state) => state.design)
  const hoveredSection = useCueStore((state) => state.hoveredSection)
  const selectedSection = useCueStore((state) => state.selectedSection)
  const setHoveredSection = useCueStore((state) => state.setHoveredSection)
  const setSelectedSection = useCueStore((state) => state.setSelectedSection)

  const sections: { key: SectionKey; section: Section }[] = [
    { key: "jointCollar", section: design.jointCollar },
    { key: "forearm", section: design.forearm },
    { key: "handle", section: design.handle },
    { key: "buttSleeve", section: design.buttSleeve },
    { key: "buttCap", section: design.buttCap },
  ]

  const sectionsLength = sections.reduce(
    (sum, { section }) => sum + getSectionLength(section),
    0
  )
  const totalLength = JOINT_PIN_LENGTH + sectionsLength
  const svgWidth = totalLength + SVG_PADDING * 2
  const svgHeight = CUE_HEIGHT + SVG_PADDING * 2

  let currentX = SVG_PADDING
  const jointPinX = currentX
  currentX += JOINT_PIN_LENGTH

  const sectionPositions: { key: SectionKey; x: number; length: number }[] = []

  sections.forEach(({ key, section }) => {
    const sectionLength = getSectionLength(section)
    sectionPositions.push({ key, x: currentX, length: sectionLength })
    currentX += sectionLength
  })

  const cueY = SVG_PADDING

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ background: "#1a1a1a" }}
    >
      <JointPin
        jointPin={design.jointPin}
        x={jointPinX}
        y={cueY}
        height={CUE_HEIGHT}
        length={JOINT_PIN_LENGTH}
      />

      {sections.map(({ key, section }) => {
        const pos = sectionPositions.find((p) => p.key === key)!
        return (
          <SectionRenderer
            key={key}
            sectionKey={key}
            section={section}
            x={pos.x}
            y={cueY}
            height={CUE_HEIGHT}
            onHover={setHoveredSection}
            onSelect={setSelectedSection}
            isHighlighted={hoveredSection === key}
            isSelected={selectedSection === key}
          />
        )
      })}
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
