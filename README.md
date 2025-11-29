# Dynamic Form Builder – MatBook Assignment

A full-stack **dynamic form builder** where the frontend renders a form from a JSON schema served by the backend, validates user input, and stores submissions. Includes a submissions dashboard with search, pagination, CSV export, and full CRUD (view/edit/delete).

---

## Live Links

- **Frontend (Vercel)**: https://form-builder-chi-seven.vercel.app  
- **Backend (Render)**: https://form-builder-grfh.onrender.com  
- **GitHub Repository**: https://github.com/anmolmadaan134/Form-Builder

---

## Repository Structure

```text
project-root/
├─ backend/
│  ├─ src/
│  │  ├─ index.js          # Express app entry point, routes & CORS
│  │  ├─ formSchema.js     # Form JSON schema
│  │  ├─ dataStore.js      # In-memory submissions store
│  │  └─ validation.js     # Backend validation against schema
│  ├─ package.json
│  └─ README.md            # (optional) backend-specific notes
├─ frontend/
│  ├─ src/
│  │  ├─ api.js                    # Axios instance & API helpers
│  │  ├─ main.jsx                  # React entry
│  │  ├─ App.jsx                   # Layout & routing (Form / Submissions)
│  │  ├─ pages/
│  │  │  ├─ DynamicFormPage.jsx    # Renders dynamic form
│  │  │  └─ SubmissionsPage.jsx    # Submissions list, search, CSV, modals
│  │  ├─ components/
│  │  │  ├─ FormRenderer.jsx       # Generic schema-driven form renderer
│  │  │  ├─ SubmissionTable.jsx    # Table with pagination, sorting, actions
│  │  │  └─ SubmissionViewModal.jsx# Read-only view modal
│  │  └─ index.css                 # Tailwind base + light/dark styles
│  ├─ package.json
│  └─ README.md                    # (optional) frontend-specific notes
├─ package.json                    # root meta/package (optional)
└─ README.md                       # this file

Milestone Completion Status
-> Core Backend Milestones

Dynamic Form Schema API

GET /api/form-schema returns the JSON schema for the Employee Onboarding form.

Create Submission

POST /api/submissions to create a submission.

Server-side validation based on schema rules (required, type, min/max, etc.).

List Submissions

GET /api/submissions?page=&limit=&sortBy=&sortOrder=
Pagination and sorting on createdAt.

In-memory storage

Submissions stored in an in-memory array via dataStore.js.

-> Optional / Bonus Backend Features

Update submission

PUT /api/submissions/:id updates an existing submission with validation.

Delete submission

DELETE /api/submissions/:id deletes a submission.

Search / filter

GET /api/submissions?search=query
Simple case-insensitive search across ID and all field values.

-> Core Frontend Milestones

Dynamic form rendering

Form structure (fields, labels, placeholders, types) generated from backend schema.

Client-side validation

Mirrors backend rules: required fields, min/max, regex, multi-select counts, etc.

Form submission

Submits to backend and shows success / error messages per field.

Submissions list

Separate Submissions tab shows paginated list of submissions with Created At sorting.

-> Optional / Bonus Frontend Features

View / Edit / Delete submission

View: read-only modal (SubmissionViewModal).

Edit: opens schema-driven form in a modal with initial values, updates via PUT.

Delete: deletes with confirmation via DELETE.

CSV export

Export visible submissions (current page) to CSV including dynamic fields.

Debounced search

“Search (debounced)…” input on submissions page; 400ms debounce to avoid extra requests.

Dark mode

Toggle in header; adds dark class on <body> and switches Tailwind styles.

Responsive layout

Works on desktop and tablet widths; table area scrolls horizontally if needed.

Tech Stack Used
Backend

Node.js + Express

CORS for handling cross-origin frontend calls

Built-in crypto (crypto.randomUUID) for submission IDs

In-memory data storage (no external DB for this assignment)

Frontend

React 18

Vite as the build tool

React Router for Form / Submissions navigation

@tanstack/react-query for data fetching, caching, and mutation

@tanstack/react-table for the submissions table

Axios for HTTP requests

Tailwind CSS for styling and light/dark themes

Setup and Run Instructions
Prerequisites

Node.js 18+

npm or yarn

Git (optional but recommended)

Below instructions assume you run backend on port 4000 and frontend on 5173 locally.

1. Clone the Repository
git clone https://github.com/your-username/form-builder.git
cd form-builder

2. Backend – Local Development
cd backend
npm install

Configure CORS (already set in code)

src/index.js allows:

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://form-builder-chi-seven.vercel.app"
    ]
  })
);

Run Backend
npm run dev   # or: node src/index.js


Backend runs at:

http://localhost:4000

GET http://localhost:4000/api/form-schema

GET http://localhost:4000/api/submissions

3. Frontend – Local Development

Open a second terminal:

cd frontend
npm install


If you prefer using an env variable:

Create frontend/.env:

VITE_API_BASE_URL=http://localhost:4000/api
and in src/api.js:

js
Copy code
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"
});
Run Frontend
bash
Copy code
npm run dev
Open:

http://localhost:5173

You should see the Dynamic Form Builder UI and the form schema should load from the backend.

4. Production Deployments (what is already done)
Backend deployed to Render:
https://form-builder-grfh.onrender.com

Frontend deployed to Vercel:
https://form-builder-chi-seven.vercel.app

In production, frontend/src/api.js (or .env) uses:

js
Copy code
const api = axios.create({
  baseURL: "https://form-builder-grfh.onrender.com/api"
});
Known Issues / Limitations
In-memory storage only

Submissions are lost on server restart because they are kept in an array.

No authentication / authorization

All endpoints are open and unauthenticated (per assignment scope).

Single form schema

Backend serves a single hard-coded Employee Onboarding schema.

No advanced error UI

Errors are shown inline per field and via simple text messages.

Assumptions
Only one form schema is required; no schema management UI needed.

In-memory data storage is acceptable for this assignment (no DB requirement).

All requests come from:

Local dev (http://localhost:5173) or

Deployed frontend (https://form-builder-chi-seven.vercel.app).

Server and client use the same schema; keeping backend as the source of truth for validations.

Time and complexity constraints do not require:

User authentication

Multi-tenant or multi-form support

Internationalization or accessibility beyond basic good practices.
