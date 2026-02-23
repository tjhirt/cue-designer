import { useCueStore } from "../../store/useCueStore"
import { CueRenderer, CUE_HEIGHT } from "./core"

export function HorizontalPreview() {
  const design = useCueStore((state) => state.design)
  const selectedSection = useCueStore((state) => state.selectedSection)
  const hoveredSection = useCueStore((state) => state.hoveredSection)
  const setHoveredSection = useCueStore((state) => state.setHoveredSection)
  const setSelectedSection = useCueStore((state) => state.setSelectedSection)

  return (
    <div className="horizontal-preview">
      <CueRenderer
        design={design}
        orientation="horizontal"
        cueThickness={CUE_HEIGHT}
        selectedSection={selectedSection}
        hoveredSection={hoveredSection}
        onSectionSelect={setSelectedSection}
        onSectionHover={setHoveredSection}
      />
    </div>
  )
}
