import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginCredentials, type SignUpData } from '../services/api';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignUpData) => authApi.signup(data),
  });
};

