export interface CongestionInfo {
  level: string | null; 
  rate: number | null;  
}

export interface StationInfo {
  stationId: number;
  stationName: string;
  line: string;
  congestion?: CongestionInfo;
}

export interface RouteStep {
  startStation: StationInfo;
  endStation: StationInfo;
  line: string;
  duration: number;     // 해당 구간 소요시간 (분 단위)
  distance: number;     // 해당 구간 거리 (미터 단위)
}

export interface PathResult {
  totalTime: number;        // 전체 소요 시간 (분)
  totalDistance: number;    // 전체 거리 (미터)
  steps: RouteStep[];       // 경로의 각 구간
}
