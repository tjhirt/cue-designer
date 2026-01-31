import { useCueDesigns, useCreateCue, useDeleteCue } from '@/hooks/useCueDesigns'
import { DesignStyle } from '@/types/cue'

const DESIGN_STYLES: DesignStyle[] = ['traditional_classic', 'modern_minimal', 'ornate', 'art_deco', 'contemporary']

export default function CueList() {
  const { data: cues, isLoading } = useCueDesigns()
  const createMutation = useCreateCue()
  const deleteMutation = useDeleteCue()

  const handleCreateNew = () => {
    createMutation.mutate({
      cue_id: `CUE_${Date.now()}`,
      design_style: 'modern_minimal',
      overall_length_in: 29.0,
      symmetry_type: 'radial',
      era_influence: 'modern',
      complexity_level: 'low',
      sections: [],
    })
  }

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this cue design?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Cue Designs</h1>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            New Design
          </button>
        </div>

        {!cues || cues.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No cue designs found</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Your First Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cues.map((cue) => (
              <div
                key={cue.id}
                onClick={() => (window.location.href = `/cues/${cue.id}/edit`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold">{cue.cue_id}</h2>
                  <button
                    onClick={(e) => handleDelete(cue.id!, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 capitalize mb-2">
                  {cue.design_style.replace('_', ' ')}
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Length: {cue.overall_length_in}"</p>
                  <p>Sections: {cue.sections.length}</p>
                  <p>Updated: {cue.updated_at ? new Date(cue.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
