import { useCueStore } from "../../store/useCueStore"
import { JointPin } from "./JointPin"
import { SectionRenderer, getSectionHeight } from "./SectionRenderer"

const CUE_WIDTH = 60
const JOINT_PIN_HEIGHT = 12
const SVG_PADDING = 20

export function CuePreview() {
  const design = useCueStore((state) => state.design)
  const hoveredSection = useCueStore((state) => state.hoveredSection)
  const setHoveredSection = useCueStore((state) => state.setHoveredSection)

  const sections = [
    { key: "jointCollar" as const, section: design.jointCollar },
    { key: "forearm" as const, section: design.forearm },
    { key: "handle" as const, section: design.handle },
    { key: "buttSleeve" as const, section: design.buttSleeve },
    { key: "buttCap" as const, section: design.buttCap },
  ]

  const sectionsHeight = sections.reduce(
    (sum, { section }) => sum + getSectionHeight(section),
    0
  )
  const totalHeight = JOINT_PIN_HEIGHT + sectionsHeight
  const svgHeight = totalHeight + SVG_PADDING * 2
  const svgWidth = CUE_WIDTH + SVG_PADDING * 2

  let currentY = SVG_PADDING
  const jointPinY = currentY
  currentY += JOINT_PIN_HEIGHT

  const sectionPositions: { key: typeof sections[0]["key"]; y: number; height: number }[] = []
  
  sections.forEach(({ key, section }) => {
    const sectionHeight = getSectionHeight(section)
    sectionPositions.push({ key, y: currentY, height: sectionHeight })
    currentY += sectionHeight
  })

  const hoveredPos = sectionPositions.find((p) => p.key === hoveredSection)

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ border: "1px solid #333", background: "#1a1a1a" }}
    >
      <JointPin
        jointPin={design.jointPin}
        x={SVG_PADDING}
        y={jointPinY}
        width={CUE_WIDTH}
        height={JOINT_PIN_HEIGHT}
      />

      {sections.map(({ key, section }) => {
        const pos = sectionPositions.find((p) => p.key === key)!
        return (
          <SectionRenderer
            key={key}
            sectionKey={key}
            section={section}
            x={SVG_PADDING}
            y={pos.y}
            width={CUE_WIDTH}
            onHover={setHoveredSection}
          />
        )
      })}

      {hoveredPos && (
        <rect
          x={SVG_PADDING - 2}
          y={hoveredPos.y - 2}
          width={CUE_WIDTH + 4}
          height={hoveredPos.height + 4}
          fill="none"
          stroke="#4af"
          strokeWidth={3}
          opacity={0.8}
          style={{ pointerEvents: "none" }}
        />
      )}
    </svg>
  )
}
