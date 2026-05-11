import { useNavigate } from "react-router";
import { useCV, CVData } from "../context/CVContext";
import Header from "../components/Header";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Check,
  X,
  Eye,
  Share2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import PDFPreviewModal from "../components/PDFPreviewModal";
import CVPreviewModal from "../components/CVPreviewModal";
import ShareModal from "../components/ShareModal";
import LoadingModal from "../components/LoadingModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { cvs, deleteCV, saveCV, loading } = useCV();

  const [previewCV, setPreviewCV] = useState<CVData | null>(
    null,
  );

  const [viewCV, setViewCV] = useState<CVData | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(
    null,
  );
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleEdit = (cv: CVData) => {
    navigate(`/builder/${cv.id}`);
  };

  const handleOpen = (cv: CVData) => {
    setViewCV(cv);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCV(deleteConfirm.id);
      toast.success("CV deleted successfully");
      setDeleteConfirm(null);
    }
  };

  const handleDownload = async (cv: CVData) => {
    setPreviewCV(cv);
  };

  const handleShare = (id: string) => {
    try {
      const link = `${window.location.origin}/share?id=${id}`;

      setShareLink(link);
      setOpenShareModal(true);

      navigator.clipboard
        .writeText(link)
        .then(() => toast.success("Share link copied to clipboard"))
        .catch(() => toast.error("Failed to copy share link"));
    } catch (e) {
      console.error(e);
      toast.error("Failed to create share link");
    }
  };

  const getTemplateName = (templateId: string) => {
    const templates: Record<string, string> = {
      modern: "Modern",
      minimal: "Minimal",
      corporate: "Corporate",
      creative: "Creative",
    };

    return templates[templateId] || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My CVs
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            Manage your professional resumes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/templates")}
            className="group bg-white dark:bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#2563EB] dark:hover:border-[#2563EB] transition-all flex flex-col items-center justify-center min-h-[300px] cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-[#2563EB]" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create New CV
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-center">
              Start building your professional resume
            </p>
          </button>

          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 group justify-between">
                        <div className="block items-center gap-2">
                            <h3 className="text-lg inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                              {getTemplateName(cv.templateId)} Resume
                            </h3>
                            
                          </div>
                          
                        <div className="flex justify-center relative items-center gap-2">
                          <button
                            onClick={() => handleEdit(cv)}
                            className="p-2.5 text-[#2563EB] dark:text-[#60a5fa] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => handleDownload(cv)}
                            className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === cv.id ? null : cv.id,
                              )
                            }
                            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenuId === cv.id && (
                            <div className="absolute top-12 right-0 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                              <button
                                onClick={() => {
                                  handleOpen(cv);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>

                              <button
                                onClick={() => handleShare(cv.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleDelete(cv.id, cv.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>                    
                  </div>
                </div>

                {cv.personalInfo.profileImage && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={cv.personalInfo.profileImage}
                      alt={
                        cv.personalInfo.fullName || "Profile"
                      }
                      className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md"
                    />
                  </div>
                )}

                {cv.personalInfo.fullName && (
                  <div className="flex justify-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {cv.personalInfo.fullName}
                    </p>
                  </div>
                  
                )}
                <div className="flex justify-center">
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                            </span>
                            </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewCV && (
        <PDFPreviewModal
          cvData={previewCV}
          onClose={() => setPreviewCV(null)}
        />
      )}

      {viewCV && (
        <CVPreviewModal
          cvData={viewCV}
          onClose={() => setViewCV(null)}
        />  
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-xs w-full p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>
                "
                {cvs.find((cv) => cv.id === deleteConfirm.id)
                  ?.personalInfo?.fullName ||
                  deleteConfirm.name}
                "
              </strong>
              ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {openShareModal && shareLink && (
        <ShareModal
          link={shareLink}
          onClose={() => {
            setOpenShareModal(false);
            setShareLink(null);
          }}
        />
      )}

      <LoadingModal open={loading} message={"Loading CVs..."} />
    </div>
  );
}