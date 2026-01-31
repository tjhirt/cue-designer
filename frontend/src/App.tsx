import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CueList from '@/pages/CueList'
import CueEditorWrapper from '@/components/cue-design/CueEditorWrapper'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<CueList />} />
        <Route path="/cues/:id/edit" element={<CueEditorWrapper />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
