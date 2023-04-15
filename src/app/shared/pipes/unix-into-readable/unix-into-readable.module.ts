import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { UnixIntoReadablePipe } from './unix-into-readable.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [UnixIntoReadablePipe],
  exports: [UnixIntoReadablePipe]
})
export class UnixIntoReadablePipeModule {}
