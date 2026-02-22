PROJECT OVERVIEW (High-Level Description)
Project Name

CueForge (working title)

Goal

Build a local-first web application that allows a single user to design the lower half (butt section) of a pool/billiards cue in 2D using SVG rendering.

The application is:

Personal-use only

Not multi-user

No authentication

No backend required

No manufacturing calculations required

No 3D rendering required

It must provide:

A live 2D side-view preview (SVG-based)

A UI to configure all design elements

Ability to save/load designs locally

Export as SVG and PNG

🎯 Functional Scope

The app must support design of these cue sections:

Joint Pin

Joint Collar

Forearm

Handle / Wrap Area

Butt Sleeve

Butt Cap

Not included:

Shafts

Physics

Real-world measurements beyond proportional scaling

🎨 Design Features To Support
Joint Pin

Selectable types:

radial (3/8x8)

3/8x10

5/16x14

5/16x18

Color selection

Purely visual representation

Sections (Collar, Forearm, Handle, Butt Sleeve, Butt Cap)

Each section must support:

Base color

Optional texture image (wood pattern upload)

Ring stack (multiple layers)

Optional inlays (depending on section)

🪵 Inlay Types To Support

Minimum supported:

4-point

6-point

8-point

Butterfly points

Diamond pattern

Greek key

Tribal/Aztec geometric

Abalone-style inserts

Each inlay must allow:

Base inlay color

Veneers (0 to N layers)

Each veneer:

Color

Thickness

Adjustable point length (for point-based inlays)

Symmetry based on type

💍 Ring System Requirements

Rings must be:

Stackable layers

Each layer:

Color

Thickness

Reorderable

Optional presets:

Simple single band

Metal accent

Dash & dots

Stacked veneers

Mosaic ring

Square ring

Shell inlay style

Rings can appear:

Above and below any section

🖥 Rendering Requirements

Rendering must use:

SVG (not Canvas)

Declarative React components

Pure geometry-based generation (no static images except textures)

Must support:

Zoom

Pan

Crisp scaling

Export as:

SVG

PNG

💾 State Management

Use:

React + TypeScript

Zustand for global state

Entire cue stored as one serializable object.

