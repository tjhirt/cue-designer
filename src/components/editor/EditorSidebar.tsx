import { useCueStore } from "../../store/useCueStore"
import type { SectionKey, RingLayer } from "../../types"
import { SectionEditor } from "./SectionEditor"
import { RingEditor } from "./RingEditor"

const SECTIONS: SectionKey[] = [
  "jointCollar",
  "forearm",
  "handle",
  "buttSleeve",
  "buttCap",
]

export function EditorSidebar() {
  const design = useCueStore((state) => state.design)
  const hoveredSection = useCueStore((state) => state.hoveredSection)
  const setHoveredSection = useCueStore((state) => state.setHoveredSection)
  const updateSection = useCueStore((state) => state.updateSection)
  const addRingLayer = useCueStore((state) => state.addRingLayer)
  const removeRingLayer = useCueStore((state) => state.removeRingLayer)
  const updateRingLayer = useCueStore((state) => state.updateRingLayer)

  const generateId = () => `ring-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const handleAddRing = (sectionKey: SectionKey, position: "top" | "bottom") => {
    const ring: RingLayer = {
      id: generateId(),
      color: "#FFD700",
      thickness: 3,
    }
    addRingLayer(sectionKey, position, ring)
  }

  return (
    <div className="editor-sidebar">
      <div className="editor-section">
        <h2>Joint Pin</h2>
        <div className="field">
          <label>Type</label>
          <select
            value={design.jointPin.type}
            onChange={(e) => {
              const jointPin = { ...design.jointPin, type: e.target.value as any }
              useCueStore.getState().setJointPin(jointPin)
            }}
          >
            <option value="radial-3-8x8">Radial (3/8x8)</option>
            <option value="3-8x10">3/8x10</option>
            <option value="5-16x14">5/16x14</option>
            <option value="5-16x18">5/16x18</option>
          </select>
        </div>
        <div className="field">
          <label>Color</label>
          <div className="color-input">
            <input
              type="color"
              value={design.jointPin.color}
              onChange={(e) => {
                const jointPin = { ...design.jointPin, color: e.target.value }
                useCueStore.getState().setJointPin(jointPin)
              }}
            />
          </div>
        </div>
      </div>

      {SECTIONS.map((sectionKey) => {
        const section = design[sectionKey]
        const isHighlighted = hoveredSection === sectionKey

        return (
          <div
            key={sectionKey}
            className={`editor-section ${isHighlighted ? "section-highlight" : ""}`}
            onMouseEnter={() => setHoveredSection(sectionKey)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <SectionEditor
              sectionKey={sectionKey}
              section={section}
              onUpdate={(update) => updateSection(sectionKey, update)}
            />

            <RingEditor
              rings={section.ringsTop}
              position="top"
              onAdd={() => handleAddRing(sectionKey, "top")}
              onRemove={(id) => removeRingLayer(sectionKey, "top", id)}
              onUpdate={(id, ring) => updateRingLayer(sectionKey, "top", id, ring)}
            />

            <RingEditor
              rings={section.ringsBottom}
              position="bottom"
              onAdd={() => handleAddRing(sectionKey, "bottom")}
              onRemove={(id) => removeRingLayer(sectionKey, "bottom", id)}
              onUpdate={(id, ring) => updateRingLayer(sectionKey, "bottom", id, ring)}
            />
          </div>
        )
      })}
    </div>
  )
}
