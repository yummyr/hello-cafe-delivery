import { useState, useEffect, useCallback } from "react";
import { shoppingCartAPI } from "../api/shoppingCart";

// 创建一个全局的购物车状态
let globalCartState = {
  itemCount: 0,
  listeners: [],
  updateCount: function(newCount) {
    this.itemCount = newCount;
    this.listeners.forEach(listener => listener(newCount));
  },
  addListener: function(listener) {
    this.listeners.push(listener);
    // 立即触发一次，让组件获取当前状态
    listener(this.itemCount);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

export const useShoppingCart = () => {
  const [itemCount, setItemCount] = useState(0);

  // 获取购物车数量
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

  // 更新购物车数量（添加/删除商品时调用）
  const updateCartCount = useCallback(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    // 监听全局状态变化
    const unsubscribe = globalCartState.addListener(setItemCount);

    // 初始化时获取购物车数量
    fetchCartCount();

    return unsubscribe;
  }, [fetchCartCount]);

  return {
    itemCount,
    fetchCartCount,
    updateCartCount
  };
};

// 导出一个函数供其他组件调用，用于刷新购物车数量
export const refreshCartCount = async () => {
  try {
    const response = await shoppingCartAPI.getCart();
    if (response.data.code === 1 && response.data.data) {
      const items = response.data.data;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      globalCartState.updateCount(totalItems);
    } else {
      // 如果获取失败，设为0
      globalCartState.updateCount(0);
    }
  } catch (error) {
    console.error("Failed to refresh cart count:", error);
    // 出错时设为0
    globalCartState.updateCount(0);
  }
};