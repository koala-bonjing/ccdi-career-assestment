// src/store/useEvaluationStore.ts
import { create } from "zustand";
import type { EvaluationResult } from "../src/config/types";

type EvaluationState = {
  name: string;
  setName: (name: string) => void;

  answers: Record<string, boolean | number | string>;
  setAnswers: (answers: Record<string, boolean | number | string>) => void;
  updateAnswer: (key: string, value: boolean | number | string) => void;

  result: EvaluationResult | null;
  setResult: (result: EvaluationResult | null) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
};

export const useEvaluationStore = create<EvaluationState>((set) => ({
  name: "",
  setName: (name) => set({ name }),

  answers: {},
  setAnswers: (answers) => set({ answers }),
  updateAnswer: (key, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: value,
      },
    })),

  result: null,
  setResult: (result) => set({ result }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),
}));
