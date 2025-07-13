import { CommonResponse } from './common';

export type AlarmPeriodType =
  | 'EVERYDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type AlarmDayType = 'TODAY' | 'YESTERDAY';

export type AlarmBase = {
  stationName: string;
  stationLine: string;
  direction: string;
  referenceTime: string;
  alarmPeriod: AlarmPeriodType;
  alarmDay: AlarmDayType;
  alarmTime: string;
};

export type Alarm = AlarmBase;

export type CreatedAlarm = AlarmBase & {
  alarmId: number;
};

export type ReadAlarmResponse = CommonResponse<Alarm[]>;

export type CreateAlarmRequest = AlarmBase;

export type CreateAlarmResponse = CommonResponse<CreatedAlarm>;

export type DeleteAlarmRequest = {
  alarmId: number;
};

export type DeleteAlarmResponse = CommonResponse<{}>;

export type UpdateAlarmRequest = AlarmBase & {
  alarmId: number;
};

export type UpdateAlarmResponse = CommonResponse<{}>;
