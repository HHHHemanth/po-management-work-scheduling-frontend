import API from "./api";

export const getAssociates = async () => {
  const res = await API.get("/admin/project-associates");
  return res.data;
};

export const createAssociate = async (data) => {
  const res = await API.post("/admin/project-associate", data);
  return res.data;
};

export const deleteAssociate = async (staffId) => {
  const res = await API.delete(`/admin/project-associate/${staffId}`);
  return res.data;
};

export const restoreAssociate = async (staffId) => {
  const res = await API.post(
    `/admin/project-associate/restore/${staffId}`
  );
  return res.data;
};

export const getAssociatesUnderStaff = async (staffId) => {
  const res = await API.get(`/admin/staff/${staffId}/associates`);
  return res.data;
};

export const getMyAssociates = async () => {
  const res = await API.get("/staff/my-associates");
  return res.data;
};

export const getAllAssociates = async () => {
  const res = await API.get("/admin/project-associates");
  return res.data;
};

export const updateAssociate = async (staffId, data) => {
  const res = await API.put(
    `/admin/project-associate/${staffId}`,
    data
  );
  return res.data;
};

export const getDeletedAssociates = async () => {
  const res = await API.get(
    "/admin/deleted/project-associates"
  );
  return res.data;
};