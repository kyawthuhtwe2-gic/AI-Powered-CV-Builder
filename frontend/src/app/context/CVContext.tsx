import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
   PAGED RESPONSE
========================= */

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
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

  // pagination
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;

  refreshCVs: (
    page?: number,
    size?: number
  ) => Promise<void>;
}

/* =========================
   CONTEXT
========================= */

const CVContext =
  createContext<CVContextType | undefined>(
    undefined
  );

/* =========================
   PROVIDER
========================= */

export function CVProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cvs, setCVs] = useState<CVData[]>([]);

  const [currentCV, setCurrentCV] =
    useState<CVData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(false);

  // pagination
  const [page, setPage] = useState<number>(0);

  const [size, setSize] = useState<number>(3);

  const [totalPages, setTotalPages] =
    useState<number>(0);

  const [totalElements, setTotalElements] =
    useState<number>(0);

  // refs to avoid stale closures and to coordinate concurrent fetches
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);
  const latestPageRef = useRef(page);
  const latestSizeRef = useRef(size);

  useEffect(() => {
    latestPageRef.current = page;
  }, [page]);

  useEffect(() => {
    latestSizeRef.current = size;
  }, [size]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /* =========================
     FETCH CVS
  ========================= */

  const fetchCVs = async (
    p?: number,
    s?: number
  ) => {
    const requestedPage =
      typeof p === "number" ? p : latestPageRef.current;
    const requestedSize =
      typeof s === "number" ? s : latestSizeRef.current;

    const fetchId = ++fetchIdRef.current;

    if (isMountedRef.current) setLoading(true);

    try {
      // Spring Boot pageable is 0-based; pass values through as-is
      const remote: PagedResponse<CVData> =
        await api.getCVs(requestedPage, requestedSize);

      // ignore out-of-order responses
      if (!isMountedRef.current || fetchId !== fetchIdRef.current) return;

      if (remote && Array.isArray(remote.content)) {
        // If server returned an empty page (because an item was deleted),
        // try fetching the previous page once to preserve UX.
        if (
          remote.content.length === 0 &&
          requestedPage > 0
        ) {
          await fetchCVs(requestedPage - 1, requestedSize);
          return;
        }

        setCVs(remote.content);

        setPage(
          typeof remote.page === "number"
            ? remote.page
            : requestedPage
        );

        setSize(
          typeof remote.size === "number"
            ? remote.size
            : requestedSize
        );

        setTotalElements(
          typeof remote.totalElements === "number"
            ? remote.totalElements
            : 0
        );

        setTotalPages(
          typeof remote.totalPages === "number"
            ? remote.totalPages
            : 0
        );
      } else {
        // malformed response
        setCVs([]);
        setPage(requestedPage);
        setSize(requestedSize);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (err) {
      if (!isMountedRef.current || fetchId !== fetchIdRef.current) return;
      console.error("Failed to load CVs", err);
      setCVs([]);
      setPage(requestedPage);
      setSize(requestedSize);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      if (isMountedRef.current && fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchCVs(0, size);
  }, []);

  /* =========================
     CREATE NEW CV
  ========================= */

  const createNewCV = (
    templateId: string
  ): CVData => {
    const templates: Record<
      string,
      string
    > = {
      modern: "Modern Resume",
      minimal: "Minimal Resume",
      corporate: "Corporate Resume",
      creative: "Creative Resume",
    };

    return {
      id: crypto.randomUUID(),

      name:
        templates[templateId] ??
        "My Resume",

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

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };
  };

  /* =========================
     SAVE CV
  ========================= */

  const saveCV = async (
    cv: CVData
  ) => {
    const updatedCV: CVData = {
      ...cv,

      updatedAt:
        new Date().toISOString(),
    };

    try {
      const exists = cvs.find(
        (c) => c.id === cv.id
      );

      let result: CVData;

      if (exists) {
        result =
          await api.updateCV(
            cv.id,
            updatedCV
          );

        setCVs((prev) =>
          prev.map((c) =>
            c.id === cv.id
              ? result
              : c
          )
        );
      } else {
        result = await api.createCV(updatedCV);

        // reload current page (use refs to avoid stale closures)
        await fetchCVs(latestPageRef.current, latestSizeRef.current);
      }

      setCurrentCV(result);
    } catch (err) {
      console.error(
        "Save CV failed",
        err
      );

      throw err;
    }
  };

  /* =========================
     DELETE CV
  ========================= */

  const deleteCV = async (
    id: string
  ) => {
    try {
      await api.deleteCV(id);

      // reload current page (use refs to avoid stale closures)
      await fetchCVs(latestPageRef.current, latestSizeRef.current);

      if (currentCV?.id === id) {
        setCurrentCV(null);
      }
    } catch (err) {
      console.error(
        "Delete CV failed",
        err
      );

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

        // pagination
        page,

        size,

        totalPages,

        totalElements,

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
    throw new Error(
      "useCV must be used within CVProvider"
    );
  }

  return context;
}