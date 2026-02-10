import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  type ChartOptions,
} from "chart.js";
import {
  BookOpen,
  Cpu,
  Target,
  CheckCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { OverlayTrigger, Tooltip as ReactTooltip } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

interface CategoryExplanations {
  academicReason?: string;
  technicalReason?: string;
  careerReason?: string;
  logisticsReason?: string;
}

interface ProgramBreakdownChartProps {
  academic: number;
  technical: number;
  career: number;
  logistics: number;
  programName: string;
  categoryExplanations?: CategoryExplanations;
}

const ProgramBreakdownChart: React.FC<ProgramBreakdownChartProps> = ({
  academic,
  technical,
  career,
  logistics,
  programName,
  categoryExplanations,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const defaultExplanations = {
    academicReason:
      "Your learning style and academic strengths align perfectly with the curriculum requirements.",
    technicalReason:
      "Your technical skills and interests match the core competencies of this program.",
    careerReason:
      "This program opens career paths that align with your interests and professional goals.",
    logisticsReason:
      "The program is accessible and feasible based on your current situation and resources.",
  };

  const categories = useMemo(
    () => [
      {
        label: "Academic Fitness",
        value: academic,
        color: "#2B3176",
        icon: BookOpen,
        reason:
          categoryExplanations?.academicReason ||
          defaultExplanations.academicReason,
      },
      {
        label: "Technical Match",
        value: technical,
        color: "#EC2326",
        icon: Cpu,
        reason:
          categoryExplanations?.technicalReason ||
          defaultExplanations.technicalReason,
      },
      {
        label: "Career Alignment",
        value: career,
        color: "#1C6CB3",
        icon: Target,
        reason:
          categoryExplanations?.careerReason ||
          defaultExplanations.careerReason,
      },
      {
        label: "Logistics Feasibility",
        value: logistics,
        color: "#28a745",
        icon: CheckCircle,
        reason:
          categoryExplanations?.logisticsReason ||
          defaultExplanations.logisticsReason,
      },
    ],
    [academic, technical, career, logistics, categoryExplanations],
  );

  // Get full program name
  const getFullProgramName = (name: string) => {
    const upperName = name.toUpperCase();
    if (upperName.includes("BSIT"))
      return "Bachelor of Science in Information Technology";
    if (upperName.includes("BSCS"))
      return "Bachelor of Science in Computer Science";
    return name;
  };

  const fullProgramName = getFullProgramName(programName);

  const data = useMemo(
    () => ({
      labels: isMobile
        ? ["Academic", "Technical", "Career", "Logistics"]
        : [
            "Academic Fitness",
            "Technical Match",
            "Career Alignment",
            "Logistics Feasibility",
          ],
      datasets: [
        {
          label: `${programName} Fit`,
          data: [academic, technical, career, logistics],
          backgroundColor: [
            activeCategory !== null && activeCategory !== 0
              ? "#2B317640"
              : "#2B3176",
            activeCategory !== null && activeCategory !== 1
              ? "#EC232640"
              : "#EC2326",
            activeCategory !== null && activeCategory !== 2
              ? "#1C6CB340"
              : "#1C6CB3",
            activeCategory !== null && activeCategory !== 3
              ? "#28a74540"
              : "#28a745",
          ],
          borderRadius: isMobile ? 4 : 8,
          borderSkipped: false,
          barPercentage: isMobile ? 0.7 : 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [
      academic,
      technical,
      career,
      logistics,
      programName,
      isMobile,
      activeCategory,
    ],
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
        easing: "easeOutQuart" as const,
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
            font: {
              size: isMobile ? 10 : 12,
              weight: "bold",
            },
            color: "#666",
            stepSize: 25,
            maxTicksLimit: 5,
          },
          grid: {
            color: "rgba(43, 49, 118, 0.08)",
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#333",
            font: {
              size: isMobile ? 6 : 8,
              weight: "bold",
            },
            maxRotation: isMobile ? 0 : 0,
            minRotation: 0,
            autoSkip: false,
          },
          border: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          enabled: !isMobile,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 13,
            weight: "bold",
          },
          bodyFont: { size: 12 },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y}% Fit score`,
          },
        },
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      onHover: (event, activeElements) => {
        if (!isMobile && activeElements.length > 0) {
          setActiveCategory(activeElements[0].index);
        } else if (!isMobile) {
          setActiveCategory(null);
        }
      },
    }),
    [isMobile],
  );

  return (
    <div className={`p-3 p-lg-4 ${isMobile ? "mx-1" : "mx-lg-4"}`}>
      {/* Title Section */}
      <div className="text-center mb-4 mb-lg-5">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <h3
            className={`fw-bold mb-0 ${isMobile ? "h5" : "h3"}`}
            style={{
              color: "#2B3176",
              letterSpacing: isMobile ? "0.3px" : "1px",
            }}
          >
            Why {fullProgramName} Fits You
          </h3>
          <OverlayTrigger
            placement="auto"
            overlay={
              <ReactTooltip>
                This chart breaks down how well the recommended program matches
                your profile across key categories. Each bar represents a
                different aspect of fit, with higher scores indicating a
                stronger match. Hover over each bar for detailed explanations of
                your strengths and areas for growth in relation to the program.
              </ReactTooltip>
            }
          >
            <Info
              size={isMobile ? 18 : 24}
              className="text-muted"
              style={{ cursor: "pointer" }}
            />
          </OverlayTrigger>
        </div>
        <div
          style={{
            height: isMobile ? "3px" : "4px",
            width: isMobile ? "60px" : "80px",
            background: "linear-gradient(90deg, #2B3176 0%, #EC2326 100%)",
            margin: "0 auto",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div
        className={`
        ${isMobile ? "flex-column gap-3" : "flex-lg-row gap-5"} 
        d-flex align-items-stretch
      `}
      >
        {/* Explanations Cards */}
        <div
          className={isMobile ? "order-2 w-100" : "order-1"}
          style={{
            flex: isMobile ? "none" : "0 0 45%",
            maxWidth: isMobile ? "100%" : "45%",
          }}
        >
          <div className="d-flex flex-column gap-3">
            {categories.map((cat, i) => {
              const isActive = activeCategory === i;
              const IconComponent = cat.icon;

              return (
                <div
                  key={i}
                  className={`${isMobile ? "p-3" : "p-4"} rounded-${isMobile ? "3" : "4"} border-2`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${cat.color}15 0%, ${cat.color}08 100%)`
                      : "linear-gradient(135deg, rgba(43, 49, 118, 0.04) 0%, rgba(236, 35, 38, 0.04) 100%)",
                    border: isActive
                      ? `2px solid ${cat.color}`
                      : "2px solid rgba(43, 49, 118, 0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    transform:
                      isActive && !isMobile
                        ? "translateX(-8px)"
                        : "translateX(0)",
                    boxShadow:
                      isActive && !isMobile
                        ? `0 8px 24px ${cat.color}30`
                        : "none",
                  }}
                  onMouseEnter={() => !isMobile && setActiveCategory(i)}
                  onMouseLeave={() => !isMobile && setActiveCategory(null)}
                  onClick={() =>
                    isMobile &&
                    setActiveCategory(activeCategory === i ? null : i)
                  }
                >
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle p-2"
                      style={{
                        width: isMobile ? "36px" : "48px",
                        height: isMobile ? "36px" : "48px",
                        backgroundColor: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent
                        size={isMobile ? 20 : 24}
                        color={cat.color}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span
                          style={{
                            color: cat.color,
                            fontWeight: "700",
                            fontSize: isMobile ? "0.8rem" : "0.9rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {cat.label}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              fontWeight: "900",
                              color: cat.color,
                              fontSize: isMobile ? "1.3rem" : "1.5rem",
                              fontFamily: "monospace",
                            }}
                          >
                            {cat.value}
                          </span>
                          {isMobile && !isActive && (
                            <ChevronRight size={16} className="text-muted" />
                          )}
                        </div>
                      </div>

                      {/* Reason text - hidden on mobile unless active */}
                      {(!isMobile || isActive) && (
                        <>
                          <p
                            style={{
                              fontSize: isMobile ? "0.8rem" : "0.875rem",
                              color: "#555",
                              margin: 0,
                              lineHeight: "1.5",
                              marginBottom: "12px",
                            }}
                          >
                            {cat.reason}
                          </p>
                          <div
                            style={{
                              width: "100%",
                              height: isMobile ? "5px" : "6px",
                              background: "rgba(43, 49, 118, 0.08)",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${cat.value}%`,
                                height: "100%",
                                background: cat.color,
                                borderRadius: "6px",
                                transition: "width 0.8s ease",
                                boxShadow: isActive
                                  ? `0 0 10px ${cat.color}60`
                                  : "none",
                              }}
                            ></div>
                          </div>
                        </>
                      )}

                      {/* Mobile collapsed view */}
                      {isMobile && !isActive && (
                        <div className="mt-2">
                          <div
                            style={{
                              width: "100%",
                              height: "5px",
                              background: "rgba(43, 49, 118, 0.08)",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${cat.value}%`,
                                height: "100%",
                                background: cat.color,
                                borderRadius: "6px",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between mt-1 small text-muted">
                            <span>Tap for details</span>
                            <span>{cat.value}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Container */}
        <div
          className={isMobile ? "order-1 w-100" : "order-2"}
          style={{
            flex: isMobile ? "none" : "1 1 auto",
            height: isMobile ? "280px" : "480px",
            minHeight: isMobile ? "250px" : "450px",
          }}
        >
          <div
            className="h-100 rounded-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(43, 49, 118, 0.03) 0%, rgba(236, 35, 38, 0.03) 100%)",
              padding: isMobile ? "16px" : "30px",
              border: "2px solid rgba(43, 49, 118, 0.1)",
              boxShadow: "0 8px 32px rgba(43, 49, 118, 0.08)",
            }}
          >
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>

      {/* Legend - NOW SHOWN ON BOTH MOBILE AND DESKTOP */}
      <div
        className="mt-4"
        style={{
          padding: isMobile ? "12px" : "16px",
          background: "rgba(43, 49, 118, 0.05)",
          borderRadius: "12px",
        }}
      >
        <div className="row g-2">
          {categories.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <div key={i} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle p-1"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: `${cat.color}15`,
                      border: `1px solid ${cat.color}30`,
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent
                      size={12}
                      color={cat.color}
                      strokeWidth={2.5}
                    />
                  </div>
                  <small
                    style={{
                      fontSize: isMobile ? "0.7rem" : "0.75rem",
                      color: "#666",
                      fontWeight: "600",
                      lineHeight: "1.2",
                    }}
                  >
                    {cat.label}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-3">
          <small
            style={{
              fontSize: isMobile ? "0.65rem" : "0.7rem",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            Score Scale: 0 - 100 | Higher scores indicate better fit
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProgramBreakdownChart;
