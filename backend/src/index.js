import express from "express";
import cors from "cors";
import { employeeOnboardingSchema } from "./formSchema.js";
import {
  addSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission
} from "./dataStore.js";
import { validateSubmission } from "./validation.js";
import crypto from "crypto";

const app = express();
const PORT = 4000;

// allow both 5173 & 5174 for convenience
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://form-builder-chi-seven.vercel.app"]
  })
);
app.use(express.json());

// ---------- SCHEMA ----------
app.get("/api/form-schema", (req, res) => {
  res.json(employeeOnboardingSchema);
});

// ---------- CREATE ----------
app.post("/api/submissions", (req, res) => {
  const data = req.body || {};
  const errors = validateSubmission(employeeOnboardingSchema, data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const submission = {
    id,
    createdAt,
    data
  };

  addSubmission(submission);

  return res.status(201).json({
    success: true,
    id,
    createdAt
  });
});

// ---------- READ (LIST + SEARCH/FILTER) ----------
app.get("/api/submissions", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const sortBy = String(req.query.sortBy ?? "createdAt");
  const sortOrder = String(req.query.sortOrder ?? "desc");
  const search = (req.query.search || "").toString().toLowerCase().trim();

  let all = getSubmissions();

  // simple text search across id and all field values
  if (search) {
    all = all.filter((s) => {
      if (s.id.toLowerCase().includes(search)) return true;

      for (const value of Object.values(s.data || {})) {
        if (Array.isArray(value)) {
          if (value.join(", ").toLowerCase().includes(search)) return true;
        } else if (
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  if (sortBy === "createdAt") {
    all = [...all].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt.localeCompare(b.createdAt);
      } else {
        return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }

  const total = all.length;
  const validLimit = limit > 0 ? limit : 10;
  const validPage = page > 0 ? page : 1;
  const totalPages = Math.max(1, Math.ceil(total / validLimit));
  const currentPage = Math.min(validPage, totalPages);

  const start = (currentPage - 1) * validLimit;
  const end = start + validLimit;
  const items = all.slice(start, end);

  return res.json({
    success: true,
    data: items,
    page: currentPage,
    limit: validLimit,
    total,
    totalPages,
    sortBy,
    sortOrder,
    search
  });
});

// ---------- UPDATE ----------
app.put("/api/submissions/:id", (req, res) => {
  const id = req.params.id;
  const existing = getSubmissionById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  const data = req.body || {};
  const errors = validateSubmission(employeeOnboardingSchema, data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  const updated = updateSubmission(id, data);

  return res.json({
    success: true,
    submission: updated
  });
});

// ---------- DELETE ----------
app.delete("/api/submissions/:id", (req, res) => {
  const id = req.params.id;
  const ok = deleteSubmission(id);
  if (!ok) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
