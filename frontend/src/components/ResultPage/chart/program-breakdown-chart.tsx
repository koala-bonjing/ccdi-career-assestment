import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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
        icon: "📚",
        reason:
          categoryExplanations?.academicReason ||
          defaultExplanations.academicReason,
      },
      {
        label: "Technical Match",
        value: technical,
        color: "#EC2326",
        icon: "⚙️",
        reason:
          categoryExplanations?.technicalReason ||
          defaultExplanations.technicalReason,
      },
      {
        label: "Career Alignment",
        value: career,
        color: "#1C6CB3",
        icon: "🎯",
        reason:
          categoryExplanations?.careerReason ||
          defaultExplanations.careerReason,
      },
      {
        label: "Logistics Feasibility",
        value: logistics,
        color: "#28a745",
        icon: "✓",
        reason:
          categoryExplanations?.logisticsReason ||
          defaultExplanations.logisticsReason,
      },
    ],
    [academic, technical, career, logistics, categoryExplanations],
  );

  const data = useMemo(
    () => ({
      labels: categories.map((c) =>
        isMobile ? c.label.split(" ")[0] : c.label,
      ),
      datasets: [
        {
          label: `${programName} Fit`,
          data: categories.map((c) => c.value),
          backgroundColor: categories.map((c) =>
            activeCategory !== null && activeCategory !== categories.indexOf(c)
              ? `${c.color}40`
              : c.color,
          ),
          borderRadius: isMobile ? 4 : 8,
          borderSkipped: false,
          barPercentage: isMobile ? 0.6 : 0.8,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [categories, programName, isMobile, activeCategory],
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 400,
        easing: "easeOutQuart" as const, // Type-safe easing
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
            font: {
              size: isMobile ? 9 : 12,
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
              size: isMobile ? 10 : 13,
              weight: "bold",
            },
            maxRotation: 0,
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
          padding: isMobile ? 6 : 12,
          titleFont: {
            size: isMobile ? 11 : 13,
            weight: "bold",
          },
          bodyFont: { size: isMobile ? 10 : 12 },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y}% fit score`,
          },
        },
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
    }),
    [isMobile],
  );

  return (
    <div className={`p-3 p-lg-4 ${isMobile ? "mx-1" : "mx-lg-4"}`}>
      {/* Title Section */}
      <div className="text-center mb-4 mb-lg-5">
        <h3
          className={`fw-bold ${isMobile ? "h5 mb-2" : "h3 mb-3"}`}
          style={{
            color: "#2B3176",
            textTransform: "uppercase",
            letterSpacing: isMobile ? "0.3px" : "1px",
          }}
        >
          Why {programName} Fits You
        </h3>
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
                      style={{
                        fontSize: isMobile ? "1.3rem" : "1.75rem",
                        lineHeight: "1",
                        marginTop: "2px",
                      }}
                    >
                      {cat.icon}
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
                          {isMobile ? cat.label.split(" ")[0] : cat.label}
                        </span>
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

        {/* Chart Container - ORIGINAL DESKTOP SIZE, smaller mobile */}
        <div
          className={isMobile ? "order-1 w-100" : "order-2"}
          style={{
            flex: isMobile ? "none" : "1 1 auto",
            height: isMobile ? "280px" : "480px", // Original desktop height: 480px
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

      {/* Legend - HIDDEN ON MOBILE */}
      {!isMobile && (
        <div
          className="text-center mt-4"
          style={{
            padding: "16px",
            background: "rgba(43, 49, 118, 0.05)",
            borderRadius: "12px",
          }}
        >
          <small
            style={{
              fontSize: "0.75rem",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: "600",
            }}
          >
            Score Scale: 0 - 100 | Higher scores indicate better fit
          </small>
        </div>
      )}
    </div>
  );
};

export default ProgramBreakdownChart;
