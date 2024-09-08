'use client';

import { atom, useAtom } from 'jotai';

const createWorkspaceModalAtom = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(createWorkspaceModalAtom);
};
