import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {MatTableModule} from '@angular/material/table';
import { UnixIntoReadablePipeModule } from "../../pipes/unix-into-readable/unix-into-readable.module";
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CustomScrollTableComponent } from "./custom-scroll-table.component";

@NgModule({
    declarations: [CustomScrollTableComponent],
    exports: [CustomScrollTableComponent],
    imports: [CommonModule, MatTableModule, UnixIntoReadablePipeModule, ScrollingModule]
})
export class CustomScrollTableModule {}