import api from "./index";

export const shoppingCartAPI = {
  // 添加商品到购物车
  addItem: (menuItemId, flavor = null, comboId = null) => {
    return api.post("/user/shoppingCart/add", {
      menuItemId,
      comboId, // 套餐ID
      flavor,
    });
  },

  // 获取购物车列表
  getCart: () => {
    return api.get("/user/shoppingCart/list");
  },

  // 减少购物车中的商品
  removeItem: (menuItemId, flavor = null, comboId = null) => {
    return api.post("/user/shoppingCart/sub", {
      menuItemId,
      comboId,
      flavor,
    });
  },

  // 清空购物车
  clearCart: () => {
    return api.delete("/user/shoppingCart/clean");
  },
};