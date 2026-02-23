import { useCueStore } from "../../store/useCueStore"
import type { SectionKey } from "../../types"

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "jointCollar", label: "Collar" },
  { key: "forearm", label: "Forearm" },
  { key: "handle", label: "Handle" },
  { key: "buttSleeve", label: "Butt Sleeve" },
  { key: "buttCap", label: "Butt Cap" },
]

export function TopPanel() {
  const design = useCueStore((state) => state.design)
  const topPanelCollapsed = useCueStore((state) => state.topPanelCollapsed)
  const toggleTopPanel = useCueStore((state) => state.toggleTopPanel)
  const selectedSection = useCueStore((state) => state.selectedSection)
  const setSelectedSection = useCueStore((state) => state.setSelectedSection)

  return (
    <div className={`top-panel ${topPanelCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <button className="collapse-btn" onClick={toggleTopPanel}>
          {topPanelCollapsed ? "▼" : "▲"}
        </button>
        <span className="panel-title">Joint Pin</span>
        <div className="section-tabs">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              className={`section-tab ${selectedSection === section.key ? "active" : ""}`}
              onClick={() => setSelectedSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {!topPanelCollapsed && (
        <div className="panel-content">
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
      )}
    </div>
  )
}
