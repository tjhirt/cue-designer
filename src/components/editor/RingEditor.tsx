import type { RingLayer } from "../../types"

type Props = {
  rings: RingLayer[]
  position: "top" | "bottom"
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, ring: Partial<RingLayer>) => void
}

export function RingEditor({ rings, position, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="ring-editor">
      <div className="ring-header">
        <h4>{position === "top" ? "Top Rings" : "Bottom Rings"}</h4>
        <button className="add-btn" onClick={onAdd}>+</button>
      </div>

      {rings.map((ring, index) => (
        <div key={ring.id} className="ring-item">
          <div className="ring-item-header">
            <span>Ring {index + 1}</span>
            <button className="remove-btn" onClick={() => onRemove(ring.id)}>x</button>
          </div>
          
          <div className="field">
            <label>Color</label>
            <div className="color-input">
              <input
                type="color"
                value={ring.color}
                onChange={(e) => onUpdate(ring.id, { color: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Thickness</label>
            <input
              type="number"
              value={ring.thickness}
              onChange={(e) => onUpdate(ring.id, { thickness: Number(e.target.value) })}
              min={1}
              max={20}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
