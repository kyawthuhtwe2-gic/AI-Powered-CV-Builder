import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import Header from "../components/Header";
import CVPreview from "../components/CVPreview";
import { CVData } from "../context/CVContext";
import { getSharedCV } from "../utils/api";

export default function ShareView() {
  const location = useLocation();
  const { cvId } = useParams();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedCV = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const idFromQuery = params.get("id");
        const id = cvId || idFromQuery;

        if (id) {
          const data = await getSharedCV(id);
          setCvData(data as CVData);
          return;
        }

        setErrorMsg("No CV id found in URL.");
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load shared CV.");
      }
    };

    loadSharedCV();
  }, [location.search, cvId]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center">
        {!cvData && (
          <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              CV not found. The link may be invalid or expired.
            </p>

            {errorMsg && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMsg}</p>
            )}
          </div>
        )}

        {cvData && (
          <div className="w-full max-w-4xl" style={{ width: '100%' }}>
            {/* Constrain preview height so mobile screens can scroll the preview area */}
            <div className="w-full h-screen">
              <CVPreview cvData={cvData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
