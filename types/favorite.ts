import { CommonResponse, StationInfo } from './common';

export type AddFavoriteRequest = {
  stationId: number;
};

export type DeleteFavoriteRequest = AddFavoriteRequest;

export type MyFavoriteResponse = CommonResponse<{
  favoriteId: number;
  stations: StationInfo[];
}>;
