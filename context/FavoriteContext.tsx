import React, { createContext, useContext, useState } from 'react';

export type SmallThumbnailProps = {
  isFavorite?: boolean;
  stationName: string;
  stationLine: string;
};

const initialStations: SmallThumbnailProps[] = [
  { stationName: '강남', stationLine: '2호선', isFavorite: false },
  { stationName: '홍대입구', stationLine: '2호선', isFavorite: false },
  { stationName: '서울역', stationLine: '1호선', isFavorite: false },
  { stationName: '사당', stationLine: '2호선', isFavorite: false },
  { stationName: '잠실', stationLine: '2호선', isFavorite: false },
  { stationName: '신림', stationLine: '2호선', isFavorite: false },
  { stationName: '건대입구', stationLine: '2호선', isFavorite: false },
  { stationName: '동대문역사문화공원', stationLine: '2호선', isFavorite: false },
  { stationName: '왕십리', stationLine: '2호선', isFavorite: false },
];

const FavoriteContext = createContext<{
  stations: SmallThumbnailProps[];
  toggleFavorite: (index: number) => void;
} | null>(null);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [stations, setStations] = useState<SmallThumbnailProps[]>(initialStations);

  const toggleFavorite = (index: number) => {
    setStations(prev =>
      prev.map((station, i) =>
        i === index ? { ...station, isFavorite: !station.isFavorite } : station,
      ),
    );
  };

  return (
    <FavoriteContext.Provider value={{ stations, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorite must be used within FavoriteProvider');
  return context;
};
