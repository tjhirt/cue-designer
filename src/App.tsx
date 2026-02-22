import { CuePreview } from "./components/preview"
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
        <aside className="editor">
          <p>Editor coming soon...</p>
        </aside>
      </main>
    </div>
  )
}

export default App
