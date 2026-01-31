import { create } from 'zustand'
import { CueDesign, CueSection, ValidationError } from '@/types/cue'

interface CueStore {
  currentCue: CueDesign | null
  selectedSectionId: string | null
  isDirty: boolean
  validationErrors: ValidationError[]
  setCurrentCue: (cue: CueDesign) => void
  updateSection: (sectionId: string, updates: Partial<CueSection>) => void
  addSection: (section: CueSection) => void
  removeSection: (sectionId: string) => void
  setSelectedSection: (sectionId: string | null) => void
  setValidationErrors: (errors: ValidationError[]) => void
  reset: () => void
}

export const useCueStore = create<CueStore>((set) => ({
  currentCue: null,
  selectedSectionId: null,
  isDirty: false,
  validationErrors: [],
  setCurrentCue: (cue) => set({ currentCue: cue, isDirty: false }),
  updateSection: (sectionId, updates) =>
    set((state) => ({
      currentCue: state.currentCue
        ? {
            ...state.currentCue,
            sections: state.currentCue.sections.map((s) =>
              s.section_id === sectionId ? { ...s, ...updates } : s
            ),
          }
        : null,
      isDirty: true,
    })),
  addSection: (section) =>
    set((state) => ({
      currentCue: state.currentCue
        ? { ...state.currentCue, sections: [...state.currentCue.sections, section] }
        : null,
      isDirty: true,
    })),
  removeSection: (sectionId) =>
    set((state) => ({
      currentCue: state.currentCue
        ? {
            ...state.currentCue,
            sections: state.currentCue.sections.filter((s) => s.section_id !== sectionId),
          }
        : null,
      isDirty: true,
    })),
  setSelectedSection: (sectionId) => set({ selectedSectionId: sectionId }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  reset: () =>
    set({
      currentCue: null,
      selectedSectionId: null,
      isDirty: false,
      validationErrors: [],
    }),
}))
