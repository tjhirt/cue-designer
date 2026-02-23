import { create } from "zustand"
import type { CueDesign, Section, SectionKey, RingLayer, VeneerLayer, JointPin, InlayConfig } from "../types"

export const PX_PER_CM = 24

const createDefaultSection = (baseColor: string, lengthCm: number): Section => ({
  baseColor,
  length: lengthCm * PX_PER_CM,
  ringsTop: [],
  ringsBottom: [],
})

const defaultDesign: CueDesign = {
  jointPin: {
    type: "radial-3-8x8",
    color: "#C0C0C0",
  },
  jointCollar: createDefaultSection("#2C1810", 2.5),
  forearm: createDefaultSection("#8B4513", 29.5),
  handle: createDefaultSection("#1C1C1C", 30.7),
  buttSleeve: createDefaultSection("#8B4513", 9),
  buttCap: createDefaultSection("#2C1810", 1.5),
}

type CueStore = {
  design: CueDesign
  hoveredSection: SectionKey | null
  selectedSection: SectionKey
  topPanelCollapsed: boolean
  bottomPanelCollapsed: boolean
  setHoveredSection: (key: SectionKey | null) => void
  setSelectedSection: (key: SectionKey) => void
  toggleTopPanel: () => void
  toggleBottomPanel: () => void
  setJointPin: (jointPin: JointPin) => void
  updateSection: (key: SectionKey, section: Partial<Section>) => void
  addRingLayer: (sectionKey: SectionKey, position: "top" | "bottom", ring: RingLayer) => void
  removeRingLayer: (sectionKey: SectionKey, position: "top" | "bottom", ringId: string) => void
  updateRingLayer: (sectionKey: SectionKey, position: "top" | "bottom", ringId: string, ring: Partial<RingLayer>) => void
  setInlay: (sectionKey: SectionKey, inlay: InlayConfig | undefined) => void
  addVeneer: (sectionKey: SectionKey, veneer: VeneerLayer) => void
  removeVeneer: (sectionKey: SectionKey, veneerId: string) => void
  loadDesign: (design: CueDesign) => void
  resetDesign: () => void
}

export const useCueStore = create<CueStore>((set) => ({
  design: defaultDesign,
  hoveredSection: null,
  selectedSection: "forearm",
  topPanelCollapsed: true,
  bottomPanelCollapsed: false,

  setHoveredSection: (key) => set({ hoveredSection: key }),
  setSelectedSection: (key) => set({ selectedSection: key }),
  toggleTopPanel: () => set((state) => ({ topPanelCollapsed: !state.topPanelCollapsed })),
  toggleBottomPanel: () => set((state) => ({ bottomPanelCollapsed: !state.bottomPanelCollapsed })),

  setJointPin: (jointPin) =>
    set((state) => ({
      design: { ...state.design, jointPin },
    })),

  updateSection: (key, section) =>
    set((state) => ({
      design: {
        ...state.design,
        [key]: { ...state.design[key], ...section },
      },
    })),

  addRingLayer: (sectionKey, position, ring) =>
    set((state) => {
      const section = state.design[sectionKey]
      const rings = position === "top" ? "ringsTop" : "ringsBottom"
      return {
        design: {
          ...state.design,
          [sectionKey]: {
            ...section,
            [rings]: [...section[rings], ring],
          },
        },
      }
    }),

  removeRingLayer: (sectionKey, position, ringId) =>
    set((state) => {
      const section = state.design[sectionKey]
      const rings = position === "top" ? "ringsTop" : "ringsBottom"
      return {
        design: {
          ...state.design,
          [sectionKey]: {
            ...section,
            [rings]: section[rings].filter((r) => r.id !== ringId),
          },
        },
      }
    }),

  updateRingLayer: (sectionKey, position, ringId, ring) =>
    set((state) => {
      const section = state.design[sectionKey]
      const rings = position === "top" ? "ringsTop" : "ringsBottom"
      return {
        design: {
          ...state.design,
          [sectionKey]: {
            ...section,
            [rings]: section[rings].map((r) =>
              r.id === ringId ? { ...r, ...ring } : r
            ),
          },
        },
      }
    }),

  setInlay: (sectionKey, inlay) =>
    set((state) => ({
      design: {
        ...state.design,
        [sectionKey]: { ...state.design[sectionKey], inlay },
      },
    })),

  addVeneer: (sectionKey, veneer) =>
    set((state) => {
      const section = state.design[sectionKey]
      if (!section.inlay) return state
      return {
        design: {
          ...state.design,
          [sectionKey]: {
            ...section,
            inlay: {
              ...section.inlay,
              veneers: [...section.inlay.veneers, veneer],
            },
          },
        },
      }
    }),

  removeVeneer: (sectionKey, veneerId) =>
    set((state) => {
      const section = state.design[sectionKey]
      if (!section.inlay) return state
      return {
        design: {
          ...state.design,
          [sectionKey]: {
            ...section,
            inlay: {
              ...section.inlay,
              veneers: section.inlay.veneers.filter((v) => v.id !== veneerId),
            },
          },
        },
      }
    }),

  loadDesign: (design) => set({ design }),

  resetDesign: () => set({ design: defaultDesign }),
}))
