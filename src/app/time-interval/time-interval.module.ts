import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TimeIntervalRoutingModule } from './time-interval-routing.module';
import { TimeIntervalComponent } from './time-interval.component';
import { VirtualScrollTableModule } from '../shared/components/virtual-scroll-table';
import { TimeIntervalSelectorComponent } from './time-interval-selector';

@NgModule({
  declarations: [
    TimeIntervalComponent,
    TimeIntervalSelectorComponent
  ],
  imports: [
    CommonModule,
    TimeIntervalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    VirtualScrollTableModule
  ]
})
export class TimeIntervalModule { }
