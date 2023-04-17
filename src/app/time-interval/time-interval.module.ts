import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { VirtualScrollTableModule } from '../shared/components/virtual-scroll-table/virtual-scroll-table.module';
import { TimeIntervalSelectorComponent } from '../time-interval-selector/time-interval-selector.component';
import { TimeIntervalRoutingModule } from './time-interval-routing.module';
import { TimeIntervalComponent } from './time-interval.component';

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
  ],
  providers: [],
})
export class TimeIntervalModule { }
