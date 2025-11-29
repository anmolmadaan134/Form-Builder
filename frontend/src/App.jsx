import { Link, Route, Routes, useLocation } from "react-router-dom";
import './App.css'
import DynamicFormPage from "./pages/DynamicFormPage.jsx";
import SubmissionsPage from "./pages/SubmissionPage.jsx";
import React from "react";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold">Dynamic Form Builder</h1>
          <nav className="flex gap-4 text-sm">
            <Link
              to="/"
              className={
                "px-3 py-1 rounded " +
                (location.pathname === "/"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100")
              }
            >
              Form
            </Link>
            <Link
              to="/submissions"
              className={
                "px-3 py-1 rounded " +
                (location.pathname === "/submissions"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100")
              }
            >
              Submissions
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<DynamicFormPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
          </Routes>
        </div>
      </main>
    </div>

  )
}

export default App
