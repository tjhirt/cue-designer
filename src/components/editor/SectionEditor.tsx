import type { Section, SectionKey } from "../../types"

type Props = {
  sectionKey: SectionKey
  section: Section
  onUpdate: (update: Partial<Section>) => void
}

const SECTION_LABELS: Record<SectionKey, string> = {
  jointCollar: "Joint Collar",
  forearm: "Forearm",
  handle: "Handle",
  buttSleeve: "Butt Sleeve",
  buttCap: "Butt Cap",
}

export function SectionEditor({ sectionKey, section, onUpdate }: Props) {
  return (
    <div className="section-editor">
      <h3>{SECTION_LABELS[sectionKey]}</h3>
      
      <div className="field">
        <label>Base Color</label>
        <div className="color-input">
          <input
            type="color"
            value={section.baseColor}
            onChange={(e) => onUpdate({ baseColor: e.target.value })}
          />
          <span>{section.baseColor}</span>
        </div>
      </div>

      <div className="field">
        <label>Length</label>
        <input
          type="number"
          value={section.length}
          onChange={(e) => onUpdate({ length: Number(e.target.value) })}
          min={10}
          max={200}
        />
      </div>
    </div>
  )
}
