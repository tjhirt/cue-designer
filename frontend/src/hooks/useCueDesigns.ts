import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cuesApi } from '@/services/cues'
import { CueDesign } from '@/types/cue'

type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function useCueDesigns() {
  return useQuery<CueDesign[]>({
    queryKey: ['cues'],
    queryFn: () => cuesApi.getAll(),
    retry: 2,
    onError: (error) => {
      console.error('useCueDesigns error:', error)
    },
  })
}

export function useCueDesign(id: number) {
  return useQuery({
    queryKey: ['cues', id],
    queryFn: () => cuesApi.getById(id),
  })
}

export function useCreateCue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CueDesign>) => cuesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cues'] })
    },
  })
}

export function useUpdateCue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CueDesign> }) =>
      cuesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cues'] })
    },
  })
}

export function useDeleteCue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cuesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cues'] })
    },
  })
}
