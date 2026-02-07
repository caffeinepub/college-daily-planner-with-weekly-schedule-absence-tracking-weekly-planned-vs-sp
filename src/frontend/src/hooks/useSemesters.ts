import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Semester } from '../backend';

export function useGetSemesters() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Semester[]>({
    queryKey: ['semesters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSemesters();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateSemester() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (semester: Semester) => {
      if (!actor) {
        throw new Error('Actor not available. The app is not ready yet.');
      }
      return actor.createSemester(semester);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
    },
  });
}
