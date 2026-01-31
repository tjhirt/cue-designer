import { useEffect, useRef } from 'react'
import { CueDesign } from '@/types/cue'

interface GeometryCanvasProps {
  cueDesign: CueDesign
  highlightSection?: string
  onSectionClick?: (sectionId: string) => void
}

export function GeometryCanvas({ 
  cueDesign, 
  highlightSection, 
  onSectionClick 
}: GeometryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cueDesign.cue_id) return

    const loadSvg = async () => {
      try {
        const response = await fetch(`/api/svg/${cueDesign.cue_id}/`)
        const svgContent = await response.text()
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svgContent
          
          const paths = containerRef.current.querySelectorAll('path, circle')
          paths.forEach(path => {
            path.setAttribute('style', 'cursor: pointer')
            const sectionId = (path as HTMLElement).dataset.sectionId
            if (sectionId) {
              path.addEventListener('click', () => onSectionClick?.(sectionId))
            }
          })
        }
      } catch (error) {
        console.error('Failed to load SVG:', error)
      }
    }

    loadSvg()
  }, [cueDesign.cue_id, highlightSection, onSectionClick])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] bg-gray-50 rounded-lg"
    />
  )
}
