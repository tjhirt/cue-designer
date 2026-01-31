import { cuesApi } from '@/services/cues'
import { CueDesign } from '@/types/cue'

export async function exportSvg(cueId: string) {
  try {
    const response = await cuesApi.getSvg(cueId)
    const blob = new Blob([response.data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${cueId}-profile.svg`
    link.click()
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}

export async function exportJson(cueDesign: CueDesign) {
  const data = JSON.stringify(cueDesign, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${cueDesign.cue_id}-design.json`
  link.click()
  
  URL.revokeObjectURL(url)
}
