import React, { useState, useEffect } from "react";

interface RadarChartProps {
  academic: number;
  technical: number;
  career: number;
  logistics: number;
  recommendedProgram: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  academic,
  technical,
  career,
  logistics,
  recommendedProgram,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Data updated to reflect "Profiling Stats" while keeping your structure
  const data = [
    {
      label: "Academic Readiness",
      value: academic,
      description:
        "Math foundations, English comprehension, and science background.",
      icon: "📚",
    },
    {
      label: "Technical Intuition",
      value: technical,
      description:
        "Logic puzzles, troubleshooting skills, and computer literacy.",
      icon: "💻",
    },
    {
      label: "Effort & Synergy",
      value: career,
      description:
        "Study habits, motivation levels, and alignment with program goals.",
      icon: "⚡",
    },
    {
      label: "Practical Feasibility",
      value: logistics,
      description:
        "Viability based on your time, internet access, and environment.",
      icon: "🏠",
    },
  ];

  // Responsive sizing
  const size = isMobile ? 320 : 460;
  const center = size / 2;
  const maxRadius = isMobile ? 110 : 160;
  const labelRadius = maxRadius + (isMobile ? 35 : 45);

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
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);

    // Better positioning for mobile
    let textAnchor: "start" | "middle" | "end" = "middle";
    let dy = 0;

    if (isMobile) {
      if (Math.abs(Math.cos(angle)) > 0.7) textAnchor = "middle";
      else if (Math.cos(angle) > 0) textAnchor = "start";
      else textAnchor = "end";
      dy = Math.sin(angle) > 0 ? 12 : -5;
    } else {
      if (Math.cos(angle) > 0.1) textAnchor = "start";
      if (Math.cos(angle) < -0.1) textAnchor = "end";
    }

    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        style={{
          fontSize: isMobile ? "11px" : "13px",
          fill: activeIndex === i ? "#2B3176" : "#555",
          fontWeight: activeIndex === i ? "700" : "600",
          letterSpacing: "0.3px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => !isMobile && setActiveIndex(i)}
        onMouseLeave={() => !isMobile && setActiveIndex(null)}
      >
        {isMobile ? (
          // Mobile: Show icon and first word
          <>
            <tspan x={x} dy={dy}>
              {item.icon}
            </tspan>
            <tspan x={x} dy={16}>
              {item.label.split(" ")[0]}
            </tspan>
          </>
        ) : (
          // Desktop: Show full label
          item.label.split(" ").map((word, idx) => (
            <tspan key={idx} x={x} dy={idx === 0 ? 0 : 14}>
              {word}
            </tspan>
          ))
        )}
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
      className="w-100 p-3 p-md-4"
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Chart Header */}
      <div className="text-center mb-4">
        <h4
          className="fw-bold mb-2"
          style={{
            color: "#2B3176",
            fontSize: isMobile ? "1.3rem" : "1.75rem",
          }}
        >
          STUDENT PROFILING STATS
        </h4>
        <p
          className="text-muted mb-0 px-2"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Analysis for{" "}
          <strong style={{ color: "#2B3176" }}>{recommendedProgram}</strong>{" "}
          based on your readiness assessment.
        </p>
      </div>

      <div
        className={`
        ${isMobile ? "flex-column" : "flex-lg-row"} 
        d-flex align-items-center justify-content-between gap-4 gap-lg-5
      `}
      >
        {/* Radar Chart SVG Area */}
        <div
          className={isMobile ? "order-2" : "order-1"}
          style={{
            flex: isMobile ? "1 0 100%" : "1 1 50%",
            minHeight: isMobile ? "350px" : "500px",
            position: "relative",
            filter: "drop-shadow(0 8px 24px rgba(43, 49, 118, 0.12))",
          }}
        >
          <svg
            viewBox={`0 0 ${size} ${size}`}
            width="95%"
            height="100%"
            style={{ display: "block", overflow: "visible" }}
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
              strokeWidth={isMobile ? "2" : "3"}
              filter="url(#glow)"
              opacity={activeIndex !== null ? 0.9 : 1}
            />
            {data.map((item, i) => {
              const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
              const radius = (item.value / 100) * maxRadius;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              const isActive = activeIndex === i;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isMobile ? "8" : "10"}
                    fill={isActive ? "#2B3176" : "#EC2326"}
                    stroke="#fff"
                    strokeWidth={isMobile ? "2" : "3"}
                    filter="url(#glow)"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={() => !isMobile && setActiveIndex(i)}
                    onMouseLeave={() => !isMobile && setActiveIndex(null)}
                  />
                  {isActive && (
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fill="#2B3176"
                      fontWeight="bold"
                      fontSize={isMobile ? "12" : "14"}
                    >
                      {item.value}%
                    </text>
                  )}
                </g>
              );
            })}
            {labels}
          </svg>
        </div>

        {/* Stats Panel */}
        <div
          className={isMobile ? "order-1 w-100 mb-4" : "order-2"}
          style={{
            flex: isMobile ? "0 0 auto" : "1 1 45%",
            minWidth: isMobile ? "100%" : "auto",
          }}
        >
          {/* Info Box */}
          <div
            style={{
              background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
              color: "white",
              borderRadius: isMobile ? "10px" : "12px",
              padding: isMobile ? "14px" : "16px",
              marginBottom: "12px",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <svg
                width={isMobile ? "18" : "20"}
                height={isMobile ? "18" : "20"}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <small
                className="fw-bold"
                style={{ fontSize: isMobile ? "0.75rem" : "1.25rem" }}
              >
                COMPATIBILITY BREAKDOWN
              </small>
            </div>
            <p
              className="mb-0"
              style={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
            >
              Based on your{" "}
              <strong style={{ fontSize: "1.25rem" }}>
                {recommendedProgram}
              </strong>{" "}
              profiling results.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="d-flex flex-column gap-3">
            {data.map((item, i) => (
              <div
                key={i}
                className={`
                  ${activeIndex === i ? "active-stat" : ""}
                  p-${isMobile ? "3" : "4"} 
                  rounded-${isMobile ? "3" : "4"}
                  border-2
                `}
                style={{
                  background:
                    activeIndex === i
                      ? "linear-gradient(135deg, rgba(43, 49, 118, 0.1) 0%, rgba(236, 35, 38, 0.05) 100%)"
                      : "linear-gradient(135deg, rgba(43, 49, 118, 0.05) 0%, rgba(236, 35, 38, 0.03) 100%)",
                  border:
                    activeIndex === i
                      ? "2px solid #2B3176"
                      : "2px solid rgba(43, 49, 118, 0.1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => !isMobile && setActiveIndex(i)}
                onMouseLeave={() => !isMobile && setActiveIndex(null)}
                onClick={() =>
                  isMobile && setActiveIndex(activeIndex === i ? null : i)
                }
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: isMobile ? "1rem" : "1.2rem" }}>
                      {item.icon}
                    </span>
                    <span
                      style={{
                        color: "#2B3176",
                        fontWeight: "700",
                        fontSize: isMobile ? "0.75rem" : "1.2rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {isMobile ? item.label.split(" ")[0] : item.label}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span
                      style={{
                        fontWeight: "900",
                        color: "#EC2326",
                        fontSize: isMobile ? "1.5rem" : "1.75rem",
                        fontFamily: "monospace",
                        textShadow: "0 2px 4px rgba(236, 35, 38, 0.2)",
                      }}
                    >
                      {item.value}
                    </span>
                    <small className="text-muted">/100</small>
                  </div>
                </div>

                {/* Description - Hidden on mobile unless active */}
                {(!isMobile || activeIndex === i) && (
                  <>
                    <p
                      className="small text-muted mb-3"
                      style={{ fontSize: isMobile ? "0.8rem" : "0.85rem" }}
                    >
                      {item.description}
                    </p>
                    <div
                      style={{
                        width: "100%",
                        height: isMobile ? "6px" : "8px",
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
                            activeIndex === i
                              ? "linear-gradient(90deg, #2B3176 0%, #EC2326 100%)"
                              : "linear-gradient(90deg, #2B3176 0%, #EC2326 80%)",
                          borderRadius: "8px",
                          transition: "width 0.8s ease, background 0.3s ease",
                          boxShadow:
                            activeIndex === i
                              ? "0 0 10px rgba(236, 35, 38, 0.5)"
                              : "none",
                        }}
                      ></div>
                    </div>
                  </>
                )}

                {/* Mobile only: Show simplified view when not active */}
                {isMobile && activeIndex !== i && (
                  <div className="mt-2">
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "rgba(43, 49, 118, 0.1)",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.value}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #2B3176 0%, #EC2326 80%)",
                          borderRadius: "8px",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1 small text-muted">
                      <span>Tap for details</span>
                      <span>{item.value}%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Legend */}
            <div
              style={{
                textAlign: "center",
                marginTop: "12px",
                padding: isMobile ? "12px" : "16px",
                background: "rgba(43, 49, 118, 0.05)",
                borderRadius: isMobile ? "10px" : "12px",
                border: "1px dashed rgba(43, 49, 118, 0.2)",
              }}
            >
              <div
                className={`d-flex ${isMobile ? "flex-column gap-2" : "justify-content-center gap-4"} mb-2`}
              >
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <div
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
                      background: "#2B3176",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <small className="text-muted">High Fit</small>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <div
                    style={{
                      width: isMobile ? "10px" : "12px",
                      height: isMobile ? "10px" : "12px",
                      background: "#EC2326",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <small className="text-muted">Potential Fit</small>
                </div>
              </div>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                Tap/Mouse over for details
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
