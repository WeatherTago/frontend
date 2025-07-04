import { CommonResponse, StationInfo } from './common';

export type Station = {
  stationName: string;
  stationLine: string;
};

export type AddFavoriteRequest = Station;

export type DeleteFavoriteRequest = Station;

export type MyFavoriteResponse = CommonResponse<{
  faviroteId: number;
  stations: StationInfo[];
}>;
