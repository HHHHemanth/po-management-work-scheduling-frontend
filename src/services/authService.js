import API from "./api";

export const changePassword = async (data) => {
  const res = await API.put("/change-password", data);
  return res.data;
};