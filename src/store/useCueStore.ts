import { create } from "zustand"
import type { CueDesign, Section, SectionKey, RingLayer, VeneerLayer, JointPin, InlayConfig } from "../types"

const createDefaultSection = (baseColor: string, length: number): Section => ({
  baseColor,
  length,
  ringsTop: [],
  ringsBottom: [],
})

const defaultDesign: CueDesign = {
  jointPin: {
    type: "radial-3-8x8",
    color: "#C0C0C0",
  },
  jointCollar: createDefaultSection("#2C1810", 15),
  forearm: createDefaultSection("#8B4513", 120),
  handle: createDefaultSection("#1C1C1C", 100),
  buttSleeve: createDefaultSection("#8B4513", 150),
  buttCap: createDefaultSection("#2C1810", 20),
}

type CueStore = {
  design: CueDesign
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
