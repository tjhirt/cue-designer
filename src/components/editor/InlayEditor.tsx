import type { InlayConfig, InlayType, VeneerLayer } from "../../types"

type Props = {
  inlay: InlayConfig | undefined
  onSetInlay: (inlay: InlayConfig | undefined) => void
}

const INLAY_TYPES: { value: InlayType; label: string }[] = [
  { value: "4-point", label: "4 Point" },
  { value: "6-point", label: "6 Point" },
  { value: "8-point", label: "8 Point" },
]

const generateId = () => `veneer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function InlayEditor({ inlay, onSetInlay }: Props) {
  const handleToggle = () => {
    if (inlay) {
      onSetInlay(undefined)
    } else {
      onSetInlay({
        type: "4-point",
        color: "#F5F5DC",
        pointLength: 50,
        veneers: [],
      })
    }
  }

  const handleUpdate = (update: Partial<InlayConfig>) => {
    if (!inlay) return
    onSetInlay({ ...inlay, ...update })
  }

  const handleAddVeneer = () => {
    if (!inlay) return
    const veneer: VeneerLayer = {
      id: generateId(),
      color: "#8B0000",
      thickness: 2,
    }
    onSetInlay({
      ...inlay,
      veneers: [...inlay.veneers, veneer],
    })
  }

  const handleRemoveVeneer = (id: string) => {
    if (!inlay) return
    onSetInlay({
      ...inlay,
      veneers: inlay.veneers.filter((v) => v.id !== id),
    })
  }

  const handleUpdateVeneer = (id: string, update: Partial<VeneerLayer>) => {
    if (!inlay) return
    onSetInlay({
      ...inlay,
      veneers: inlay.veneers.map((v) =>
        v.id === id ? { ...v, ...update } : v
      ),
    })
  }

  return (
    <div className="inlay-editor">
      <div className="inlay-header">
        <h4>Inlay</h4>
        <button className="add-btn" onClick={handleToggle}>
          {inlay ? "Disable" : "Enable"}
        </button>
      </div>

      {inlay && (
        <>
          <div className="field">
            <label>Type</label>
            <select
              value={inlay.type}
              onChange={(e) => handleUpdate({ type: e.target.value as InlayType })}
            >
              {INLAY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Color</label>
            <div className="color-input">
              <input
                type="color"
                value={inlay.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Length</label>
            <input
              type="number"
              value={inlay.pointLength ?? 50}
              onChange={(e) => handleUpdate({ pointLength: Number(e.target.value) })}
              min={10}
              max={150}
            />
          </div>

          <div className="veneer-section">
            <div className="veneer-header">
              <h5>Veneers</h5>
              <button className="add-btn" onClick={handleAddVeneer}>+</button>
            </div>

            {inlay.veneers.map((veneer, index) => (
              <div key={veneer.id} className="veneer-item">
                <div className="veneer-item-header">
                  <span>Veneer {index + 1}</span>
                  <button className="remove-btn" onClick={() => handleRemoveVeneer(veneer.id)}>
                    x
                  </button>
                </div>
                <div className="field">
                  <label>Color</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={veneer.color}
                      onChange={(e) => handleUpdateVeneer(veneer.id, { color: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
