import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AbsenceRecord } from '../backend';

export function useGetAbsences() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AbsenceRecord[]>({
    queryKey: ['absences'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAbsences();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAbsence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: AbsenceRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAbsence(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
    },
  });
}
