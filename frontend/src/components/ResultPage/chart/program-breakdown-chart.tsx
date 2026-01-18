import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ProgramBreakdownChart.css";

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

  const categories = [
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
        categoryExplanations?.careerReason || defaultExplanations.careerReason,
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
  ];

  const data = {
    labels: categories.map((c) => c.label),
    datasets: [
      {
        label: `${programName} Fit`,
        data: categories.map((c) => c.value),
        backgroundColor: categories.map((c) => c.color),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (value: any) => `${value}%`,
          font: { size: 11, weight: "bold" as const },
          color: "#666",
        },
        grid: { color: "rgba(43, 49, 118, 0.08)" },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#333",
          font: { size: 11, weight: "bold" as const },
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="my-4 my-lg-5 program-breakdown-container">
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h3
          className="program-breakdown-title"
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            color: "#2B3176",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Why {programName} Fits You
        </h3>
        <div
          className="program-breakdown-title-line"
          style={{
            height: "4px",
            width: "80px",
            background: "linear-gradient(90deg, #2B3176 0%, #EC2326 100%)",
            margin: "0 auto",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      <div className="program-breakdown-content">
        {/* Explanations - Left Side on desktop, Top on mobile */}
        <div
          className="program-breakdown-explanations"
          style={{
            width: "100%",
          }}
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className="program-breakdown-category-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(43, 49, 118, 0.04) 0%, rgba(236, 35, 38, 0.04) 100%)",
                borderRadius: "16px",
                padding: "20px 24px",
                border: "2px solid rgba(43, 49, 118, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-8px)";
                e.currentTarget.style.borderColor = cat.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.borderColor = "rgba(43, 49, 118, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="d-flex align-items-start gap-3"
                style={{ flex: 1 }}
              >
                <div
                  className="program-breakdown-category-icon"
                  style={{
                    fontSize: "1.75rem",
                    lineHeight: "1",
                    marginTop: "2px",
                  }}
                >
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="program-breakdown-category-label"
                      style={{
                        color: cat.color,
                        fontWeight: "700",
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      className="program-breakdown-category-value"
                      style={{
                        fontWeight: "900",
                        color: cat.color,
                        fontSize: "1.5rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {cat.value}
                    </span>
                  </div>
                  <p
                    className="program-breakdown-category-reason"
                    style={{
                      fontSize: "0.875rem",
                      color: "#555",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {cat.reason}
                  </p>
                  <div
                    className="program-breakdown-progress-bar"
                    style={{
                      width: "100%",
                      height: "6px",
                      background: "rgba(43, 49, 118, 0.08)",
                      borderRadius: "6px",
                      overflow: "hidden",
                      marginTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.value}%`,
                        height: "100%",
                        background: cat.color,
                        borderRadius: "6px",
                        transition: "width 0.8s ease",
                        boxShadow: `0 0 10px ${cat.color}60`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart - Right Side on desktop, Bottom on mobile */}
        <div
          className="program-breakdown-chart-container"
          style={{
            width: "100%",
            maxWidth: "550px",
            height: "480px",
            background:
              "linear-gradient(135deg, rgba(43, 49, 118, 0.03) 0%, rgba(236, 35, 38, 0.03) 100%)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid rgba(43, 49, 118, 0.1)",
            boxShadow: "0 8px 32px rgba(43, 49, 118, 0.08)",
          }}
        >
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* Score Legend */}
      <div
        className="program-breakdown-legend"
        style={{
          textAlign: "center",
          marginTop: "32px",
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
    </div>
  );
};

export default ProgramBreakdownChart;
