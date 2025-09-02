// store/useWelcomeScreen.ts
import { create } from "zustand";

interface WelcomeState {
  name: string;
  showWelcome: boolean;
  setName: (name: string) => void;
  hideWelcome: () => void;
}

export const useWelcomeScreen = create<WelcomeState>((set) => ({
  name: "",
  showWelcome: true,
  setName: (name) => set({ name }),
  hideWelcome: () => set({ showWelcome: false }),
}));

interface ShowInputsState {
  showInputs: boolean;
  toggleInputs: () => void;
  setShowInputs: (value: boolean) => void;
}

export const useShowInputs = create<ShowInputsState>((set) => ({
  showInputs: false,
  toggleInputs: () => set((state) => ({ showInputs: !state.showInputs })),
  setShowInputs: (value: boolean) => set({ showInputs: value }),
}));
