import { useQueryState } from 'nuqs';

export const useProfileMemberId = () => {
  return useQueryState('profileMemberId');
};
