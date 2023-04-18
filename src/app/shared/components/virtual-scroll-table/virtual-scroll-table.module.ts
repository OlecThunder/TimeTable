import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { VirtualScrollTableComponent } from './virtual-scroll-table.component';
import { UnixIntoReadablePipeModule } from '../../pipes/unix-into-readable';
import { TableVirtualScrollStrategy } from '../../services';

@NgModule({
  declarations: [
    VirtualScrollTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    ScrollingModule,
    CdkTableModule,
    UnixIntoReadablePipeModule
  ],
  providers: [
    TableVirtualScrollStrategy
  ],
  exports: [
    VirtualScrollTableComponent
  ]
})
export class VirtualScrollTableModule { }
