import { CommonResponse, StationInfo } from './common';

export type StationInfoResponse = CommonResponse<StationInfo[]>;

export interface CongestionInfo {
  congestionScore: number;
  congestionLevel: string;
}

export interface DirectionCongestionInfo {
  stationId: number;
  congestion: CongestionInfo;
}

export interface WeatherInfo {
  tmp: number;
  reh: number;
  pcp: number;
  wsd: number;
  sno: number;
  vec: number;
  status: string;
}

export interface StationResult {
  stationId: number;
  name: string;
  line: string;
  stationCode: string;
  direction: string;
  weather: WeatherInfo | null;
  congestionByDirection: {
    [key in '상행' | '하행' | '외선' | '내선']?: DirectionCongestionInfo;
  };
  createdAt: string;
}

export type SearchStationResponse = CommonResponse<StationResult>;
