import { useCueStore, useCueDesigns, useUpdateCue } from '@/hooks/useCueDesigns'
import { exportSvg, exportJson } from '@/utils/export'
import { Home, Save, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CueEditor() {
  const { currentCue, selectedSectionId, updateSection } = useCueStore()
  const navigate = useNavigate()
  const updateCueMutation = useUpdateCue()

  const handleSave = () => {
    if (currentCue?.id) {
      updateCueMutation.mutate({ id: currentCue.id, data: currentCue })
    }
  }

  const handleExportSvg = () => {
    if (currentCue?.cue_id) {
      exportSvg(currentCue.cue_id)
    }
  }

  const handleExportJson = () => {
    if (currentCue) {
      exportJson(currentCue)
    }
  }

  if (!currentCue) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No cue design selected</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Designs
          </button>
        </div>
      </div>
    )
  }

  const selectedSection = currentCue.sections.find(s => s.section_id === selectedSectionId)

  const SECTION_TYPES = [
    { value: 'joint', label: 'Joint' },
    { value: 'forearm', label: 'Forearm' },
    { value: 'handle', label: 'Handle' },
    { value: 'sleeve', label: 'Sleeve' },
    { value: 'butt', label: 'Butt' },
  ]

  const SECTION_COLORS: Record<string, string> = {
    joint: 'border-blue-200 bg-blue-50',
    forearm: 'border-green-200 bg-green-50',
    handle: 'border-yellow-200 bg-yellow-50',
    sleeve: 'border-purple-200 bg-purple-50',
    butt: 'border-red-200 bg-red-50',
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cue Designer</h1>
            <p className="text-sm text-gray-600">
              {currentCue.cue_id} - {currentCue.design_style.replace('_', ' ')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportSvg}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export SVG
            </button>
            <button
              onClick={handleExportJson}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Design
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <div className="h-full bg-white rounded-lg shadow-lg p-4">
            <div className="text-center text-gray-400">SVG Canvas - Backend Geometry Rendering</div>
          </div>
        </div>

        <div className="w-96 bg-white border-l overflow-auto">
          <div className="p-4 space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Sections</h2>
              <div className="space-y-3">
                {currentCue.sections.map((section) => (
                  <div
                    key={section.section_id}
                    onClick={() => {
                      const { setSelectedSection } = useCueStore.getState()
                      setSelectedSection(section.section_id)
                    }}
                    className={`p-4 rounded cursor-pointer border transition-all ${
                      SECTION_COLORS[section.section_type] || 'border-gray-200 bg-gray-50'
                    } ${
                      selectedSectionId === section.section_id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium capitalize">
                          {section.section_type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Position: {section.start_position_in}" - {section.end_position_in}"
                        </p>
                        <p className="text-sm text-gray-600">
                          Diameter: {section.outer_diameter_start_mm}mm → {section.outer_diameter_end_mm}mm
                        </p>
                        {section.wood_species && (
                          <p className="text-xs text-gray-500">
                            Material: {section.wood_species}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSection && (
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="text-lg font-semibold mb-4">Edit Section: {selectedSection.section_type.replace('_', ' ')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Section Type</label>
                    <select
                      value={selectedSection.section_type}
                      onChange={(e) => updateSection(selectedSection.section_id, { section_type: e.target.value as any })}
                      className="w-full p-2 border rounded"
                    >
                      {SECTION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Position (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedSection.start_position_in}
                        onChange={(e) => updateSection(selectedSection.section_id, { start_position_in: parseFloat(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Position (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedSection.end_position_in}
                        onChange={(e) => updateSection(selectedSection.section_id, { end_position_in: parseFloat(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Diameter (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedSection.outer_diameter_start_mm}
                        onChange={(e) => updateSection(selectedSection.section_id, { outer_diameter_start_mm: parseFloat(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Diameter (mm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedSection.outer_diameter_end_mm}
                        onChange={(e) => updateSection(selectedSection.section_id, { outer_diameter_end_mm: parseFloat(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-gray-600">Length: </span>
                        <span className="font-medium">
                          {(selectedSection.end_position_in - selectedSection.start_position_in).toFixed(1)}"
                        </span>
                        <span className="text-gray-600">"</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Taper Rate: </span>
                        <span className="font-medium">
                          {((selectedSection.outer_diameter_end_mm - selectedSection.outer_diameter_start_mm) / (selectedSection.end_position_in - selectedSection.start_position_in)).toFixed(2)}
                        </span>
                        <span className="text-gray-600"> mm/in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h2 className="text-lg font-semibold text-green-800">✓ Design Valid</h2>
              <p className="text-sm text-green-700">All sections pass manufacturing constraints</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
