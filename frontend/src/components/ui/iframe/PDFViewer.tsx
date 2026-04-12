import React, { useEffect, useRef, useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Download } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  onLoad?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onLoad }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      setLoading(false);
      return;
    }

    console.log("📄 PDFViewer received URL:", pdfUrl);

    // Reset states when URL changes
    setLoading(true);
    setError(null);

    // Set iframe source
    if (iframeRef.current) {
      iframeRef.current.src = pdfUrl;
      console.log("✅ Iframe src set to:", pdfUrl);
    }

    // Set timeout to handle loading
    const timeout = setTimeout(() => {
      setLoading(false);
      onLoad?.();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pdfUrl, onLoad]);

  const handleIframeLoad = () => {
    console.log("✅ Iframe loaded successfully");
    setLoading(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    console.error("❌ Iframe failed to load PDF");
    setError("Failed to load PDF preview");
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    link.click();
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-2 mt-2">Loading PDF...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5" style={{ color: "#dc3545" }}>
        <p>{error}</p>
        <Button variant="primary" onClick={handleDownload} className="mt-3">
          <Download size={18} className="me-2" />
          Download PDF Instead
        </Button>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      onLoad={handleIframeLoad}
      onError={handleIframeError}
      style={{ width: "100%", height: "70vh", border: "none" }}
      title="PDF Viewer"
    />
  );
};

export default PDFViewer;
