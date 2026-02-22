# Architecture

The system consists of:

UI Layer
    Controls & Inputs
State Layer
    Zustand store
Rendering Layer
    SVG components
Geometry Layer
    Pure functions

Flow:
UI → Store → Preview → SVG

Geometry must not depend on React.
Geometry functions must accept config and return SVG path data.
