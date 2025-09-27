import { useState, useEffect } from "react";
import { StepProgress } from "react-loaderkit";

const COLORS = ["#5fa8f7", "#f78da7", "#f7d35f", "#7ff77f"];

export default function LoadingSpinner() {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 500); // switch every 0.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <StepProgress size={70} color={COLORS[colorIndex]} speed={1} />
      <p className="mt-4 text-blue-600 font-medium">Generating your result...</p>
    </div>
  );
}
