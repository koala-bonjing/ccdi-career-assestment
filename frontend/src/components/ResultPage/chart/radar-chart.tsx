// src/pages/ResultsPage/charts/RadarChart.tsx
import React from "react";

interface RadarChartProps {
  academic: number;
  technical: number;
  career: number;
  logistics: number;
}

const RadarChart: React.FC<RadarChartProps> = ({
  academic,
  technical,
  career,
  logistics,
}) => {
  const data = [
    {
      label: "Academic Aptitude",
      value: academic,
      description: "Your academic strengths & learning preferences",
    },
    {
      label: "Technical Skills",
      value: technical,
      description: "Your hands-on technical abilities & interests",
    },
    {
      label: "Career Interest",
      value: career,
      description: "Alignment with professional goals & industries",
    },
    {
      label: "Logistics & Resources",
      value: logistics,
      description: "Your practical readiness & resource availability",
    },
  ];

  const size = 460;
  const center = size / 2;
  const maxRadius = 160;

  const gridCircles = [25, 50, 75, 100].map((percent) => (
    <circle
      key={percent}
      cx={center}
      cy={center}
      r={(percent / 100) * maxRadius}
      fill="none"
      stroke="#e0e0e0"
      strokeWidth="1"
    />
  ));

  const axisLines = data.map((_, i) => {
    const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return (
      <line
        key={i}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="#d0d0d0"
        strokeWidth="1"
      />
    );
  });

  const labels = data.map((item, i) => {
    const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
    const radius = maxRadius + 45;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    let textAnchor: "start" | "middle" | "end" = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    if (Math.cos(angle) < -0.1) textAnchor = "end";
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        style={{
          fontSize: "13px",
          fill: "#555",
          fontWeight: "600",
          letterSpacing: "0.3px",
        }}
      >
        {item.label.split(" ").map((word, idx) => (
          <tspan key={idx} x={x} dy={idx === 0 ? 0 : 14}>
            {word}
          </tspan>
        ))}
      </text>
    );
  });

  const points = data
    .map((item, i) => {
      const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
      const radius = (item.value / 100) * maxRadius;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className="my-5 w-100"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
    >
      {/* Chart Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-2" style={{ color: "#2B3176" }}>
          Your Learning & Career Profile
        </h4>
        <p
          className="text-muted"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          This radar chart shows your strengths across four key dimensions that
          influence program success
        </p>
      </div>

      <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-5">
        {/* Radar Chart */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "500px",
            position: "relative",
            filter: "drop-shadow(0 8px 24px rgba(43, 49, 118, 0.12))",
          }}
        >
          <svg
            viewBox={`0 0 ${size} ${size}`}
            width="100%"
            height="100%"
            style={{ display: "block" }}
            overflow="visible"
          >
            <defs>
              <linearGradient
                id="radarGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(43, 49, 118, 0.25)" />
                <stop offset="100%" stopColor="rgba(236, 35, 38, 0.15)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {gridCircles}
            {axisLines}
            <polygon
              points={points}
              fill="url(#radarGradient)"
              stroke="#2B3176"
              strokeWidth="3"
              filter="url(#glow)"
            />
            {data.map((item, i) => {
              const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
              const radius = (item.value / 100) * maxRadius;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="#EC2326"
                    stroke="#fff"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                </g>
              );
            })}
            {labels}
          </svg>
        </div>

        {/* Stats Panel */}
        <div
          className="d-flex flex-column gap-3"
          style={{
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {/* Info Box */}
          <div
            style={{
              background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "8px",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <small className="fw-bold">HOW TO READ THIS CHART</small>
            </div>
            <p className="mb-0 small">
              Larger areas show your stronger dimensions. A balanced profile
              indicates readiness across all success factors.
            </p>
          </div>

          {data.map((item, i) => (
            <div
              key={i}
              style={{
                background:
                  "linear-gradient(135deg, rgba(43, 49, 118, 0.05) 0%, rgba(236, 35, 38, 0.05) 100%)",
                borderRadius: "16px",
                padding: "20px 24px",
                border: "2px solid rgba(43, 49, 118, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(8px)";
                e.currentTarget.style.borderColor = "#2B3176";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(43, 49, 118, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.borderColor = "rgba(43, 49, 118, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  style={{
                    color: "#2B3176",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {item.label}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      fontWeight: "900",
                      color: "#EC2326",
                      fontSize: "1.75rem",
                      fontFamily: "monospace",
                      textShadow: "0 2px 4px rgba(236, 35, 38, 0.2)",
                    }}
                  >
                    {item.value}
                  </span>
                  <small className="text-muted">/100</small>
                </div>
              </div>
              <p
                className="small text-muted mb-3"
                style={{ fontSize: "0.8rem" }}
              >
                {item.description}
              </p>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(43, 49, 118, 0.1)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${item.value}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #2B3176 0%, #EC2326 100%)",
                    borderRadius: "8px",
                    transition: "width 0.8s ease",
                    boxShadow: "0 0 10px rgba(236, 35, 38, 0.5)",
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">Score</small>
                <small
                  className={`fw-bold ${item.value >= 70 ? "text-success" : item.value >= 40 ? "text-warning" : "text-danger"}`}
                >
                  {item.value >= 70
                    ? "Strong"
                    : item.value >= 40
                      ? "Moderate"
                      : "Developing"}
                </small>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              padding: "16px",
              background: "rgba(43, 49, 118, 0.05)",
              borderRadius: "12px",
              border: "1px dashed rgba(43, 49, 118, 0.2)",
            }}
          >
            <div className="d-flex justify-content-center gap-4 mb-2">
              <div className="d-flex align-items-center gap-1">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#2B3176",
                    borderRadius: "50%",
                  }}
                ></div>
                <small className="text-muted">Strong</small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#EC2326",
                    borderRadius: "50%",
                  }}
                ></div>
                <small className="text-muted">Developing</small>
              </div>
            </div>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Aim for balanced development across all dimensions
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
