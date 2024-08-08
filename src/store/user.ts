import {
  SignInParams,
  SignOutParams,
  SignUpParams,
  signIn,
  signOut,
  signUp,
} from '@/lib/auth/client';
import { removeToken, setToken } from '@/lib/token';
import { User } from '@/types/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface UserState {
  user: User | null;
  signIn: (params: SignInParams) => Promise<{ user?: User; message?: string }>;
  signOut: (params: SignOutParams) => Promise<{ message?: string }>;
  signUp: (params: SignUpParams) => Promise<{ message?: string }>;
  updateUser: (user: User) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      signIn: async (params) => {
        try {
          const res = await signIn(params);
          const { data, message } = res;

          if (message) {
            return { message };
          }

          setToken(data.accessToken);
          set({ user: data });

          return { user: data };
        } catch (error: any) {
          return { message: error.response?.data.detail || error.message };
        }
      },

      signOut: async (params) => {
        try {
          const { message } = await signOut(params);
          if (message) {
            return { message };
          } else {
            set({ user: null });
            removeToken();
            return {};
          }
        } catch (error: any) {
          return { message: error.response?.data.detail || error.message };
        }
      },

      signUp: async (params) => {
        try {
          const res = await signUp(params);
          const { message } = res;

          if (message) {
            return { message };
          } else {
            return {};
          }
        } catch (error: any) {
          return { message: error.response?.data.detail || error.message };
        }
      },

      updateUser: (user: User) => set({ user }),
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;
