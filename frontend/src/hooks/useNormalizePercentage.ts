import { useMemo } from "react";

export interface ProgramPercentages {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET Electronics Technology": number;
  "BSET Electrical Technology": number;
}

const FULL_PROGRAM_NAMES = [
  "BSIT",
  "BSCS",
  "BSIS",
  "BSET Electronics Technology",
  "BSET Electrical Technology",
] as const;

const SHORT_TO_FULL: Record<string, keyof ProgramPercentages> = {
  "BSET-E": "BSET Electronics Technology",
  "BSET-EL": "BSET Electrical Technology",
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
};

/**
 * Safely standardizes any percent record to full program names
 */
export const standardizeProgramKeys = (
  rawPercent: Record<string, number>
): ProgramPercentages => {
  const hasFullNames = "BSET Electronics Technology" in rawPercent;

  const result: ProgramPercentages = {
    BSIT: 0,
    BSCS: 0,
    BSIS: 0,
    "BSET Electronics Technology": 0,
    "BSET Electrical Technology": 0,
  };

  if (hasFullNames) {
    for (const key of FULL_PROGRAM_NAMES) {
      result[key] = rawPercent[key] ?? 0;
    }
  } else {
    for (const [shortKey, fullKey] of Object.entries(SHORT_TO_FULL)) {
      result[fullKey] = rawPercent[shortKey] ?? 0;
    }
  }

  return result;
};

/**
 * React hook to safely standardize program percentages WITHOUT normalization
 */
export const useNormalizedPercentages = (
  rawPercent: Record<string, number> | undefined
) => {
  return useMemo(() => {
    if (!rawPercent || Object.keys(rawPercent).length === 0) {
      return {
        BSIT: 20,
        BSCS: 20,
        BSIS: 20,
        "BSET Electronics Technology": 20,
        "BSET Electrical Technology": 20,
      };
    }

    return standardizeProgramKeys(rawPercent);
  }, [rawPercent]);
};