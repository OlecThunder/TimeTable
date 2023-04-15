import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IntervalsTableDataResponse } from '../../time-interval-selector/models/time-intervals.interface';
import { generateMockTableData } from '../../shared/utils/table-data-mock-generator';

@Injectable({
  providedIn: 'root'
})
export class TimeIntervalsService {
  private defaultAmmountOfTableItems: number;

  constructor() {
    this.defaultAmmountOfTableItems = 100;
  }

  public getTableDataForInterval(interval: number, itemsAmmount: number = this.defaultAmmountOfTableItems): Observable<IntervalsTableDataResponse> {
    return of(generateMockTableData(itemsAmmount, interval));
  }
}
