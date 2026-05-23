import { create } from 'zustand';

type AuthState = {
  isHydrated: boolean;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  setHydrated: () => set({ isHydrated: true }),
}));
