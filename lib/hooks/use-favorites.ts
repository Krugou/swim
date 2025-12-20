'use client';

import { useState, useEffect } from 'react';

export interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (hallName: string) => boolean;
  toggleFavorite: (hallName: string) => void;
  clearFavorites: () => void;
}

const FAVORITES_KEY = 'swimming-halls-favorites';

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }
  }, [favorites, isInitialized]);

  const isFavorite = (hallName: string): boolean => {
    return favorites.includes(hallName);
  };

  const toggleFavorite = (hallName: string): void => {
    setFavorites((prev) =>
      prev.includes(hallName) ? prev.filter((name) => name !== hallName) : [...prev, hallName]
    );
  };

  const clearFavorites = (): void => {
    setFavorites([]);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
