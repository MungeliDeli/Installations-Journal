import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};