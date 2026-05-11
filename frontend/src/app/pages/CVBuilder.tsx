import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router";
import { useCV, CVData } from "../context/CVContext";
import Header from "../components/Header";
import CVForm from "../components/CVForm";
import CVPreview from "../components/CVPreview";
import AIAssistant from "../components/AIAssistant";
import { useIsMobile } from "../components/ui/use-mobile";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Monitor,
  LayoutTemplate,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from "../utils/pdfExport";

export default function CVBuilder() {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const { cvs, currentCV, setCurrentCV, saveCV } = useCV();

  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);

  const [cvData, setCVData] = useState<CVData | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [cvName, setCVName] = useState("");

  const exportPreviewRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cvId) {
      const existing = cvs.find((cv) => cv.id === cvId);

      if (existing) {
        setCVData(existing);
        setCVName(existing.name);
        setCurrentCV(existing);
      } else if (currentCV && currentCV.id === cvId) {
        setCVData(currentCV);
        setCVName(currentCV.name);
      } else {
        navigate("/dashboard");
      }
    } else if (currentCV) {
      setCVData(currentCV);
      setCVName(currentCV.name);
    } else {
      toast.error("No CV selected");
      navigate("/templates");
    }
  }, [cvId, cvs, currentCV, setCurrentCV, navigate]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleCVChange = useCallback((updatedCV: CVData) => {
    setCVData(updatedCV);
  }, []);

  const DEFAULT_PROFILE_IMAGE =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `
<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 24 24' fill='none'>
  <rect width='100%' height='100%' fill='%23E5E7EB' />
  <g transform='translate(4 3)'>
    <circle cx='8' cy='6' r='4' fill='%239CA3AF' />
    <rect x='0' y='13' width='16' height='6' rx='3' fill='%239CA3AF' />
  </g>
</svg>`,
    );

  const handleSave = async () => {
    if (!cvData) return;

    setIsSaving(true);

    try {
      const cvToSave = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          profileImage:
            cvData.personalInfo.profileImage && cvData.personalInfo.profileImage.trim()
              ? cvData.personalInfo.profileImage
              : DEFAULT_PROFILE_IMAGE,
        },
      };

      await saveCV(cvToSave);
      setCVData(cvToSave);
      toast.success("CV saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to discard changes and go back?",
      )
    ) {
      navigate("/dashboard");
    }
  };

  const handleExportPDF = async () => {
    if (!cvData) {
      toast.error("CV data not ready");
      return;
    }

    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!exportPreviewRef.current) {
      toast.error("CV preview not ready");
      setIsExporting(false);
      return;
    }

    try {
      await exportToPDF(cvData, exportPreviewRef.current);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF Export Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to export PDF. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 dark:text-gray-300">
            Loading CV...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back
            </button>
          </div>

          <div className="flex justify-between gap-6 md:ml-auto w-full md:w-auto overflow-x-auto">
            <div className="flex w-full md:w-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all whitespace-nowrap ${!showPreview
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm font-medium">CV Form</span>
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all whitespace-nowrap ${showPreview
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm font-medium">Preview</span>
              </button>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md whitespace-nowrap ${isExporting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                } text-white`}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm font-medium">{isExporting ? "Exporting..." : "Export"}</span>
            </button>
            {!isMobile && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md whitespace-nowrap ${isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  } text-white`}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  {isSaving ? "Saving..." : "Save"}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col">

          {!showPreview && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <CVForm
                cvData={cvData}
                onChange={handleCVChange}
                {...(isMobile
                  ? { onSave: handleSave, onCancel: handleCancel }
                  : {})}
              />
            </div>
          )}

          {showPreview && (
            <div
              onClick={() => setShowPreview(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowPreview(false);
                }
              }}
              title="Back to form"
            >
              <CVPreview cvData={cvData} />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAI(!showAI)}
        className="
          fixed bottom-5 right-5 z-50
          flex items-center gap-2
          bg-violet-600 hover:bg-violet-700
          text-white
          px-4 py-3
          rounded-full
          shadow-xl
          transition-all duration-300
          hover:scale-105
        "
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />

        <span className="hidden sm:inline text-sm font-medium">
          AI Assistant
        </span>
      </button>

      {showAI && (
        <AIAssistant
          cvData={cvData}
          onClose={() => setShowAI(false)}
        />
      )}

      {isExporting && (
        <div
          className="bg-transparent"
          style={{ position: "absolute", left: "-9999px" }}
        >
          <CVPreview
            ref={exportPreviewRef}
            cvData={cvData}
            isExport={true}
          />
        </div>
      )}
    </div>
  );
}