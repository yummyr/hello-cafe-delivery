import api from './index';

export const favoritesAPI = {
  // 切换收藏状态
  toggleFavorite: (favoriteData) => {
    return api.post('/favorites/toggle', favoriteData);
  },

  // 检查收藏状态
  checkFavoriteStatus: (itemType, itemId) => {
    return api.get('/favorites/status', {
      params: { itemType, itemId }
    });
  },

  // 获取用户收藏列表
  getUserFavorites: () => {
    return api.get('/favorites/list');
  },

  // 清空收藏
  clearFavorites: () => {
    return api.delete('/favorites/clear');
  }
};