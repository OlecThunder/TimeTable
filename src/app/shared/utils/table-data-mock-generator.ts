import * as dayjs from 'dayjs';
import { IntervalsTableDataResponse } from '../../time-interval';

export function generateMockTableData(
  dataPointsAmmount = 50,
  timeRange: number,
  timeUnits: dayjs.ManipulateType = 'minute'
): IntervalsTableDataResponse {
  const startOfNextDay = dayjs().startOf('day').add(1, 'day');
  const columnsNames: string[] = [];
  const tableDataPoints: { [key: string]: string }[] = [];

  for (
    let startTime = dayjs().startOf('day').add(timeRange, timeUnits);
    startTime.isBefore(startOfNextDay);
    startTime = startTime.add(timeRange, timeUnits)
  ) {
    columnsNames.push(startTime.unix().toString());
  }

  for (let rowIndex = 0; rowIndex < dataPointsAmmount; rowIndex++) {
    const rowData = columnsNames.reduce((acc, columnName) => {
      acc[columnName] = `Detail ${rowIndex + 1}`;
      return acc;
    }, {} as { [key: string]: string });

    tableDataPoints.push(rowData);
  }

  return {
    data: tableDataPoints,
    columns: columnsNames,
  };
}
