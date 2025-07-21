import { getStationInfo } from '@/apis/station';
import { useAuth } from '@/context/AuthContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchStationInfo = async () => {
      try {
        const response = await getStationInfo();
        setStations(response.result);
      } catch (error) {
        if (__DEV__) {
        console.error('🚨 역 정보 불러오기 실패:', error);
      }
      Alert.alert('역 정보를 불러오지 못했습니다', '인터넷 상태를 확인해 주세요.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStationInfo(); // 로그인된 경우만 실행
    }
  }, [user]);


  const getStationIdByNameAndLine = (name: string, line: string): number | null => {
    const found = stations.find(
      station => station.stationName === name && station.stationLine === line,
    );
    return found?.stationId ?? null;
  };

  return (
    <StationContext.Provider value={{ stations, loading, getStationIdByNameAndLine }}>
      {children}
    </StationContext.Provider>
  );
};


export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) throw new Error('useStationContext must be used within a StationProvider');
  return context;
};
