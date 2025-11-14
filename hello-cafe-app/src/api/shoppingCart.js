import api from "./index";

// Shopping Cart API functions
const shoppingCartAPI = {
  // Get shopping cart list
  getCart: () => {
    return api.get("/user/shoppingCart/list");
  },

  // Add item to shopping cart
  addItem: (menuItemId, flavor = null, comboId = null) => {
    return api.post("/user/shoppingCart/add", {
      menuItemId,
      comboId,
      flavor,
    });
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

export default shoppingCartAPI;