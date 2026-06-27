import { atom, useAtom } from 'jotai';

const profileMemberIdAtom = atom<string | null>(null);

export const useProfileMemberId = () => {
  return useAtom(profileMemberIdAtom);
};
