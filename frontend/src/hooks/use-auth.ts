import { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { AuthContext } from '@/contexts/auth-context';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutations';

interface AuthPayload {
  token: string;
  user: { id: string; name: string; email: string };
}

export function useAuth() {
  const context = useContext(AuthContext);

  const [loginMutation, { loading: loginLoading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation<{ register: AuthPayload }>(REGISTER_MUTATION);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });
    if (data?.login) {
      context.login(data.login.token, data.login.user);
    }
    return data?.login;
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await registerMutation({
      variables: { input: { name, email, password } },
    });
    if (data?.register) {
      context.login(data.register.token, data.register.user);
    }
    return data?.register;
  };

  return {
    user: context.user,
    loading: context.loading || loginLoading || registerLoading,
    loginLoading,
    registerLoading,
    login,
    register,
    logout: context.logout,
  };
}
