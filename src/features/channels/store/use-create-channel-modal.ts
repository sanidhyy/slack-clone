'use client';

import { atom, useAtom } from 'jotai';

const createChannelModalAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(createChannelModalAtom);
};
