import { signIn, SignInParams, signUp, SignUpParams } from '@/lib/auth/client';
import { removeToken, setToken } from '@/lib/token';
import { User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  signIn: (params: SignInParams) => Promise<{ user?: User; error?: string }>;
  signOut: () => void;
  signUp: (params: SignUpParams) => Promise<{ user?: User; message?: string }>;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  signIn: async (params) => {
    const res = await signIn(params);
    if (res.message) {
      return { error: res.message };
    } else {
      res.token && setToken(res.token);
      set({ user: res.data });
      return { user: res.data };
    }
  },
  signOut: () => {
    set({ user: null });
    removeToken();
  },

  signUp: async (params) => {
    const res = await signUp(params);
    if (res.message) {
      return { message: res.message };
    } else {
      res.token && setToken(res.token);
      set({ user: res.data });
      return { user: res.data };
    }
  },
}));

export default useUserStore;
