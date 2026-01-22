// src/pages/ResultsPage/components/CompatibilityLegend.tsx
import React, { useEffect, useState } from "react";

const CompatibilityLegend: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`rounded ${isMobile ? "mt-3 p-2" : "mt-4 p-3"}`}
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
        border: "1.5px solid #2B3176",
        fontSize: "0.875rem",
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <h6
          className="fw-bold mb-2"
          style={{ color: "#2B3176", fontSize: "0.9rem" }}
        >
          Compatibility Guide
        </h6>

        {/* Compact Disclaimer Box */}
        <div
          className="w-100 py-1 px-2 mb-2 text-center rounded"
          style={{
            fontSize: "0.7rem",
            backgroundColor: "rgba(13, 110, 253, 0.08)",
            border: "1px dashed #0d6efd",
            lineHeight: "1.3",
          }}
        >
          <strong>📊 Note:</strong> Scores represent independent confidence levels and <strong>do not sum to 100%</strong>.
        </div>
      </div>

      {/* Grid: 2x2 on Mobile (col-6), 1x4 on Desktop (col-md-3) */}
      <div className="row text-center g-2">
        <div className="col-6 col-md-3">
          <div
            className="fw-bold"
            style={{ color: "#08CB00", fontSize: "0.85rem" }}
          >
            80-100%
          </div>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            Excellent Match
          </small>
        </div>
        <div className="col-6 col-md-3">
          <div className="fw-bold text-primary" style={{ fontSize: "0.85rem" }}>
            60-79%
          </div>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            Strong Fit
          </small>
        </div>
        <div className="col-6 col-md-3">
          <div className="fw-bold text-danger" style={{ fontSize: "0.85rem" }}>
            40-59%
          </div>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            Moderate Fit
          </small>
        </div>
        <div className="col-6 col-md-3">
          <div
            className="fw-bold text-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            0-39%
          </div>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            Limited Fit
          </small>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityLegend;