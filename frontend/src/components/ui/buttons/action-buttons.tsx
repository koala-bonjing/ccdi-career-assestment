// src/pages/ResultsPage/components/ActionButtons.tsx
import React from "react";
import { Download, FileText } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  saving: boolean;
  onPrint: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  saving,
  onPrint,
}) => {
  return (
    <div className="text-center mb-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="btn btn-lg px-5 py-3 fw-bold me-3 m-2"
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

      <button
        onClick={onPrint}
        className="btn btn-lg px-5 py-3 fw-bold"
        style={{
          background: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
          color: "white",
          border: "3px solid #981024ff",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 8px 25px rgba(28, 108, 179, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <FileText size={20} className="me-2" />
        Print Results
      </button>
    </div>
  );
};

export default ActionButtons;
