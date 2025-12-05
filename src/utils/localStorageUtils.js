//FOR VENUE FAVORITES

export const favoritesStorage = {
  // Get favorites for current user
  getFavorites: (userId) => {
    try {
      const key = `favorites_${userId}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  },

  // Save favorites for current user
  saveFavorites: (userId, favorites) => {
    try {
      const key = `favorites_${userId}`;
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  },

  // Toggle favorite for user
  toggleFavorite: (userId, venueId) => {
    try {
      const currentFavorites = favoritesStorage.getFavorites(userId);
      const venueIdStr = venueId.toString();
      
      let newFavorites;
      if (currentFavorites.includes(venueIdStr)) {
        newFavorites = currentFavorites.filter(id => id !== venueIdStr);
      } else {
        newFavorites = [...currentFavorites, venueIdStr];
      }
      
      favoritesStorage.saveFavorites(userId, newFavorites);
      return newFavorites;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return favoritesStorage.getFavorites(userId);
    }
  },

  // Check if venue is favorite for user
  isFavorite: (userId, venueId) => {
    try {
      const favorites = favoritesStorage.getFavorites(userId);
      return favorites.includes(venueId.toString());
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }
};