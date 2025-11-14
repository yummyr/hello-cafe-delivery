import api from './index';

// Favorites API functions
const favoritesAPI = {
  // Toggle favorite status
  toggleFavorite: (favoriteData) => {
    return api.post('user/favorites/toggle', favoriteData);
  },

  // Check favorite status
  checkFavoriteStatus: (itemType, itemId) => {
    return api.get('user/favorites/status', {
      params: { itemType, itemId }
    });
  },

  // Get user favorites list
  getUserFavorites: () => {
    return api.get('user/favorites/list');
  },

  // Clear favorites
  clearFavorites: () => {
    return api.delete('user/favorites/clear');
  }
};

export default favoritesAPI;