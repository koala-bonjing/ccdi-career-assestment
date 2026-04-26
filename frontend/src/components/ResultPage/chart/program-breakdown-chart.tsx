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
  TrendingUp,
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

  // Sort categories from highest to lowest
  const categories = useMemo(() => {
    const rawCategories = [
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
        color: "#A41D31",
        icon: CheckCircle,
        reason:
          categoryExplanations?.logisticsReason ||
          defaultExplanations.logisticsReason,
      },
    ];
    return rawCategories.sort((a, b) => b.value - a.value);
  }, [academic, technical, career, logistics, categoryExplanations]);

  const getFullProgramName = (name: string) => {
    const upperName = name.toUpperCase();
    if (upperName.includes("BSIT"))
      return "Bachelor of Science in Information Technology";
    if (upperName.includes("BSCS"))
      return "Bachelor of Science in Computer Science";
    if (upperName.includes("BSIS"))
      return "Bachelor of Science in Information Systems";
    if (upperName.includes("BSET"))
      return `Bachelor of Science in Engineering Technology`;
    if (upperName.includes("ACT"))
      return `Associate in Computer Technology`;
    return name;
  };

  const fullProgramName = getFullProgramName(programName);

  const data = useMemo(
    () => ({
      labels: categories.map((c) =>
        isMobile ? c.label.split(" ")[0] : c.label
      ),
      datasets: [
        {
          label: `${programName} Fit`,
          data: categories.map((c) => c.value),
          backgroundColor: categories.map((c, i) =>
            activeCategory !== null && activeCategory !== i
              ? `${c.color}40`
              : c.color
          ),
          borderRadius: isMobile ? 4 : 8,
          borderSkipped: false,
          barPercentage: isMobile ? 0.7 : 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [categories, programName, isMobile, activeCategory]
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
            color: "#6b7280",
            stepSize: 25,
            maxTicksLimit: 5,
          },
          grid: {
            color: "rgba(43, 49, 118, 0.06)",
            drawBorder: false,
          },
          border: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#2B3176",
            font: {
              size: isMobile ? 9 : 11,
              weight: "bold",
            },
            maxRotation: 0,
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
          backgroundColor: "rgba(43, 49, 118, 0.95)",
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
    [isMobile]
  );

  return (
    <div className="mt-5">
      {/* Title Section */}
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center gap-2 mb-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
              boxShadow: "0 4px 12px rgba(43, 49, 118, 0.25)",
            }}
          >
            <TrendingUp size={22} color="white" />
          </div>
        </div>
        <h3
          className="fw-bold mb-1"
          style={{
            color: "#2B3176",
            fontSize: isMobile ? "1.2rem" : "1.4rem",
          }}
        >
          Why {fullProgramName} Fits You
        </h3>
        <div
          style={{
            width: "50px",
            height: "3px",
            background: "linear-gradient(135deg, #A41D31, #EC2326)",
            borderRadius: "2px",
            margin: "6px auto 0",
          }}
        />
        <div className="d-flex justify-content-center mt-2">
          <OverlayTrigger
            placement="auto"
            overlay={
              <ReactTooltip>
                This chart breaks down how well the recommended program matches
                your profile across key categories. Higher scores indicate a
                stronger match. Hover over each bar for detailed explanations.
              </ReactTooltip>
            }
          >
            <Info
              size={16}
              className="text-muted"
              style={{ cursor: "pointer" }}
            />
          </OverlayTrigger>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`d-flex ${isMobile ? "flex-column gap-3" : "flex-row gap-4"}`}
      >
        {/* Explanations Cards */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 45%",
            maxWidth: isMobile ? "100%" : "45%",
          }}
        >
          <div className="d-flex flex-column gap-2">
            {categories.map((cat, i) => {
              const isActive = activeCategory === i;
            
              return (
                <div
                  key={i}
                  className="rounded-4"
                  style={{
                    padding: isMobile ? "14px" : "18px 20px",
                    background: isActive
                      ? `linear-gradient(135deg, ${cat.color}10 0%, ${cat.color}05 100%)`
                      : "white",
                    border: isActive
                      ? `2px solid ${cat.color}40`
                      : "1px solid rgba(43, 49, 118, 0.08)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    transform: isActive && !isMobile ? "translateX(-6px)" : "translateX(0)",
                    boxShadow: isActive
                      ? `0 4px 16px ${cat.color}15`
                      : "none",
                  }}
                  onMouseEnter={() => !isMobile && setActiveCategory(i)}
                  onMouseLeave={() => !isMobile && setActiveCategory(null)}
                  onClick={() =>
                    isMobile && setActiveCategory(activeCategory === i ? null : i)
                  }
                >
                  <div className="d-flex align-items-start gap-3">
                    {/* Rank number */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        background:
                          i === 0
                            ? "linear-gradient(135deg, #A41D31, #EC2326)"
                            : `${cat.color}15`,
                        color: i === 0 ? "white" : cat.color,
                        fontWeight: "700",
                        fontSize: "0.8rem",
                      }}
                    >
                      {i + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          style={{
                            color: cat.color,
                            fontWeight: "700",
                            fontSize: isMobile ? "0.8rem" : "0.85rem",
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
                              fontSize: isMobile ? "1.2rem" : "1.3rem",
                            }}
                          >
                            {cat.value}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "rgba(43, 49, 118, 0.06)",
                          borderRadius: "3px",
                          overflow: "hidden",
                          marginBottom: isActive || !isMobile ? "8px" : "0",
                        }}
                      >
                        <div
                          style={{
                            width: `${cat.value}%`,
                            height: "100%",
                            background: cat.color,
                            borderRadius: "3px",
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>

                      {/* Reason text */}
                      {(!isMobile || isActive) && (
                        <p
                          style={{
                            fontSize: isMobile ? "0.78rem" : "0.82rem",
                            color: "#6b7280",
                            margin: 0,
                            lineHeight: "1.5",
                          }}
                        >
                          {cat.reason}
                        </p>
                      )}
                    </div>

                    {isMobile && !isActive && (
                      <ChevronRight size={14} className="text-muted mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        <div
          style={{
            flex: isMobile ? "none" : "1 1 auto",
            height: isMobile ? "280px" : "450px",
            minHeight: isMobile ? "250px" : "400px",
          }}
        >
          <div
            className="h-100 rounded-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(43, 49, 118, 0.02) 0%, rgba(236, 35, 38, 0.02) 100%)",
              padding: isMobile ? "16px" : "24px",
              border: "2px solid rgba(43, 49, 118, 0.1)",
            }}
          >
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="mt-3 rounded-4"
        style={{
          padding: isMobile ? "12px" : "16px",
          background: "rgba(43, 49, 118, 0.03)",
          border: "1px solid rgba(43, 49, 118, 0.06)",
        }}
      >
        <div className="row g-2">
          {categories.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <div key={i} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: `${cat.color}15`,
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={11} color={cat.color} strokeWidth={2.5} />
                  </div>
                  <small
                    style={{
                      fontSize: isMobile ? "0.65rem" : "0.7rem",
                      color: "#6b7280",
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
        <div className="text-center mt-2">
          <small
            style={{
              fontSize: "0.65rem",
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            Score Scale: 0–100 | Higher = Better Fit
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProgramBreakdownChart;