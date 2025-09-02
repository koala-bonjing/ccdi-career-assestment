import React, { useEffect } from "react";
import { useTooltipStore } from "../../../store/useTooltipStore";
import { Info } from "lucide-react";

interface TooltipButtonProps {
  id: string;
  text?: string;
  paragraph: string;
  icon?: React.ReactNode;
  buttonBgColor?: string; // e.g. "bg-blue-600", "bg-orange-600"
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  id,
  text,
  paragraph,
  icon,
  buttonBgColor = "bg-blue-600",
}) => {
  const { activeTooltip, showTooltip, hideTooltip } = useTooltipStore();
  const isActive = activeTooltip === id;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`#tooltip-${id}`)) {
        hideTooltip();
      }
    };
    if (isActive) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, id, hideTooltip]);

  return (
    <div id={`tooltip-${id}`} className="relative inline-block group">
      <button
        type="button"
        onClick={() => (isActive ? hideTooltip() : showTooltip(id))}
        className={`flex items-center gap-2 px-3 py-1 text-sm font-medium text-white rounded-md transition 
                    hover:opacity-90 focus:outline-none ${buttonBgColor}`}
      >
        {icon || <Info size={16} />}
        {text && <span>{text}</span>}
      </button>

      {/* Hover hint BELOW the button. Hidden when the main tooltip is active */}
      {!isActive && (
        <span
          className="absolute left-1/2 -translate-x-1/2 top-11
                     opacity-0 group-hover:opacity-100 
                     bg-white/40 text-white text-sm md:text-base 
                     px-3 py-1.5 rounded-lg shadow-lg 
                     transition-all duration-200 pointer-events-none 
                     whitespace-nowrap z-50 "
        >
          Read for info
          {/* Arrow (triangle) */}
          <span
            className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0
                       border-l-[8px] border-r-[8px] border-b-[8px]
                       border-l-transparent border-r-transparent border-blue-500/"
          />
        </span>
      )}

      {/* Main tooltip content */}
      {isActive && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-8 
               w-64 p-3 bg-blue-500/20 border-2 border-gray-600
               rounded-lg shadow-lg text-sm text-gray-700 z-50 
               font-poppins text-text-primary"
        >
          {paragraph}

          {/* Arrow pointing left (towards button) */}
          <span
            className="absolute -left-2 top-1/2 -translate-y-1/2
                 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px]
                 border-t-transparent border-b-transparent border-r-white"
          />
          {/* Border outline for arrow */}
          <span
            className="absolute -left-[11px] top-1/2 -translate-y-1/2
                 w-0 h-0 border-t-[11px] border-b-[11px] border-r-[11px]
                 border-t-transparent border-b-transparent border-r-gray-600 -z-10"
          />
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
