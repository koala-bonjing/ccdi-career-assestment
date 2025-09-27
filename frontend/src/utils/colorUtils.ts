// src/utils/colorUtils.ts
import type { ProgramType } from "../types";

export const getProgramTextColor = (program: ProgramType): string => {
  const colorMap: Record<ProgramType, string> = {
    BSCS: "text-blue-500",
    BSIT: "text-orange-500", 
    BSIS: "text-purple-500",
    teElectrical: "text-pink-500",
  };
  return colorMap[program] || "text-gray-600";
};