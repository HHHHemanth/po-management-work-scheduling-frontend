import API from "./api";

// Create Work
export const createWork = async (data) => {
  const res = await API.post("/works", data);
  return res.data;
};

// Get All Works (Admin)
export const getAllWorks = async () => {
  const res = await API.get("/works");
  return res.data;
};

// Staff View Works
export const getStaffWorks = async () => {
  const res = await API.get("/staff/my-works");
  return res.data;
};

// Associate View Works
export const getAssociateWorks = async () => {
  const res = await API.get("/works");
  return res.data;
};

// Update Work
export const updateWork = async (id, data) => {
  const res = await API.put(`/works/${id}`, data);
  return res.data;
};

// Delete Work
export const deleteWork = async (id) => {
  const res = await API.delete(`/works/${id}`);
  return res.data;
};

// Restore Work
export const restoreWork = async (id) => {
  const res = await API.post(`/works/restore/${id}`);
  return res.data;
};

// Update Progress
export const updateProgress = async (id, data) => {
  const res = await API.put(`/works/${id}/progress`, data);
  return res.data;
};

// Add Delay Reason
export const addDelay = async (id, data) => {
  const res = await API.put(`/works/${id}/delay`, data);
  return res.data;
};

// Upload Work Document
export const uploadWorkDocument = async (workId, name, file) => {
  const formData = new FormData();
  formData.append("document_name", name);
  formData.append("file", file);

  const res = await API.post(`/works/${workId}/upload`, formData);
  return res.data;
};

// Get Work Documents
export const getWorkDocuments = async (workId) => {
  const res = await API.get(`/works/${workId}/documents`);
  return res.data;
};

// Delete Work Document
export const deleteWorkDocument = async (docId) => {
  const res = await API.delete(`/work-documents/${docId}`);
  return res.data;
};

// Deleted Works
export const getDeletedWorks = async () => {
  const res = await API.get("/works/deleted");
  return res.data;
};

