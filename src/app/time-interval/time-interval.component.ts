import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, Subject, switchMap, takeUntil, BehaviorSubject, startWith } from 'rxjs';
import { TimeIntervalsService } from './services';
import { IntervalsTableDataResponse } from './time-interval-selector';

@Component({
  selector: 'app-time-interval',
  templateUrl: './time-interval.component.html',
  styleUrls: ['./time-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeIntervalComponent implements OnInit, OnDestroy {
  public timeIntervalControl = new FormControl({ value: 5, disabled: false });
  public tableData$: BehaviorSubject<{ [key: string]: string }[]>;
  public tableColumns: string[];

  private onDestroy$: Subject<void>;

  constructor(private timeIntervalsService: TimeIntervalsService) {
    this.tableColumns = [];
    this.tableData$ = new BehaviorSubject<{ [key: string]: string }[]>([]);
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.subscribeOnIntervalChange();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private subscribeOnIntervalChange(): void {
    this.timeIntervalControl.valueChanges
      .pipe(
        startWith(5),
        filter(Boolean),
        switchMap((interval: number) => this.timeIntervalsService.getTableDataForInterval(interval)),
        takeUntil(this.onDestroy$)
      )
      .subscribe(({ data, columns }: IntervalsTableDataResponse) => {
        this.tableData$.next(data);
        this.tableColumns = columns;
      });
  }
}
