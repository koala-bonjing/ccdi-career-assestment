
import { create } from "zustand";

type TooltipState = {
  activeTooltip: string | null;
  showTooltip: (id: string) => void;
  hideTooltip: () => void;
};

export const useTooltipStore = create<TooltipState>((set) => ({
  activeTooltip: null,
  showTooltip: (id) => set({ activeTooltip: id }),
  hideTooltip: () => set({ activeTooltip: null }),
}));
