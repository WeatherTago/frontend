import { myFavorite } from '@/apis/favorite';
import { StationInfo } from '@/types/common';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type FavoriteContextType = {
  favoriteStationIds: number[];
  toggleFavorite: (stationId: number) => void;
  isFavorite: (stationId: number) => boolean;
  isLoading: boolean;
};

const FavoriteContext = createContext<FavoriteContextType | null>(null);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriteStationIds, setFavoriteStationIds] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(true);
  const { user } = useAuth();

  const toggleFavorite = (stationId: number) => {
    setFavoriteStationIds(prev =>
      prev.includes(stationId) ? prev.filter(id => id !== stationId) : [...prev, stationId],
    );
  };

  const isFavorite = (stationId: number) => favoriteStationIds.includes(stationId);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await myFavorite();
        const ids = res.result.stations.map((station: StationInfo) => station.stationId);
        setFavoriteStationIds(ids);
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <FavoriteContext.Provider value={{ favoriteStationIds, toggleFavorite, isFavorite, isLoading }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorite must be used within FavoriteProvider');
  return context;
};
