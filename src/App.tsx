import { CuePreview } from "./components/preview"
import { EditorSidebar } from "./components/editor"
import "./App.css"

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Cue Designer</h1>
      </header>
      <main className="main">
        <div className="preview-container">
          <CuePreview />
        </div>
        <EditorSidebar />
      </main>
    </div>
  )
}

export default App
