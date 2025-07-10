export interface ElevatorItem {
  stnNm: string;
  fcltNm: string;
  oprtngSitu: string;
  dtlPstn:string;
}
export interface EscalatorItem {
  stnNm: string;
  fcltNm: string;
  oprtngSitu: string;
  bgngFlrDtlPstn: string;
  endFlrDtlPstn: string;
}

export interface LiftItem {
  fcltNm: string;
  stnNm: string;
  limitWht: string;
  bgngFlrDtlPstn: string;
  endFlrDtlPstn: string;
  oprtngSitu: string;
}

export interface WalkwayItem {
  fcltNm: string;
  stnNm: string;
  bgngFlrDtlPstn: string;
  endFlrDtlPstn: string;
  oprtngSitu: string;
}