import React from "react";
import { X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  link: string;
  onClose: () => void;
}

export default function ShareModal({ link, onClose }: ShareModalProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (e) {
      console.error("Failed to copy share link", e);
      toast.error("Copy failed");
    }
  };

  const handleSend = async () => {
    const payload = link;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: "Shared CV",
          text: payload,
          url: link,
        });
        toast.success("Shared via native share");
      } else {
        await handleCopy(payload);
        toast.success("Share text copied — paste it to send");
      }
    } catch (e) {
      console.error("Share failed", e);
      toast.error("Share failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-xl w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-4 break-words">
          <a href={link} className="text-sm text-blue-600 dark:text-blue-400 break-words" target="_blank" rel="noreferrer">
            {link}
          </a>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>

          <button
            onClick={() => handleCopy(link)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
