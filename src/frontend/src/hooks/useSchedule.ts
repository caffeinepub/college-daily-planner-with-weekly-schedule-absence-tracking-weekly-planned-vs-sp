import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ScheduleItem } from '../backend';

export function useGetScheduleItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScheduleItem[]>({
    queryKey: ['scheduleItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScheduleItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateScheduleItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: ScheduleItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScheduleItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleItems'] });
    },
  });
}
