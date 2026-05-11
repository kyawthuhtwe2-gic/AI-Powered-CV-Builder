import { useRef, useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { CVData } from '../context/CVContext';
import CVPreview from './CVPreview';
import { exportToPDF } from '../utils/pdfExport';
import { toast } from 'sonner';

interface PDFPreviewModalProps {
  cvData: CVData;
  onClose: () => void;
}

export default function PDFPreviewModal({ cvData, onClose }: PDFPreviewModalProps) {
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cvPreviewRef.current) {
      toast.error('Preview not ready');
      return;
    }

    setIsExporting(true);
    try {
      await exportToPDF(cvData, cvPreviewRef.current);
      toast.success('PDF exported successfully!');
      onClose();
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleExport();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-transparent" style={{ position: 'absolute', left: '-9999px' }}>
        <CVPreview ref={cvPreviewRef} cvData={cvData} isExport={true} />
      </div>
      {isExporting && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preparing PDF...</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please wait</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
