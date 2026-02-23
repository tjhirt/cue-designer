import { useCueStore } from "../../store/useCueStore"
import { getTotalCueLengthCm, cmToInches } from "../preview/core"

export function Header() {
  const design = useCueStore((state) => state.design)
  const totalCm = getTotalCueLengthCm(design)
  const totalInches = cmToInches(totalCm)

  const openVerticalView = () => {
    window.open("/view", "_blank")
  }

  return (
    <header className="header">
      <h1>Cue Designer</h1>
      <div className="total-length">
        {totalCm.toFixed(1)} cm ({totalInches.toFixed(1)}")
      </div>
      <button className="open-view-btn" onClick={openVerticalView}>
        Open Full View
      </button>
    </header>
  )
}
