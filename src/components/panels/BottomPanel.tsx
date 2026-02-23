import { useCueStore } from "../../store/useCueStore"
import type { SectionKey, RingLayer, InlayConfig } from "../../types"
import { SectionEditor } from "../editor/SectionEditor"
import { RingEditor } from "../editor/RingEditor"
import { InlayEditor } from "../editor/InlayEditor"
import { CUE_HEIGHT } from "../preview/core/CueRenderer"

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "jointCollar", label: "Joint Collar" },
  { key: "forearm", label: "Forearm" },
  { key: "handle", label: "Handle" },
  { key: "buttSleeve", label: "Butt Sleeve" },
  { key: "buttCap", label: "Butt Cap" },
]

export function BottomPanel() {
  const design = useCueStore((state) => state.design)
  const bottomPanelCollapsed = useCueStore((state) => state.bottomPanelCollapsed)
  const toggleBottomPanel = useCueStore((state) => state.toggleBottomPanel)
  const selectedSection = useCueStore((state) => state.selectedSection)
  const setSelectedSection = useCueStore((state) => state.setSelectedSection)
  const updateSection = useCueStore((state) => state.updateSection)
  const addRingLayer = useCueStore((state) => state.addRingLayer)
  const removeRingLayer = useCueStore((state) => state.removeRingLayer)
  const updateRingLayer = useCueStore((state) => state.updateRingLayer)
  const setInlay = useCueStore((state) => state.setInlay)

  const section = design[selectedSection]

  const generateId = () => `ring-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const handleAddRing = (sectionKey: SectionKey, position: "top" | "bottom") => {
    const ring: RingLayer = {
      id: generateId(),
      color: "#FFD700",
      thickness: 24,
    }
    addRingLayer(sectionKey, position, ring)
  }

  const handleSetInlay = (sectionKey: SectionKey, inlay: InlayConfig | undefined) => {
    setInlay(sectionKey, inlay)
  }

  return (
    <div className={`bottom-panel ${bottomPanelCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <button className="collapse-btn" onClick={toggleBottomPanel}>
          {bottomPanelCollapsed ? "▲" : "▼"}
        </button>
        <span className="panel-title">Section Editor</span>
        <div className="section-tabs">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`section-tab ${selectedSection === s.key ? "active" : ""}`}
              onClick={() => setSelectedSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {!bottomPanelCollapsed && (
        <div className="panel-content">
          <SectionEditor
            sectionKey={selectedSection}
            section={section}
            onUpdate={(update) => updateSection(selectedSection, update)}
          />

          <InlayEditor
            sectionKey={selectedSection}
            sectionWidth={CUE_HEIGHT}
            inlay={section.inlay}
            onSetInlay={(inlay) => handleSetInlay(selectedSection, inlay)}
          />

          <RingEditor
            rings={section.ringsTop}
            position="top"
            onAdd={() => handleAddRing(selectedSection, "top")}
            onRemove={(id) => removeRingLayer(selectedSection, "top", id)}
            onUpdate={(id, ring) => updateRingLayer(selectedSection, "top", id, ring)}
          />

          <RingEditor
            rings={section.ringsBottom}
            position="bottom"
            onAdd={() => handleAddRing(selectedSection, "bottom")}
            onRemove={(id) => removeRingLayer(selectedSection, "bottom", id)}
            onUpdate={(id, ring) => updateRingLayer(selectedSection, "bottom", id, ring)}
          />
        </div>
      )}
    </div>
  )
}
