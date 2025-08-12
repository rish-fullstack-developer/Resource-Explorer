import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/types/api';

const STORAGE_KEY = 'resource-explorer-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  // Toggle favorite status for a character
  const toggleFavorite = useCallback((character: Character) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      if (newFavorites[character.id]) {
        delete newFavorites[character.id];
      } else {
        newFavorites[character.id] = true;
      }
      return newFavorites;
    });
  }, []);

  // Check if a character is favorited
  const isFavorite = useCallback(
    (id: number) => !!favorites[id],
    [favorites]
  );

  // Get all favorite character IDs
  const getFavoriteIds = useCallback(
    () => Object.keys(favorites).map(Number),
    [favorites]
  );

  // Filter an array of characters to only include favorites
  const filterFavorites = useCallback(
    (characters: Character[]) => characters.filter((char) => isFavorite(char.id)),
    [isFavorite]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteIds,
    filterFavorites,
    isLoaded,
  };
}