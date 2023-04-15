import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimeIntervalsOptions } from './models/time-interval.constants';
import { TimeIntervals } from './models/time-intervals.interface';

@Component({
  selector: 'app-time-interval-selector',
  templateUrl: './time-interval-selector.component.html',
  styleUrls: ['./time-interval-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIntervalSelectorComponent {
  @Input() timeIntervalControl: FormControl<number> = new FormControl();

  public availableTimeIntervals: TimeIntervals[];

  constructor() {
    this.availableTimeIntervals = TimeIntervalsOptions;
  }
}
