import React from "react";

function getPageNumbers(currentPage: number, totalPages: number): Array<number | '...'> {
  const pages: Array<number | '...'> = [];
  if (!totalPages || totalPages <= 7) {
    for (let i = 0; i < (totalPages || 0); i++) pages.push(i);
    return pages;
  }

  const left = Math.max(0, currentPage - 2);
  const right = Math.min(totalPages - 1, currentPage + 2);

  if (left > 0) {
    pages.push(0);
    if (left > 1) pages.push('...');
  }

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < totalPages - 1) {
    if (right < totalPages - 2) pages.push('...');
    pages.push(totalPages - 1);
  }

  return pages;
}

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
}: Props) {
  const handlePageChange = (p: number) => {
    if (p === page) return;
    if (p < 0 || p >= Math.max(0, totalPages)) return;
    onPageChange(p);
  };
  const goPrev = () => onPageChange(Math.max(0, page - 1));
  const goNext = () => onPageChange(Math.min((totalPages || 1) - 1, page + 1));

  return (
    <div
      className={`max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ${className ?? ""
        }`}
    >
      <span className="px-3 py-2 text-sm text-gray-600">
        Page {page + 1} of {Math.max(1, totalPages)}
      </span>
      <div className="inline-flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={page <= 0}
          className={`px-3 py-1 rounded-xl border ${page <= 0
            ? "text-gray-400 border-gray-200 bg-gray-100"
            : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
            }`}
        >
          Previous
        </button>

        {getPageNumbers(page, totalPages).map((p, idx) =>
          p === '...' ? (
            <span
              key={idx}
              style={{
                padding: '4px 8px',
                color: '#374151',
              }}
            >
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageChange(Number(p))}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: page === p ? '#9C9F38' : '#F3F4F6',
                color: page === p ? '#fff' : '#111827',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { if (page !== p) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D1D5DB' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = page === p ? '#9C9F38' : '#F3F4F6' }}
            >
              {Number(p) + 1}
            </button>
          )
        )}

        <button
          onClick={goNext}
          disabled={page >= (totalPages || 1) - 1}
          className={`px-3 py-1 rounded-xl border ${page >= (totalPages || 1) - 1
            ? "text-gray-400 border-gray-200 bg-gray-100"
            : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
