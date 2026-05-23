import { create } from 'zustand';

type AxolotlState = {
  selectedAxolotlId: string | null;
  selectAxolotl: (id: string) => void;
};

export const useAxolotlStore = create<AxolotlState>((set) => ({
  selectedAxolotlId: null,
  selectAxolotl: (id) => set({ selectedAxolotlId: id }),
}));
