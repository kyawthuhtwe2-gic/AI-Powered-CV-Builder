interface LoadingModalProps {
  open: boolean;
  message?: string;
}

export default function LoadingModal({ open, message }: LoadingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-gray-300 dark:border-gray-600 rounded-full animate-spin"></div>
        <p className="text-gray-800 dark:text-gray-200 font-medium">{message ?? "Loading..."}</p>
      </div>
    </div>
  );
}
