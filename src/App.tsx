import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSyncAcrossTabs } from "./hooks"
import { Header } from "./components/header"
import { HorizontalPreview } from "./components/preview/HorizontalPreview"
import { VerticalPreview } from "./components/preview/VerticalPreview"
import { TopPanel, BottomPanel } from "./components/panels"
import "./App.css"

function EditorLayout() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <TopPanel />
        <div className="cue-container">
          <HorizontalPreview />
        </div>
        <BottomPanel />
      </div>
    </div>
  )
}

function ViewLayout() {
  return (
    <div className="app view-only">
      <VerticalPreview />
    </div>
  )
}

function App() {
  useSyncAcrossTabs()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorLayout />} />
        <Route path="/view" element={<ViewLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
