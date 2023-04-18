import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { generateMockTableData } from '../../shared/utils';
import { IntervalsTableDataResponse } from '../time-interval-selector';

@Injectable({
  providedIn: 'root',
})
export class TimeIntervalsService {
  private defaultAmmountOfTableItems = 100;

  public getTableDataForInterval(
    interval: number,
    itemsAmmount: number = this.defaultAmmountOfTableItems
  ): Observable<IntervalsTableDataResponse> {
    return of(generateMockTableData(itemsAmmount, interval));
  }
}
