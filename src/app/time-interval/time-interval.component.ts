import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, Subject, switchMap, tap, takeUntil, BehaviorSubject } from 'rxjs';
import { IntervalsTableDataResponse } from '../time-interval-selector/models/time-intervals.interface';
import { TimeIntervalsService } from './services/time-interval.service';

@Component({
  selector: 'app-time-interval',
  templateUrl: './time-interval.component.html',
  styleUrls: ['./time-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIntervalComponent implements OnInit, OnDestroy {
  public timeIntervalControl: FormControl<number>;
  public tableData$: BehaviorSubject<{ [key: string]: string }[]>;
  public tableColumns: string[];

  private onDestroy$: Subject<void>;

  // Temporary for measurements
  private timer: number;

  constructor(private timeIntervalsService: TimeIntervalsService, private cdr: ChangeDetectorRef) {
    this.timer = 0;
    this.tableColumns = [];
    this.timeIntervalControl = new FormControl();
    this.tableData$ = new BehaviorSubject<{ [key: string]: string }[]>([]);
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.subscribeOnIntervalChange();
    this.timeIntervalControl.setValue(5);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private subscribeOnIntervalChange(): void {
    this.timeIntervalControl.valueChanges
      .pipe(
        filter(Boolean),
        tap(() => {
          this.timer = performance.now()
        }),
        switchMap((interval: number) => this.timeIntervalsService.getTableDataForInterval(interval)),
        takeUntil(this.onDestroy$)
      ).subscribe(({data, columns}: IntervalsTableDataResponse) => {
        this.tableData$.next(data);
        this.tableColumns = columns;
        this.cdr.markForCheck();
      })
  }

  // Temporary for measurements
  public renderingFinished(): void {
    const time = performance.now() - this.timer;
    console.log('Timer:', 'Rendering', 'finished in', Math.round(time), 'ms');
  }
}
