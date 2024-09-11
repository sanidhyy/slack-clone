'use client';

import { useQuery } from 'convex/react';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

interface UseGetMembersProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const data = useQuery(api.members.get, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};
