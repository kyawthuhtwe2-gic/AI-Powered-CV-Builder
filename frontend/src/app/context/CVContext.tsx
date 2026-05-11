import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as api from "../utils/api";

/* =========================
   TYPES
========================= */

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface CVData {
  id: string;
  name: string;
  templateId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    profileImage: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

/* =========================
   CONTEXT TYPE
========================= */

interface CVContextType {
  cvs: CVData[];
  currentCV: CVData | null;
  setCurrentCV: (cv: CVData | null) => void;

  saveCV: (cv: CVData) => Promise<void>;
  deleteCV: (id: string) => Promise<void>;
  createNewCV: (templateId: string) => CVData;

  loading: boolean;

  refreshCVs: () => Promise<void>;
}

/* =========================
   CONTEXT
========================= */

const CVContext = createContext<CVContextType | undefined>(undefined);

/* =========================
   PROVIDER
========================= */

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvs, setCVs] = useState<CVData[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* =========================
     FETCH CVS
  ========================= */

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const remote = await api.getCVs();

      if (Array.isArray(remote)) {
        setCVs(remote);
      } else {
        setCVs([]);
      }
    } catch (err) {
      console.error("Failed to load CVs", err);
      setCVs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  /* =========================
     CREATE NEW CV
  ========================= */

  const createNewCV = (templateId: string): CVData => {
    const templates: Record<string, string> = {
      modern: "Modern Resume",
      minimal: "Minimal Resume",
      corporate: "Corporate Resume",
      creative: "Creative Resume",
    };

    return {
      id: crypto.randomUUID(),
      name: templates[templateId] ?? "My Resume",
      templateId,
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
        profileImage: "",
      },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  /* =========================
     SAVE CV
  ========================= */

  const saveCV = async (cv: CVData) => {
    const updatedCV: CVData = {
      ...cv,
      updatedAt: new Date().toISOString(),
    };

    try {
      const exists = cvs.find((c) => c.id === cv.id);

      let result: CVData;

      if (exists) {
        result = await api.updateCV(cv.id, updatedCV);
        setCVs((prev) =>
          prev.map((c) => (c.id === cv.id ? result : c))
        );
      } else {
        result = await api.createCV(updatedCV);
        setCVs((prev) => [...prev, result]);
      }

      setCurrentCV(result);
    } catch (err) {
      console.error("Save CV failed", err);
      throw err;
    }
  };

  /* =========================
     DELETE CV
  ========================= */

  const deleteCV = async (id: string) => {
    try {
      await api.deleteCV(id);

      setCVs((prev) => prev.filter((cv) => cv.id !== id));

      if (currentCV?.id === id) {
        setCurrentCV(null);
      }
    } catch (err) {
      console.error("Delete CV failed", err);
      throw err;
    }
  };

  /* =========================
     PROVIDER
  ========================= */

  return (
    <CVContext.Provider
      value={{
        cvs,
        currentCV,
        setCurrentCV,
        loading,
        saveCV,
        deleteCV,
        createNewCV,
        refreshCVs: fetchCVs,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useCV() {
  const context = useContext(CVContext);

  if (!context) {
    throw new Error("useCV must be used within CVProvider");
  }

  return context;
}