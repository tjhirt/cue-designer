# Cue Designer - Project Plan

## Overview

A local-first 2D pool cue butt designer application built with React, TypeScript, Vite, Zustand, and SVG rendering.

### Tech Stack
- React
- TypeScript
- Vite
- Zustand
- SVG rendering
- react-router-dom

### Core Principles
- No backend
- No Canvas
- No 3D
- All geometry parametric
- Fully state-driven
- Clean TypeScript types

---

## Completed Phases

### Phase 1: Project Scaffold ✅
- Vite + React + TypeScript project setup
- File structure established
- Zustand store with CueDesign state
- Basic CuePreview SVG component
- SectionRenderer for colored sections

### Phase 2: Ring System ✅
- RingStack component with geometry
- Ring editor controls (add/remove/update)
- Rings render within section length (not adding to it)

### Phase 3: Point Inlays (Simple) ✅
- 4/6/8 point inlay geometry with round-cue simulation
- PointInlay component
- InlayRenderer dispatch
- InlayEditor controls (type, color, length, width, start position)
- Veneer layering support
- Default width calculation for touching points

### Phase 5: UI Editor ✅
- Horizontal layout with collapsible panels
- TopPanel (Joint Pin + section tabs) - collapsed by default
- BottomPanel (Section editor) - expanded by default
- Section selection via tabs or clicking cue
- Bidirectional highlighting between preview and editor

### Horizontal Layout Refactor ✅
- Core rendering components in `preview/core/`
- Orientation-aware CueRenderer, SectionRenderer, JointPin
- HorizontalPreview (default editor view)
- VerticalPreview (/view route, zoom only)
- Tab sync via BroadcastChannel

### Real-World Measurements ✅
- Scale: 24px = 1cm (60px width = 2.5cm)
- Default section lengths in cm:
  - Joint Pin: 3.3 cm (79px)
  - Joint Collar: 2.5 cm (60px)
  - Forearm: 29.5 cm (708px)
  - Handle: 30.7 cm (737px)
  - Butt Sleeve: 9 cm (216px)
  - Butt Cap: 1.5 cm (36px)
  - **Total: 73.2 cm (28.8")**
- Length inputs display in cm
- Total length shown in header (cm + inches)

---

## Pending Phases

### Phase 4: Additional Inlay Types
- [ ] Diamond inlay component with geometry
- [ ] Greek key inlay component with geometry
- [ ] (Optional) Butterfly inlay
- [ ] (Optional) Tribal inlay
- [ ] (Optional) Abalone inlay

### Phase 6: Export & Persistence
- [ ] JSON save/load (download/upload design files)
- [ ] SVG export (download .svg file)
- [ ] PNG export (via SVG-to-canvas conversion)
- [ ] LocalStorage persistence (auto-save/restore)

### Future: High/Low Points (6-point and 8-point)
- [ ] Add `highPointLength` to InlayConfig
- [ ] Add `highPointColor` to InlayConfig (optional)
- [ ] Add `highPointVeneers` to InlayConfig (optional)
- [ ] High points render on top of low points with overlap
- [ ] Editor controls for high point settings

---

## File Structure

```
src/
├── components/
│   ├── preview/
│   │   ├── core/
│   │   │   ├── CueRenderer.tsx      # Shared cue rendering (orientation-aware)
│   │   │   ├── SectionRenderer.tsx  # Shared section (orientation prop)
│   │   │   ├── JointPin.tsx         # Shared joint pin (orientation prop)
│   │   │   ├── RingStack.tsx        # Supports horizontal/vertical
│   │   │   └── index.ts
│   │   ├── HorizontalPreview.tsx    # Editor view
│   │   ├── VerticalPreview.tsx      # /view route, zoom only
│   │   └── index.ts
│   ├── panels/
│   │   ├── TopPanel.tsx             # Joint Pin + section tabs
│   │   ├── BottomPanel.tsx          # Section editor
│   │   └── index.ts
│   ├── header/
│   │   ├── Header.tsx               # Title, length display, open view button
│   │   └── index.ts
│   ├── editor/
│   │   ├── SectionEditor.tsx        # Base color, length (cm)
│   │   ├── RingEditor.tsx           # Ring add/remove/color/thickness
│   │   ├── InlayEditor.tsx          # Inlay enable/type/color/length/width
│   │   └── index.ts
│   ├── inlays/
│   │   ├── InlayRenderer.tsx        # Dispatches to inlay type
│   │   ├── PointInlay.tsx           # 4/6/8 point rendering
│   │   └── index.ts
│   └── App.tsx                      # Routes: / (editor), /view (vertical)
├── geometry/
│   └── pointInlay.ts                # Point geometry calculations
├── store/
│   └── useCueStore.ts               # Zustand store + PX_PER_CM export
├── hooks/
│   └── useSyncAcrossTabs.ts         # BroadcastChannel sync
├── types/
│   └── index.ts                     # TypeScript types
└── App.css                          # Horizontal layout styles
```

---

## Key Types

```typescript
// types/index.ts

type RingLayer = {
  id: string
  color: string
  thickness: number
}

type VeneerLayer = {
  id: string
  color: string
  thickness: number
}

type InlayType =
  | "4-point" | "6-point" | "8-point"
  | "butterfly" | "diamond" | "greek-key"
  | "tribal" | "abalone"

type InlayConfig = {
  type: InlayType
  color: string
  pointLength?: number
  pointWidth?: number
  startPosition?: "top" | "bottom"
  veneers: VeneerLayer[]
}

type Section = {
  baseColor: string
  texture?: string
  length: number  // in pixels
  ringsTop: RingLayer[]
  ringsBottom: RingLayer[]
  inlay?: InlayConfig
}

type CueDesign = {
  jointPin: { type: JointPinType; color: string }
  jointCollar: Section
  forearm: Section
  handle: Section
  buttSleeve: Section
  buttCap: Section
}
```

---

## Store State

```typescript
// store/useCueStore.ts

type CueStore = {
  design: CueDesign
  hoveredSection: SectionKey | null
  selectedSection: SectionKey
  topPanelCollapsed: boolean
  bottomPanelCollapsed: boolean
  
  // Actions
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
```

---

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | EditorLayout | Horizontal preview with top/bottom panels |
| `/view` | ViewLayout | Vertical preview with zoom controls (new tab) |

---

## Notes

- **Scale**: 24 pixels = 1 cm
- **Cue thickness**: 60px (2.5cm equivalent)
- **Rings** render within section length, not adding to it
- **Inlay width** auto-calculated for touching points based on smallest gap
- **Tab sync** uses BroadcastChannel for real-time updates between editor and view tabs
