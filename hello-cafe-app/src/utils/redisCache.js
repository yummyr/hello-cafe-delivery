// Redis缓存工具类
class RedisCache {
  constructor() {
    this.baseURL = process.env.REACT_APP_REDIS_API_URL || 'http://localhost:8080/api/redis';
  }

  // 获取Redis缓存
  async get(key) {
    try {
      const response = await fetch(`${this.baseURL}/get?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.code === 1 ? data.data : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  // 设置Redis缓存
  async set(key, value, ttl = 3600) {
    try {
      const response = await fetch(`${this.baseURL}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value: JSON.stringify(value),
          ttl
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.code === 1;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  // 删除Redis缓存
  async delete(key) {
    try {
      const response = await fetch(`${this.baseURL}/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.code === 1;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  // 检查Redis缓存是否存在
  async exists(key) {
    try {
      const response = await fetch(`${this.baseURL}/exists?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.code === 1 ? data.data : false;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  // 获取购物车缓存
  async getShoppingCart(userId) {
    const cartKey = `cart:user:${userId}`;
    const cartData = await this.get(cartKey);
    return cartData ? JSON.parse(cartData) : null;
  }

  // 设置购物车缓存
  async setShoppingCart(userId, cartData, ttl = 1800) {
    const cartKey = `cart:user:${userId}`;
    return await this.set(cartKey, cartData, ttl);
  }

  // 删除购物车缓存
  async deleteShoppingCart(userId) {
    const cartKey = `cart:user:${userId}`;
    return await this.delete(cartKey);
  }

  // 更新购物车商品数量
  async updateCartItemQuantity(userId, itemId, quantity) {
    const cart = await this.getShoppingCart(userId) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      await this.setShoppingCart(userId, cart);
      return true;
    }
    return false;
  }

  // 添加商品到购物车缓存
  async addItemToCart(userId, item) {
    const cart = await this.getShoppingCart(userId) || [];
    const existingItem = cart.find(cartItem =>
      cartItem.dishId === item.dishId &&
      cartItem.setmealId === item.setmealId &&
      cartItem.flavor === item.flavor
    );

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.push({
        ...item,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString()
      });
    }

    return await this.setShoppingCart(userId, cart);
  }
}

export default new RedisCache();