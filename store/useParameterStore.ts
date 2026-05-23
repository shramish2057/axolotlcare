import { create } from 'zustand';

type ParameterState = {
  latestLogId: string | null;
};

export const useParameterStore = create<ParameterState>(() => ({
  latestLogId: null,
}));
