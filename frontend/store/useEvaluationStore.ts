// src/store/useEvaluationStore.ts
import { create } from "zustand";
import type { AssessmentResult } from "../src/types";

type EvaluationState = {
  name: string;
  setName: (name: string) => void;

  answers: Record<string, boolean | number | string>;
  setAnswers: (answers: Record<string, boolean | number | string>) => void;
  updateAnswer: (key: string, value: boolean | number | string) => void;
  clearAllAnswers: () => void; // ADD THIS

  result: AssessmentResult | null;
  setResult: (result: AssessmentResult | null) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  sectionKeys: string[];
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
};

export const useEvaluationStore = create<EvaluationState>((set) => ({
  name: "",
  setName: (name) => set({ name }),

  answers: {},
  setAnswers: (answers) => set({ answers }),
  updateAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),
  
  // ADD THIS FUNCTION
  clearAllAnswers: () => set({ 
    answers: {},
    result: null,
    error: null,
    currentSectionIndex: 0 
  }),

  result: null,
  setResult: (result) => set({ result }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  sectionKeys: [
    "academicAptitude",
    "technicalSkills",
    "careerInterest",
    "learningStyle",
  ],
  currentSectionIndex: 0,
  setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
  nextSection: () =>
    set((state) => ({
      currentSectionIndex: Math.min(
        state.currentSectionIndex + 1,
        state.sectionKeys.length - 1
      ),
    })),
  prevSection: () =>
    set((state) => ({
      currentSectionIndex: Math.max(state.currentSectionIndex - 1, 0),
    })),
}));