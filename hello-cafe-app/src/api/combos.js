import api from "./index";

export const combosAPI = {
  // Get all active combos
  getAllCombos: () => {
    return api.get("/user/combo/all");
  },

  // Get combos by category ID
  getCombosByCategory: (categoryId) => {
    return api.get(`/user/combo/list?categoryId=${categoryId}`);
  },

  // Get combo menu items
  getComboMenuItems: (comboId) => {
    return api.get(`/user/combo/menu_item/${comboId}`);
  },
};