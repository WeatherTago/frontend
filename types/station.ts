export interface CongestionInfo {
  level: string | null;
  rate: number | null;
}

export interface WeatherInfo {
  temperature: string;
  condition: string;
}

export interface StationResult {
  stationId: number;
  name: string;
  line: string;
  stationCode: string;
  weather?: WeatherInfo;
  congestion: CongestionInfo;
  createdAt: string;
}
