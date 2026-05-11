import React, { useEffect, useState, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CVData, useCV } from "../context/CVContext";
import { assistAI, getAIs, createAI, updateAI } from "../utils/api";

interface AIAssistantProps {
  cvData: CVData;
  onClose: () => void;
}

export default function AIAssistant({ cvData, onClose }: AIAssistantProps) {
  const { saveCV } = useCV();
  const [apiKey, setApiKey] = useState("");
  const [instruction, setInstruction] = useState("");
  const [configs, setConfigs] = useState<Array<{ id?: number; openAiKey?: string; instruction?: string }>>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // load saved AI configs from backend
    const load = async () => {
      try {
        const list = await getAIs();
        setConfigs(list || []);
        if (Array.isArray(list) && list.length > 0) {
          const first = list[0];
          setSelectedConfigId(first.id ?? null);
          setApiKey(first.openAiKey || "");
          setInstruction(first.instruction || "Improve text professionally.");
        } else {
          setInstruction("Improve text professionally.");
        }
      } catch (e) {
        toast.error("Failed to load AI configs");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (showKeyModal) inputRef.current?.focus();
  }, [showKeyModal]);

  const maskedKey = apiKey ? "****************" : "Not set";

  const openKeyModal = () => setShowKeyModal(true);
  const closeKeyModal = () => setShowKeyModal(false);

  const handleSaveKeyAndInstruction = () => {
    // save to backend (create or update)
    const save = async () => {
      try {
        const payload = { openAiKey: apiKey, instruction };
        let saved: any;
        if (selectedConfigId) {
          saved = await updateAI(selectedConfigId, payload);
        } else {
          saved = await createAI(payload);
        }

        const updatedList = await getAIs().catch(() => []);
        setConfigs(updatedList || []);
        setSelectedConfigId(saved?.id ?? null);
        setApiKey(saved?.openAiKey || apiKey);
        setInstruction(saved?.instruction || instruction);
        toast.success("Saved API key and instruction");
        setShowKeyModal(false);
      } catch (e: any) {
        toast.error("Failed to save API key/instruction");
      }
    };
    save();
  };

  const handleApply = async () => {
    const keyToUse = apiKey;
    const instructionToUse = instruction;

    if (!keyToUse) {
      toast.error("Please set your OpenAI API key first.");
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setProgress(1);
    if (progressRef.current) {
      window.clearInterval(progressRef.current);
      progressRef.current = null;
    }

    // fallback simulated progress if server doesn't provide content-length
    let fallbackInterval: number | null = window.setInterval(() => {
      setProgress((p) => Math.min(90, p + Math.floor(Math.random() * 5) + 1));
    }, 500) as unknown as number;

    try {
      const json = await assistAI({ cvData, apiKey: keyToUse, instruction: instructionToUse });
      const returned = json?.cvData || json?.updatedCV || json || null;
      if (returned && returned.id) {
        saveCV(returned as CVData);
        toast.success("AI updated the CV");
      } else if (typeof json === 'object' && 'raw' in json) {
        toast.success("AI returned a textual response");
      } else {
        toast.success("AI request sent");
      }

      setProgress(100);
      if (fallbackInterval) { window.clearInterval(fallbackInterval); fallbackInterval = null; }
      await new Promise((r) => setTimeout(r, 400));
      onClose();
    } catch (e: any) {
      toast.error(`AI request failed: ${e.message}`);
      setProgress(0);
      if (fallbackInterval) { window.clearInterval(fallbackInterval); fallbackInterval = null; }
    } finally {
      setLoading(false);
    }
  };

  // clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) window.clearInterval(progressRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-white dark:bg-gray-900 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#2563EB] to-[#60a5fa]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">AI Assistant</h3>
                <p className="text-blue-100 text-sm">Smart CV improvements</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-md hover:bg-white/20 transition-transform transform hover:-translate-y-0.5"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="mb-4">
              <label className="text-sm text-gray-700 dark:text-gray-200">OpenAI Key:</label>
              <div className="mt-2 flex items-center justify-between gap-4">
                <div className="text-sm text-gray-800 dark:text-gray-200 truncate">{maskedKey}</div>
                <button
                  onClick={openKeyModal}
                  className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#2563EB] hover:bg-[#1e4fcf] text-sm text-white transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                >
                  Set Key & Instruction
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-700 dark:text-gray-200">Instruction</label>
              <div
                role="textbox"
                aria-readonly="true"
                tabIndex={0}
                className="mt-2 w-full max-h-44 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm overflow-auto whitespace-pre-wrap text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {instruction ? (
                  instruction
                ) : (
                  <span className="text-gray-400 dark:text-gray-300">
                    Improve text professionally.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 border-t border-white/10 sticky bottom-0">
            <div className="flex gap-3.justify-end">
              <div className="flex gap-3 justify-end w-full">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5"
                >
                  Close
                </button>

                <button
                  onClick={handleApply}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-[#2563EB] text-white text-sm hover:brightness-110 transition-transform transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeKeyModal} />

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-white/10 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Set OpenAI API Key</h4>
            <button
              onClick={closeKeyModal}
              aria-label="Close API Key modal"
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform transform hover:-translate-y-0.5"
            >
              <X className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Your key is stored locally in your browser.</p>

            <input
              ref={inputRef}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
            />

            <label className="text-sm text-gray-700 dark:text-gray-200">Instruction</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Improve text professionally."
              className="mt-2 w-full min-h-[90px] p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeKeyModal} className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm hover:shadow">
                Cancel
              </button>
              <button onClick={handleSaveKeyAndInstruction} className="px-4 py-2 rounded-md bg-[#2563EB] text-white text-sm hover:brightness-110">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress modal */}
      {(loading || progress > 0) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-white/10 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Applying AI changes</h4>

            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-[#2563EB] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Processing...</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{progress}%</span>
              </div>
            </div>

            {progress === 100 && (
              <div className="mt-4 text-center text-green-600 dark:text-green-400 font-medium">Complete</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}