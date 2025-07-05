import { axiosInstance } from '@/apis/axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface StationInfo {
  stationId: number;
  stationName: string;
  stationLine: string;
}

interface StationContextType {
  stations: StationInfo[];
  loading: boolean;
  getStationIdByNameAndLine: (name: string, line: string) => number | null;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export const StationProvider = ({ children }: { children: React.ReactNode }) => {
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationInfo = async () => {
      try {
        const response = await axiosInstance.get('/api/station/info');
        setStations(response.data.result);
      } catch (error) {
        console.error('🚨 역 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationInfo();
  }, []);

  // 🔍 헬퍼 함수
  const getStationIdByNameAndLine = (name: string, line: string): number | null => {
    const found = stations.find(
      (station) => station.stationName === name && station.stationLine === line
    );
    return found?.stationId ?? null;
  };

  return (
    <StationContext.Provider value={{ stations, loading, getStationIdByNameAndLine }}>
      {children}
    </StationContext.Provider>
  );
};

// 커스텀 훅
export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) throw new Error('useStationContext must be used within a StationProvider');
  return context;
};
