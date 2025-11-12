import api from "./index";

export const combosAPI = {
  // 获取所有活跃的套餐
  getAllCombos: () => {
    return api.get("/user/combo/all");
  },

  // 根据分类ID获取套餐
  getCombosByCategory: (categoryId) => {
    return api.get(`/user/combo/list?categoryId=${categoryId}`);
  },

  // 获取套餐包含的菜品
  getComboMenuItems: (comboId) => {
    return api.get(`/user/combo/menu_item/${comboId}`);
  },
};