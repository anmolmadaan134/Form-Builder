import React from "react";

export default function SubmissionViewModal({ open, onClose, submission }) {
  if (!open || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Submission Details</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-auto text-sm">
          <p className="text-xs text-slate-500">
            <span className="font-medium">ID:</span> {submission.id}
          </p>
          <p className="text-xs text-slate-500">
            <span className="font-medium">Created:</span>{" "}
            {new Date(submission.createdAt).toLocaleString()}
          </p>
          <hr className="my-2" />
          {Object.entries(submission.data).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium min-w-[120px]">{key}</span>
              <span className="text-slate-700">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
