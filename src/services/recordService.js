import API from "./api";

export const getRecords = async () => {
  const response = await API.get("/records");
  return response.data;
};

export const createRecord = async (data) => {
  const response = await API.post("/records", data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await API.delete(`/records/${id}`);
  return response.data;
};


export const updateRecord = async (id, data) => {
  const response = await API.put(`/records/${id}`, data);
  return response.data;
};

export const getDeletedRecords = async () => {
  const response = await API.get("/records/deleted");
  return response.data;
};

export const getAdminDeletedRecords = async () => {
  const response = await API.get("/admin/deleted/records");
  return response.data;
};

export const restoreRecord = async (id) => {
  const response = await API.post(`/records/restore/${id}`);
  return response.data;
};

export const getStaffs = async () => {
  const response = await API.get("/admin/staffs");
  return response.data;
};

export const deleteStaff = async (staffId) => {
  const response = await API.delete(`/staff/${staffId}`);
  return response.data;
};

export const getDeletedStaffs = async () => {
  const response = await API.get("/admin/deleted/staffs");
  return response.data;
};

export const restoreStaff = async (staffId) => {
  const response = await API.post(`/staff/restore/${staffId}`);
  return response.data;
};

export const createStaff = async (data) => {
  const response = await API.post("/admin/create-staff", data);
  return response.data;
};

// Upload document
export const uploadDocument = async (recordId, documentName, file) => {
  const formData = new FormData();
  formData.append("document_name", documentName);
  formData.append("file", file);

  const response = await API.post(
    `/records/${recordId}/upload`,
    formData,
  );

  return response.data;
};

// List documents of a record
export const getDocuments = async (recordId) => {
  const response = await API.get(
    `/records/${recordId}/documents`
  );
  return response.data;
};

// View document
export const viewDocument = async (recordId, documentId) => {
  const response = await API.get(
    `/records/${recordId}/documents/${documentId}`
  );

  return response.data.url;   // return only the URL
};

// Delete document
export const deleteDocument = async (documentId) => {
  const response = await API.delete(
    `/documents/${documentId}`
  );
  return response.data;
};

export const getMyRecords = async () => {
  const response = await api.get("/records"); 
  return response.data;
};