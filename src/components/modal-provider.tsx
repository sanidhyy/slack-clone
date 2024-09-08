'use client';

import { useEffect, useState } from 'react';

import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
