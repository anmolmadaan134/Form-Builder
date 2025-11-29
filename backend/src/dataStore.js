let submissions = [];

export function addSubmission(submission) {
  submissions.push(submission);
}

export function getSubmissions() {
  return submissions;
}

export function getSubmissionById(id) {
  return submissions.find((s) => s.id === id) || null;
}

export function updateSubmission(id, data) {
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  submissions[idx] = {
    ...submissions[idx],
    data
  };
  return submissions[idx];
}

export function deleteSubmission(id) {
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  submissions.splice(idx, 1);
  return true;
}

export function clearSubmissions() {
  submissions = [];
}
