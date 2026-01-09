// src/pages/ResultsPage/hooks/useNormalizedPercentages.ts
import { useMemo } from "react";

interface ProgramPercentages {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET Electronics Technology": number;
  "BSET Electrical Technology": number;
}
interface ShortKeyPercentages {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET-E": number;
  "BSET-EL": number;
}
const normalizePercentages = (percent: unknown): ProgramPercentages => {
  if (!percent || typeof percent !== "object") {
    return {
      BSIT: 0,
      BSCS: 0,
      BSIS: 0,
      "BSET Electronics Technology": 0,
      "BSET Electrical Technology": 0,
    };
  }

  // Already full names?
  if ("BSET Electronics Technology" in percent) {
    return percent as ProgramPercentages;
  }

  // Map short keys (e.g., BSET-E → full name)
  const short = percent as ShortKeyPercentages;
  return {
    BSIT: short.BSIT ?? 0,
    BSCS: short.BSCS ?? 0,
    BSIS: short.BSIS ?? 0,
    "BSET Electronics Technology": short["BSET-E"] ?? 0,
    "BSET Electrical Technology": short["BSET-EL"] ?? 0,
  };
};

export const useNormalizedPercentages = (percent: unknown) => {
  return useMemo(() => normalizePercentages(percent), [percent]);
};
