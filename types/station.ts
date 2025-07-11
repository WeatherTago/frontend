import { CommonResponse, StationInfo } from './common';

export type StationInfoResponse = CommonResponse<StationInfo[]>;

export interface CongestionInfo {
  level: string | null;
  rate: number | null;
}

export interface WeatherInfo {
  temperature: string;
  condition: string;
}


export interface StationResult {
  name: string;
  line: string;
  stationId: number;
  stationCode: string;
  createdAt: string;
  direction: string | null;
  weather?: {
    tmp?: number;
    pcp?: number;
    reh?: number;
    sno?: number;
    vec?: number;
    wsd?: number;
  };
  congestionByDirection?: {
  [direction: string]: {
    stationId: number;
    congestion: {
      level: string;
      rate: number;
    }; 
  };
};
}


export type SearchStationResponse = CommonResponse<StationResult>;
