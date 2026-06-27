import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';

import { api } from '@/../convex/_generated/api';
import type { Id } from '@/../convex/_generated/dataModel';

type RequestType = {
  conversationId: Id<'conversations'>;
  workspaceId: Id<'workspaces'>;
};

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useMarkConversationRead = () => {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'settled' | 'pending' | null>(null);

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);

  const mutation = useMutation(api.messages.markConversationRead);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setError(null);
        setStatus('pending');

        await mutation(values);
        setStatus('success');
        options?.onSuccess?.();
      } catch (error) {
        setStatus('error');
        options?.onError?.(error as Error);

        if (!options?.throwError) throw error;
      } finally {
        setStatus('settled');
        options?.onSettled?.();
      }
    },
    [mutation],
  );

  return {
    mutate,
    error,
    isPending,
    isError,
    isSuccess,
    isSettled,
  };
};
