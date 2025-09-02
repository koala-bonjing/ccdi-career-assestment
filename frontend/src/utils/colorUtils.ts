// src/utils/colorUtils.ts
import type { ProgramType } from "../types";

export const getProgramTextColor = (program: ProgramType): string => {
  const colorMap: Record<ProgramType, string> = {
    BSCS: "text-blue-600",
    BSIT: "text-orange-600", 
    BSIS: "text-purple-600",
    teElectrical: "text-pink-600",
  };
  return colorMap[program] || "text-gray-600";
};