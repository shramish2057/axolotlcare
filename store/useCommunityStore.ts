import { create } from 'zustand';

type CommunityState = {
  feedLoaded: boolean;
};

export const useCommunityStore = create<CommunityState>(() => ({
  feedLoaded: false,
}));
