import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubmissions,
  deleteSubmission,
  updateSubmission,
  fetchFormSchema
} from "../api.js";
import SubmissionTable from "../components/SubmissionTable.jsx";
import FormRenderer from "../components/FormRenderer.jsx";
import SubmissionViewModal from "../components/SubmissionViewModal.jsx"; // ✨ NEW

export default function SubmissionsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(id);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", page, limit, sortOrder, debouncedSearch],
    queryFn: () =>
      fetchSubmissions({
        page,
        limit,
        sortBy: "createdAt",
        sortOrder,
        search: debouncedSearch
      }),
    keepPreviousData: true
  });

  const { data: schema } = useQuery({
    queryKey: ["form-schema"],
    queryFn: fetchFormSchema
  });

  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null); 

  const deleteMut = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }) => updateSubmission(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    }
  });

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleExportCsv = () => {
    const rows = data?.data ?? [];
    if (!rows.length) return;

    const allKeys = new Set();
    rows.forEach((s) => {
      Object.keys(s.data || {}).forEach((k) => allKeys.add(k));
    });
    const headers = ["id", "createdAt", ...Array.from(allKeys)];
    const csvRows = [headers.join(",")];

    rows.forEach((s) => {
      const row = [];
      row.push(`"${s.id}"`);
      row.push(`"${s.createdAt}"`);
      headers.slice(2).forEach((key) => {
        const value = s.data?.[key];
        const cell = Array.isArray(value) ? value.join("; ") : value ?? "";
        row.push(`"${String(cell).replace(/"/g, '""')}"`);
      });
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "submissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isUpdating = updateMut.isPending;
  const isDeleting = deleteMut.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Submissions</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search (debounced)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-1.5 text-sm bg-transparent"
          />
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            disabled={!data?.data?.length}
          >
            Export CSV
          </button>
        </div>
      </div>

      <SubmissionTable
        data={data?.data ?? []}
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        limit={data?.limit ?? limit}
        sortOrder={sortOrder}
        isLoading={isLoading}
        isError={isError}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onSortToggle={handleSortToggle}
        onEdit={(submission) => {
          setViewing(null);     
          setEditing(submission);
        }}
        onDelete={(id) => {
          if (window.confirm("Delete this submission?")) {
            deleteMut.mutate(id);
          }
        }}
        onView={(submission) => {
          setEditing(null);    
          setViewing(submission);
        }}
      />

      
      {editing && schema && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold">
                Edit submission{" "}
                <span className="text-xs opacity-70">({editing.id})</span>
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="px-4 py-4 max-h-[70vh] overflow-y-auto">
              <FormRenderer
                schema={schema}
                initialValues={editing.data}
                isSubmitting={updateMut.isPending}
                submitLabel="Update"
                onSubmit={async (values) => {
                  try {
                    const res = await updateMut.mutateAsync({
                      id: editing.id,
                      values
                    });
                    if (!res.success && res.errors) {
                      return { success: false, errors: res.errors };
                    }
                    setEditing(null);
                    return { success: true };
                  } catch (e) {
                    if (e.response?.data?.errors) {
                      return {
                        success: false,
                        errors: e.response.data.errors
                      };
                    }
                    return {
                      success: false,
                      errors: { _global: "Unexpected error" }
                    };
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      
      {viewing && (
        <SubmissionViewModal
          open={!!viewing}
          onClose={() => setViewing(null)}
          submission={viewing}
        />
      )}

      {(isDeleting || isUpdating) && (
        <p className="text-xs text-slate-500">Working on your request...</p>
      )}
    </div>
  );
}
