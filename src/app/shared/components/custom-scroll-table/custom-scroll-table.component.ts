import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-custom-scroll-table',
  templateUrl: './custom-scroll-table.component.html',
  styleUrls: ['./custom-scroll-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomScrollTableComponent implements OnInit, OnChanges {
  @Input() public tableData: { [key: string]: string }[] = [];
  @Input() public columnsToDisplay: string[] = [];

  @ViewChild('table', { static: true }) table: ElementRef;

  @Output() onContentRendering = new EventEmitter();

  public tableDataSource: MatTableDataSource<{ [key: string]: string }>;
  public tableColumns: string[] = [];

  public start: number = 0;
  public limit: number = 15;
  public end: number = this.limit + this.start;

  public startWidth: number = 0;
  public widthLimit: number = 25;
  public endWidth: number = 0;

  constructor() {
    this.tableDataSource = new MatTableDataSource();
  }
  
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.start = 0;
      this.end = 15;
      this.tableDataSource.data = this.getTableData(this.start, this.end);
      this.updateIndex();
    }

    if (changes['columnsToDisplay']) {
      this.startWidth = 0;
      this.endWidth = 25;
      this.tableColumns = this.getTableColumns(this.startWidth, this.endWidth);
      this.updateWidthIndex();
    }
  }

  public onTableScroll(event: any): void {
    this.updateTableOnHorizontalScroll(event);
    this.updateTableOnVerticalScroll(event);
  }

  private updateTableOnHorizontalScroll(event: any): void {
    const tableViewWidth = event.target.offsetWidth;
    const tableScrollWidth = event.target.scrollWidth;
    const scrollLocation = event.target.scrollLeft;

    const buffer = 200;
    const widthLimit = tableScrollWidth - tableViewWidth - buffer;

    if (scrollLocation > widthLimit) {
      let columns = this.getTableColumns(this.startWidth, this.endWidth)
      this.tableColumns = [...this.tableColumns, ...columns];
      this.updateWidthIndex();
    }
  }
  
  private getTableColumns(start: number, end: number): string[] {
    return this.columnsToDisplay.filter((value, index) => index >= start && index < end);
  }

  public updateWidthIndex(): void {
    this.startWidth = this.endWidth;
    this.endWidth = this.widthLimit + this.startWidth;
  }

  private updateTableOnVerticalScroll(event: any): void {
    const tableViewHeight = event.target.offsetHeight;
    const tableScrollHeight = event.target.scrollHeight;
    const scrollLocation = event.target.scrollTop;

    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      let data = this.getTableData(this.start, this.end);
      this.tableDataSource.data = this.tableDataSource.data.concat(data);
      this.updateIndex();
    }
  }

  private getTableData(start: number, end: number): { [key: string]: string }[] {
    return this.tableData.filter((value, index) => index >= start && index < end);
  }

  private updateIndex(): void {
    this.start = this.end;
    this.end = this.limit + this.start;
  }
}

