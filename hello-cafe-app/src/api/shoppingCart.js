import api from "./index";

export const shoppingCartAPI = {
  // Add item to shopping cart
  addItem: (menuItemId, flavor = null, comboId = null) => {
    return api.post("/user/shoppingCart/add", {
      menuItemId,
      comboId, // Combo ID
      flavor,
    });
  },

  // Get shopping cart list
  getCart: () => {
    return api.get("/user/shoppingCart/list");
  },

  // Remove item from shopping cart
  removeItem: (menuItemId, flavor = null, comboId = null) => {
    return api.post("/user/shoppingCart/sub", {
      menuItemId,
      comboId,
      flavor,
    });
  },

  // Clear shopping cart
  clearCart: () => {
    return api.delete("/user/shoppingCart/clean");
  },
};