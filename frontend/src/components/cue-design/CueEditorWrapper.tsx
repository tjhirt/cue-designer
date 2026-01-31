import { useParams } from 'react-router-dom'
import { useCueDesign } from '@/hooks/useCueDesigns'
import CueEditor from './CueEditor'

export default function CueEditorWrapper() {
  const { id } = useParams<{ id: string }>()
  const { data: cue, isLoading, error } = useCueDesign(Number(id))

  if (isLoading) return <div className="p-8 text-center">Loading cue design...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading cue: {error.message}</div>
  if (!cue) return <div className="p-8 text-center">Cue design not found</div>

  return <CueEditor cue={cue} />
}