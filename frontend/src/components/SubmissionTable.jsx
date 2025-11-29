import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

export default function SubmissionTable({
  data,
  page,
  totalPages,
  total,
  limit,
  sortOrder,
  isLoading,
  isError,
  onPageChange,
  onLimitChange,
  onSortToggle,
  onEdit,
  onDelete,
  onView
}) {
  const columns = [
    {
      header: "Submission ID",
      accessorKey: "id"
    },
    {
      header: () => (
        <button
          type="button"
          onClick={onSortToggle}
          className="flex items-center gap-1"
        >
          Created At{" "}
          <span className="text-xs text-slate-500">
            ({sortOrder === "asc" ? "↑" : "↓"})
          </span>
        </button>
      ),
      accessorKey: "createdAt",
      cell: (info) =>
        new Date(info.getValue()).toLocaleString()
    },
    {
      header: "Actions",
      cell: (info) => {
        const submission = info.row.original;
        return (
            
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => onView(submission)}  // ✨ VIEW
              className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onEdit(submission)}
              className="px-3 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(submission.id)}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error loading submissions.</div>;
  }

  if (!data.length) {
    return <div>No submissions yet.</div>;
  }

  return (
    <div className="card shadow rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <div>
          Page {page} of {totalPages} • Total {total} submissions
        </div>
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm bg-transparent"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
