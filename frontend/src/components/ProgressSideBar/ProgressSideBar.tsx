import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  X,
  BookOpen,
  Cpu,
  Target,
  Brain,
  User,
  CheckCircle,
} from "lucide-react";
import { assessmentSections } from "../../config/constants";

interface ProgressSideBarProps {
  currentSection?: number;
  onSectionChange?: (section: number) => void;
  isWelcomePage?: boolean;
  recommendedProgram?: string;
}

function ProgressSideBar({
  currentSection = 0,
  onSectionChange,
  isWelcomePage = false,
  recommendedProgram,
}: ProgressSideBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // On mobile, sidebar starts closed. On desktop, sidebar starts open.
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpen(!isOpen);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsAnimating(false);
  };

  const welcomeSection = {
    id: -1,
    name: "Welcome Student!",
    icon: User,
    description: "Start your career assessment journey",
    colorClass: "text-green-500",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/10",
  };

  const getSectionStatus = (sectionId: number) => {
    if (isWelcomePage) return "upcoming";
    if (sectionId < currentSection) return "completed";
    if (sectionId === currentSection) return "current";
    return "upcoming";
  };

  const getSectionColor = (sectionId: number) => {
    if (isWelcomePage) return "bg-gray-400";

    const status = getSectionStatus(sectionId);
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-yellow-400 animate-pulse";
      default:
        return "bg-gray-400";
    }
  };

  const getSectionStyles = (sectionId: number) => {
    if (isWelcomePage) {
      return {
        text: "text-green-400",
        icon: "text-green-400",
        border: "border-green-500/30",
        background: "bg-green-500/10",
      };
    }

    const status = getSectionStatus(sectionId);
    const section = assessmentSections[sectionId];

    switch (status) {
      case "completed":
        return {
          text: "text-green-400",
          icon: "text-green-400",
          border: "border-green-500/30",
          background: "bg-green-500/10",
        };
      case "current":
        return {
          text: section.colorClass,
          icon: section.colorClass,
          border: section.borderColor,
          background: section.bgColor,
        };
      default:
        return {
          text: "text-gray-400",
          icon: "text-gray-400",
          border: "border-white/10",
          background: "bg-transparent",
        };
    }
  };

  // FIXED: Better progress calculation - only count fully completed sections
  const completionPercentage = isWelcomePage
    ? 0
    : Math.round((currentSection / assessmentSections.length) * 100);

  // FIXED: Improved section navigation
  const handleSectionClick = (sectionId: number) => {
    if (onSectionChange && !isWelcomePage) {
      // Allow navigation to any completed section or current section
      // Users can only navigate to sections they've already visited
      if (sectionId <= currentSection) {
        onSectionChange(sectionId);
        if (isMobile) {
          setIsOpen(false);
        }
      }
    }
  };

  const getProgramColorClass = () => {
    if (!recommendedProgram) return "text-gray-400";

    const colorMap: Record<string, string> = {
      BSCS: "text-blue-500",
      BSIT: "text-orange-500",
      BSIS: "text-purple-500",
      teElectrical: "text-pink-500",
    };
    return colorMap[recommendedProgram] || "text-gray-400";
  };

  // Collapsed Sidebar View (Progress Bar Only) - RIGHT SIDE
  const CollapsedSidebarView = () => (
    <aside
      className={`
        fixed top-0 right-0 h-screen
        bg-gradient-to-b from-black/90 to-gray-900/95 backdrop-blur-md
        text-white shadow-2xl border-l border-white/10
        flex flex-col items-center justify-start
        p-4 z-40
        transition-all duration-500 ease-in-out
        w-20
        ${isOpen ? "translate-x-0" : "translate-x-0"}
      `}
    >
      {/* Collapse Button - TOP RIGHT Corner */}
      <button
        onClick={toggleSidebar}
        className="
          absolute top-4 right-3
          p-2 rounded-lg backdrop-blur-md border border-white/20 
          bg-gradient-to-br from-gray-800 to-gray-900 
          hover:from-gray-700 hover:to-gray-800 
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-xl hover:scale-110
          group
        "
        aria-label="Expand sidebar"
      >
        <ChevronLeft 
          size={16} 
          className="text-white transition-transform duration-300 group-hover:scale-110" 
        />
      </button>

      {/* Progress Header - Below the button */}
      <div className="flex flex-col items-center mb-6 mt-16">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
          <BarChart3 size={20} className="text-white" />
        </div>
        
        {/* Mini Progress Bar - Horizontal */}
        {!isWelcomePage && (
          <div className="w-full px-2 mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${completionPercentage}%`,
                }}
              ></div>
            </div>
            <p className="text-[10px] text-white/50 text-center mt-1">
              {currentSection}/{assessmentSections.length}
            </p>
          </div>
        )}
      </div>

      {/* Progress Sections - Vertical */}
      {!isWelcomePage && (
        <div className="flex flex-col items-center justify-center space-y-6 flex-1">
          {assessmentSections.map((section) => {
            const IconComponent = section.icon;
            const status = getSectionStatus(section.id);
            const isClickable = section.id <= currentSection;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                disabled={!isClickable}
                className={`
                  relative group flex flex-col items-center justify-center
                  p-3 rounded-xl transition-all duration-300
                  ${isClickable 
                    ? "cursor-pointer hover:bg-white/10 hover:scale-110 hover:shadow-lg" 
                    : "cursor-not-allowed opacity-50"
                  }
                  ${status === "current" ? "animate-pulse" : ""}
                `}
              >
                {/* Progress dot with glow effect */}
                <div
                  className={`
                    w-3 h-3 rounded-full mb-2 transition-all duration-300
                    ${getSectionColor(section.id)}
                    ${status === "current" ? "ring-2 ring-yellow-400 ring-opacity-50" : ""}
                    ${status === "completed" ? "ring-1 ring-green-500 ring-opacity-30" : ""}
                  `}
                />
                
                {/* Icon with better styling */}
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${status === "completed" ? "bg-green-500/20" : 
                    status === "current" ? "bg-yellow-500/20" : "bg-white/5"}
                `}>
                  <IconComponent
                    size={18}
                    className={`
                      transition-all duration-300
                      ${status === "completed" ? "text-green-400" : 
                        status === "current" ? section.colorClass : "text-gray-400"}
                    `}
                  />
                </div>
                
                {/* Enhanced Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 
                              bg-black/90 backdrop-blur-md text-white text-sm p-3 rounded-xl 
                              border border-white/20 opacity-0 group-hover:opacity-100 
                              transition-all duration-300 whitespace-nowrap z-50 pointer-events-none
                              shadow-2xl min-w-[160px]">
                  <div className="font-semibold mb-1">{section.name}</div>
                  <div className={`
                    text-xs px-2 py-1 rounded-full font-medium
                    ${status === "completed" ? "bg-green-500/20 text-green-300" : 
                      status === "current" ? "bg-yellow-500/20 text-yellow-300" : 
                      "bg-gray-500/20 text-gray-300"}
                  `}>
                    {status === "completed" ? "Completed" : 
                     status === "current" ? "In Progress" : "Upcoming"}
                  </div>
                  {status === "completed" && (
                    <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Done
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Recommended Program Mini View */}
      {recommendedProgram && (
        <div className="mt-auto mb-6 p-2 bg-white/5 rounded-lg border border-white/10">
          <p className="text-[10px] text-white/60 text-center mb-1">Recommended</p>
          <p className={`text-xs font-bold text-center ${getProgramColorClass()}`}>
            {recommendedProgram}
          </p>
        </div>
      )}
    </aside>
  );

  // Full Sidebar View - FIXED POSITIONING TO RIGHT SIDE
  const FullSidebarView = () => (
    <aside
      className={`
        fixed top-0 right-0 h-screen
        bg-gradient-to-b from-black/90 to-gray-900/95 backdrop-blur-md
        text-white shadow-2xl border-l border-white/10
        flex flex-col justify-between
        p-4 sm:p-6 z-40
        transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"}
        w-80 sm:w-72 md:w-80 lg:w-96
        overflow-y-auto
      `}
    >
      {/* Close button for mobile */}
      {isMobile && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 animate-fadeIn">
          <h2 className="text-lg font-bold">
            {isWelcomePage ? "Welcome" : "Assessment Progress"}
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Collapse Button for Desktop - TOP RIGHT */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="
            absolute top-4 right-4
            p-2 rounded-lg backdrop-blur-md border border-white/20 
            bg-gradient-to-br from-gray-800 to-gray-900 
            hover:from-gray-700 hover:to-gray-800 
            transition-all duration-300 ease-out
            shadow-lg hover:shadow-xl hover:scale-110
            group
          "
          aria-label="Collapse sidebar"
        >
          <ChevronRight 
            size={16} 
            className="text-white transition-transform duration-300 group-hover:scale-110" 
          />
        </button>
      )}

      {/* Header */}
      <div className={`${isMobile ? "mt-8" : "mt-14 sm:mt-20"} animate-fadeIn`}>
        <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2 justify-center sm:justify-start">
          <BarChart3 size={20} />
          {isWelcomePage ? "Getting Started" : "Assessment Sections"}
        </h2>
        <p className="text-sm text-white/60 mb-6 text-center sm:text-left">
          {isWelcomePage
            ? "Begin your journey to discover your ideal career path"
            : "Complete all sections to get your career recommendation"}
        </p>
      </div>

      {/* Progress Content */}
      <div className="flex-1 animate-fadeInUp">
        {/* Progress Bar - Hidden on welcome page */}
        {!isWelcomePage && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-500 hover:bg-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Overall Progress</span>
              <span className="text-white/90 font-semibold">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${completionPercentage}%`,
                }}
              ></div>
            </div>
            {/* FIXED: More accurate progress text */}
            <p className="text-xs text-white/60 mt-2">
              {currentSection} of {assessmentSections.length} sections completed
              {currentSection === assessmentSections.length && " - All done! 🎉"}
            </p>
          </div>
        )}

        {/* Recommended Program - Show if available */}
        {recommendedProgram && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-500 hover:bg-white/10 animate-fadeInUp">
            <h3 className="text-sm font-semibold text-white/70 mb-2">
              Recommended Program
            </h3>
            <p className={`text-lg font-bold ${getProgramColorClass()}`}>
              {recommendedProgram}
            </p>
            <p className="text-xs text-white/60 mt-1">
              Based on your assessment results
            </p>
          </div>
        )}

        {/* Welcome Section or Assessment Sections */}
        <div className="space-y-3 animate-fadeInUp">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
            {isWelcomePage ? "Your Journey" : "Sections"}
          </h3>

          <div className="space-y-2">
            {/* Welcome Section */}
            {isWelcomePage && (
              <div
                className={`
                  w-full text-left p-4 rounded-xl transition-all duration-300
                  border ${welcomeSection.borderColor} ${welcomeSection.bgColor}
                  hover:bg-green-500/20 hover:border-green-500/50 hover:scale-[1.02] cursor-pointer
                  animate-pulse
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0 bg-green-500 animate-pulse"></span>
                      <User
                        size={18}
                        className="flex-shrink-0 text-green-400"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-400 truncate">
                          {welcomeSection.name}
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full animate-pulse flex-shrink-0">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">
                        {welcomeSection.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-white/40 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            )}

            {/* Assessment Sections */}
            {!isWelcomePage &&
              assessmentSections.map((section, index) => {
                const IconComponent = section.icon;
                const isClickable = section.id <= currentSection;
                const status = getSectionStatus(section.id);
                const styles = getSectionStyles(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    disabled={!isClickable}
                    className={`
                    w-full text-left p-4 rounded-xl transition-all duration-300
                    border ${styles.border} ${styles.background}
                    group
                    ${
                      isClickable
                        ? "hover:scale-[1.02] cursor-pointer hover:bg-white/5 hover:shadow-lg"
                        : "cursor-not-allowed opacity-60"
                    }
                    animate-fadeInUp
                  `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                            w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300
                            ${getSectionColor(section.id)}
                            ${status === "current" ? "ring-2 ring-yellow-400 ring-opacity-50" : ""}
                          `}
                          ></span>
                          <IconComponent
                            size={18}
                            className={`flex-shrink-0 ${styles.icon} transition-all duration-300`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium truncate ${styles.text}`}
                            >
                              {section.name}
                            </span>
                            {status === "current" && (
                              <span
                                className={`px-2 py-1 text-xs ${styles.background} ${styles.text} rounded-full animate-pulse flex-shrink-0`}
                              >
                                Active
                              </span>
                            )}
                            {status === "completed" && (
                              <CheckCircle 
                                size={16} 
                                className="text-green-400 flex-shrink-0 transition-all duration-300" 
                              />
                            )}
                          </div>
                          <p className="text-xs text-white/60 mt-1 line-clamp-2">
                            {section.description}
                          </p>
                        </div>
                      </div>

                      {isClickable && (
                        <ChevronRight
                          size={16}
                          className="text-white/40 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Current Section Info */}
        {!isWelcomePage && currentSection < assessmentSections.length && (
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 transition-all duration-500 hover:bg-blue-500/15 animate-fadeInUp">
            <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1">
              📍 Current Section
            </h4>
            <p
              className={`text-sm font-medium ${assessmentSections[currentSection]?.colorClass}`}
            >
              {assessmentSections[currentSection]?.name}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {assessmentSections[currentSection]?.description}
            </p>
          </div>
        )}

        {/* Welcome Page Info */}
        {isWelcomePage && (
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 transition-all duration-500 hover:bg-blue-500/15 animate-fadeInUp">
            <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1">
              🚀 Ready to Start?
            </h4>
            <p className="text-xs text-white/80">
              Click "START ASSESSMENT" to begin your career discovery journey.
              The assessment takes about 15-20 minutes to complete.
            </p>
          </div>
        )}

        {/* Completion Message */}
        {!isWelcomePage && currentSection === assessmentSections.length && (
          <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20 transition-all duration-500 hover:bg-green-500/15 animate-fadeInUp">
            <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-1">
              🎉 All Sections Complete!
            </h4>
            <p className="text-xs text-white/80">
              Ready to submit your assessment and view your results.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 animate-fadeIn">
        <div className="text-xs text-white/50 text-center sm:text-left">
          <p>© {new Date().getFullYear()} CCDI Career Assessment</p>
          <p className="mt-1 text-white/40">
            {isWelcomePage
              ? "Your career journey begins here"
              : "Finding your perfect career path"}
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Toggle Button - Smooth appearance */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="
            fixed top-4 right-4 z-50 
            p-3 rounded-xl backdrop-blur-md border border-white/20 
            bg-gradient-to-br from-gray-800 to-gray-900 
            hover:from-gray-700 hover:to-gray-800 
            transition-all duration-500 ease-out
            shadow-lg hover:shadow-xl hover:scale-110
            animate-fadeIn
          "
          aria-label="Show assessment progress"
        >
          <BarChart3 size={20} className="text-white" />
        </button>
      )}

      {/* Overlay for mobile with smooth animation */}
      {isMobile && isOpen && (
        <div
          className="
            fixed inset-0 bg-black/50 z-30 
            transition-all duration-500 ease-in-out
            animate-fadeIn
          "
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Show collapsed view when closed on desktop, full view when open */}
      {!isOpen && !isMobile ? <CollapsedSidebarView /> : <FullSidebarView />}
    </>
  );
}

export default ProgressSideBar;