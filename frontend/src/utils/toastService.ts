import { toast, Bounce } from "react-toastify";
import { categoryTitles } from "../config/constants";

const sectionColors: Record<string, string> = {
  background: "#4CAF50",
  academic: "#2196F3",
  technical: "#FF9800",
  careerInterest: "#9C27B0",
  learningStyle: "#E91E63",
  usability: "#607D8B",
};

export const notifySectionWarning = (sectionKey: string) => {
  toast.warn(
    `Please answer at least one question in the "${
      categoryTitles[sectionKey] || sectionKey
    }" section before proceeding.`,
    {
      style: {
        backgroundColor: sectionColors[sectionKey] || "#333",
        color: "#fff",
        fontWeight: "bold",
      },
      position: "top-right",
      autoClose: 3000,
      transition: Bounce,
    }
  );
};
