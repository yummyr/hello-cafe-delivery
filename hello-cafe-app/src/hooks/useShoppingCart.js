import { useState, useEffect, useCallback } from "react";
import shoppingCartAPI from "../api/shoppingCart";

// Create a global shopping cart state
let globalCartState = {
  itemCount: 0,
  listeners: [],
  updateCount: function(newCount) {
    this.itemCount = newCount;
    this.listeners.forEach(listener => listener(newCount));
  },
  addListener: function(listener) {
    this.listeners.push(listener);
    // Trigger immediately to let component get current state
    listener(this.itemCount);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

export const useShoppingCart = () => {
  const [itemCount, setItemCount] = useState(0);

  // Get shopping cart count
  const fetchCartCount = useCallback(async () => {
    try {
      const response = await shoppingCartAPI.getCart();
      if (response.data.code === 1 && response.data.data) {
        const items = response.data.data;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        globalCartState.updateCount(totalItems);
        return totalItems;
      }
      return 0;
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      return 0;
    }
  }, []);

  // Update shopping cart count (called when adding/removing items)
  const updateCartCount = useCallback(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    // Listen for global state changes
    const unsubscribe = globalCartState.addListener(setItemCount);

    // Get shopping cart count on initialization
    fetchCartCount();

    return unsubscribe;
  }, [fetchCartCount]);

  return {
    itemCount,
    fetchCartCount,
    updateCartCount
  };
};

// Export a function for other components to call, used to refresh shopping cart count
export const refreshCartCount = async () => {
  try {
    const response = await shoppingCartAPI.getCart();
    if (response.data.code === 1 && response.data.data) {
      const items = response.data.data;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      globalCartState.updateCount(totalItems);
    } else {
      // If fetch fails, set to 0
      globalCartState.updateCount(0);
    }
  } catch (error) {
    console.error("Failed to refresh cart count:", error);
    // Set to 0 on error
    globalCartState.updateCount(0);
  }
};