import { popularStationList, stationList } from '@/constants/stations';
import React, { createContext, useContext, useState } from 'react';

export type Station = {
  stationId: string;
  stationName: string;
  stationLine: string;
};

type FavoriteContextType = {
  stationList: Station[];
  popularStationList: Station[];
  favoriteStationIds: string[];
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | null>(null);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriteStationIds, setFavoriteStationIds] = useState<string[]>([]);

  const toggleFavorite = (stationId: string) => {
    setFavoriteStationIds(prev =>
      prev.includes(stationId) ? prev.filter(id => id !== stationId) : [...prev, stationId],
    );
  };

  const isFavorite = (stationId: string) => favoriteStationIds.includes(stationId);

  return (
    <FavoriteContext.Provider
      value={{ stationList, popularStationList, favoriteStationIds, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorite must be used within FavoriteProvider');
  return context;
};
