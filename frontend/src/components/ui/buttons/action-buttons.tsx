import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  saving: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, saving }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`mb-4 ${isMobile ? "d-flex flex-column gap-3 px-3" : "text-center"}`}
    >
      <button
        onClick={onSave}
        disabled={saving}
        className={`btn btn-lg fw-bold ${isMobile ? "w-100 py-3" : "px-5 py-3 me-3 m-2"}`}
        style={{
          background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
          color: "white",
          border: "3px solid #2B3176",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(164, 29, 49, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {saving ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            Saving Document...
          </>
        ) : (
          <>
            <Download size={20} className="me-2" />
            Save as Document
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
