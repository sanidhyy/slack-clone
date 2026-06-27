'use client';

import { useQuery } from 'convex/react';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

interface UseGetUnreadCountProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetUnreadCount = ({ workspaceId }: UseGetUnreadCountProps) => {
  const data = useQuery(api.messages.getUnreadCount, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};
