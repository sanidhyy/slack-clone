import { useQuery } from 'convex/react';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

interface UseGetMessageProps {
  id: Id<'messages'>;
}

export const useGetMessage = ({ id }: UseGetMessageProps) => {
  const data = useQuery(api.messages.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};
