export type RingLayer = {
  id: string
  color: string
  thickness: number
}

export type VeneerLayer = {
  id: string
  color: string
  thickness: number
}

export type InlayType =
  | "4-point"
  | "6-point"
  | "8-point"
  | "butterfly"
  | "diamond"
  | "greek-key"
  | "tribal"
  | "abalone"

export type InlayConfig = {
  type: InlayType
  color: string
  pointLength?: number
  veneers: VeneerLayer[]
}

export type Section = {
  baseColor: string
  texture?: string
  length: number
  ringsTop: RingLayer[]
  ringsBottom: RingLayer[]
  inlay?: InlayConfig
}

export type JointPinType = "radial-3-8x8" | "3-8x10" | "5-16x14" | "5-16x18"

export type JointPin = {
  type: JointPinType
  color: string
}

export type CueDesign = {
  jointPin: JointPin
  jointCollar: Section
  forearm: Section
  handle: Section
  buttSleeve: Section
  buttCap: Section
}

export type SectionKey = "jointCollar" | "forearm" | "handle" | "buttSleeve" | "buttCap"
