import api from './api'
import { CueDesign } from '@/types/cue'

export const cuesApi = {
  getAll: () => api.get<CueDesign[]>('/cues/').then(res => res.data),
  getById: (id: number) => api.get<CueDesign>(`/cues/${id}/`).then(res => res.data),
  create: (data: Partial<CueDesign>) => api.post<CueDesign>('/cues/', data).then(res => res.data),
  update: (id: number, data: Partial<CueDesign>) => 
    api.put<CueDesign>(`/cues/${id}/`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/cues/${id}/`),
  getGeometry: (id: number) => api.get(`/cues/${id}/geometry/`).then(res => res.data),
  getProfileData: (id: number) => api.get(`/cues/${id}/profile-data/`).then(res => res.data),
  getSvg: (cueId: string) => api.get(`/api/svg/${cueId}/`, { responseType: 'text' }),
}
