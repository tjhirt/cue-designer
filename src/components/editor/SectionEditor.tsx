import type { Section, SectionKey } from "../../types"
import { PX_PER_CM } from "../../store/useCueStore"

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
  const lengthCm = (section.length / PX_PER_CM).toFixed(1)

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
        <label>Length (cm)</label>
        <input
          type="number"
          value={lengthCm}
          onChange={(e) => onUpdate({ length: Number(e.target.value) * PX_PER_CM })}
          min={0.5}
          max={50}
          step={0.5}
        />
      </div>
    </div>
  )
}
