import { useRef } from "react";
import { X } from "lucide-react";
import { CVData } from "../context/CVContext";
import CVPreview from "./CVPreview";

interface CVPreviewModalProps {
  cvData: CVData;
  onClose: () => void;
}

export default function CVPreviewModal({
  cvData,
  onClose,
}: CVPreviewModalProps) {
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full md:w-[60vw] max-w-3xl md:max-w-none max-h-[calc(100vh-4rem)] md:h-[90vh] h-auto overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {cvData.name || "Untitled CV"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <CVPreview ref={cvPreviewRef} cvData={cvData} />
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}