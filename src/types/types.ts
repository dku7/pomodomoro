export type IntervalType = "Work" | "Short Break" | "Long Break";
export type SettingsButtonType = "Add" | "Minus";
export type TimerStatusType = "Not Started" | "Started" | "Paused";

export interface TimePartsType {
  min: number;
  sec: number;
}

export interface TimerType {
  seconds: number;
  intervalType: IntervalType;
  sessions: number;
  status: TimerStatusType;
}
