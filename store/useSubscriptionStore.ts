import { create } from 'zustand';

type SubscriptionState = {
  tier: 'free' | 'pro';
};

export const useSubscriptionStore = create<SubscriptionState>(() => ({
  tier: 'free',
}));
