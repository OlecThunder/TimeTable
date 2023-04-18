import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimeIntervals, TimeIntervalsOptions } from './models';

@Component({
  selector: 'app-time-interval-selector',
  templateUrl: './time-interval-selector.component.html',
  styleUrls: ['./time-interval-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeIntervalSelectorComponent {
  @Input() timeIntervalControl = new FormControl({ value: 5, disabled: false });

  public availableTimeIntervals: TimeIntervals[] = TimeIntervalsOptions;
}
