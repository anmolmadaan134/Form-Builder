import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchFormSchema() {
  const res = await api.get("/form-schema");
  return res.data;
}

export async function submitForm(values) {
  const res = await api.post("/submissions", values);
  return res.data;
}

export async function fetchSubmissions(params) {
  const res = await api.get("/submissions", { params });
  return res.data;
}

export async function updateSubmission(id, values) {
  const res = await api.put(`/submissions/${id}`, values);
  return res.data;
}

export async function deleteSubmission(id) {
  const res = await api.delete(`/submissions/${id}`);
  return res.data;
}
