import { atom, useAtom } from 'jotai';

const parentMessageIdAtom = atom<string | null>(null);

export const useParentMessageId = () => {
  return useAtom(parentMessageIdAtom);
};
