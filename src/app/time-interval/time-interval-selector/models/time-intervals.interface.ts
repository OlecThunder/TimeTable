export interface TimeIntervals {
  readonly label: string;
  readonly value: number;
}

export interface IntervalsTableDataResponse {
  readonly data: { [key: string]: string }[];
  readonly columns: string[];
}
