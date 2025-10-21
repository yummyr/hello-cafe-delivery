import api from "./index";

export const login = (username, password, role) => {
  return api.post("/auth/login", { username, password, role });
};
export const register = (data) => {
  return api.post("/auth/register", data);
};

