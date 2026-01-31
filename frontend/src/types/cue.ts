export type SectionType = 'joint' | 'forearm' | 'handle' | 'sleeve' | 'butt'
export type DesignStyle = 'traditional_classic' | 'modern_minimal' | 'ornate' | 'art_deco' | 'contemporary'
export type SymmetryType = 'radial' | 'bilateral' | 'asymmetric'
export type EraInfluence = 'vintage' | 'traditional' | 'modern' | 'contemporary'
export type ComplexityLevel = 'low' | 'medium' | 'high'

export type JointType = '5_16_18' | '3_8_10' | '5_16_14' | 'radial' | 'uni_loc' | 'quick_release'
export type PinMaterial = 'stainless_steel' | 'brass' | 'titanium'
export type WoodSpecies = 'maple' | 'ebony' | 'rosewood' | 'cocobolo' | 'bubinga' | 'purpleheart'
export type WrapType = 'irish_linen' | 'leather' | 'synthetic' | 'none'
export type FinishType = 'oil' | 'polyurethane' | 'lacquer' | 'wax'
export type TipType = 'leather' | 'phenolic' | 'layered'
export type QCStatus = 'pending' | 'approved' | 'rejected' | 'in_production' | 'completed'

export interface InlayPattern {
  pattern_id: string
  pattern_category: string
  pattern_style: string
  repeat_count: number
  radial_symmetry: boolean
  geometric_definition: {
    geometry_type: string
    dimensions_mm: {
      width: number
      height: number
      depth: number
    }
    orientation: {
      rotation_deg: number
      axis: string
    }
    positioning: {
      x_center_in: number
    }
  }
  material_assignment: {
    base_material: string
    inlay_material: string
    contrast_level: string
    finish_type: string
  }
}

export interface CueSection {
  id?: number
  section_id: string
  section_type: SectionType
  start_position_in: number
  end_position_in: number
  outer_diameter_start_mm: number
  outer_diameter_end_mm: number
  inlay_patterns: InlayPattern[]
  length_in?: number
  taper_rate_mm_per_in?: number
  joint_type?: JointType
  joint_collar_diameter_mm?: number
  joint_pin_material?: PinMaterial
  wood_species?: WoodSpecies
  wrap_type?: WrapType
  wrap_color?: string
  wrap_pattern?: string
  finish_type?: FinishType
  stain_color?: string
  weight_oz?: number
  balance_point_in?: number
  production_notes?: string
  qc_status?: QCStatus
}

export interface CueDesign {
  id?: number
  cue_id: string
  design_style: DesignStyle
  overall_length_in: number
  symmetry_type: SymmetryType
  era_influence: EraInfluence
  complexity_level: ComplexityLevel
  notes?: string
  sections: CueSection[]
  created_at?: string
  updated_at?: string
  shaft_diameter_mm?: number
  shaft_length_in?: number
  tip_type?: TipType
  tip_size_mm?: number
}

export interface ValidationError {
  field?: string
  message: string
  section_id?: string
}
