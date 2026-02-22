# AGENTS.MD

## Project Overview

This project is a local-first 2D cue design tool built with:
- React
- TypeScript
- Zustand
- SVG rendering
- Vite

The goal is to implement a modular cue builder for the butt section of a pool cue.

No backend.
No authentication.
No server-side logic.

All rendering must be SVG-based and geometry-driven.

---

## Core Rules

1. Do not introduce backend.
2. Do not use Canvas.
3. Do not introduce 3D libraries.
4. All rendering must be componentized.
5. All geometry must be deterministic and parametric.
6. All state must be serializable.
7. No hardcoded design — everything driven by state.

---

## Architectural Principles

- Declarative rendering
- Separation of geometry from UI
- Pure functions for shape generation
- Reusable components
- Strong TypeScript typing
- No implicit state

---

## Rendering Architecture

- CuePreview.tsx
    - JointPin
    - SectionRenderer
        - RingStack
        - BaseLayer
        - InlayRenderer
            - PointInlay
            - DiamondInlay
            - GreekKeyInlay
            - TribalInlay

---

## Geometry Guidelines

All inlays must be generated via math.

Points:
- Divide circumference by N
- Generate symmetric triangular paths
- Apply veneer layers via progressive inward scaling

Rings:
- Stack rectangles with accumulated thickness

Greek key:
- Generated repeating rectilinear path

Diamond:
- Rotated square with optional border

---

## State Management

Use Zustand.

Single global store.

Provide:
- setJointPin
- updateSection
- addRingLayer
- removeRingLayer
- addVeneer
- removeVeneer

---

## Performance Constraints

- SVG should not re-render entire tree unnecessarily
- Memoize heavy geometry calculations
- Use React.memo where appropriate

---

## Deliverables

1. Initial scaffold
2. Data model
3. SVG preview system
4. Editor sidebar
5. Save/Load JSON
6. Export SVG
7. Export PNG
