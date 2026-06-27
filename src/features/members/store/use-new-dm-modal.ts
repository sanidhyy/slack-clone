import { atom, useAtom } from 'jotai';

const newDmModalAtom = atom(false);

export const useNewDmModal = () => {
  return useAtom(newDmModalAtom);
};
