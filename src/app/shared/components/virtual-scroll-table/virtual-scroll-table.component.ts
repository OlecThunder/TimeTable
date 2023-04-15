import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Inject } from '@angular/core';
import { map, Observable, of, combineLatest } from 'rxjs';
import { TableVirtualScrollStrategy } from '../../services/table-vs-strategy.service';

@Component({
  selector: 'app-virtual-scroll-table',
  templateUrl: './virtual-scroll-table.component.html',
  styleUrls: ['./virtual-scroll-table.component.scss'],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: TableVirtualScrollStrategy,
  }],
})

export class VirtualScrollTableComponent implements OnInit, OnChanges {
  @Input() public tableData: { [key: string]: string }[] = [];
  @Input() public columnsToDisplay: string[] = [];

  @Output() onContentRendering = new EventEmitter();

  private BUFFER_SIZE = 3;
  private ROW_HEIGHT = 52;
  private HEADER_HEIGHT = 56;
  private range = 0;

  public GRID_HEIGHT = 600;
  public startWidth: number = 0;
  public widthLimit: number = 25;
  public endWidth: number = 0;
  public tableColumns: string[];

  public dataSource: Observable<{ [key: string]: string }[]>;

  constructor(@Inject(VIRTUAL_SCROLL_STRATEGY) private readonly scrollStrategy: TableVirtualScrollStrategy) {
    this.range = Math.ceil(this.GRID_HEIGHT / this.ROW_HEIGHT) + this.BUFFER_SIZE;
    this.tableColumns = [];
  }

  ngOnInit() {
    this.scrollStrategy.setScrollHeight(this.ROW_HEIGHT, this.HEADER_HEIGHT);
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.onTableDataChange();
    }

    if (changes['columnsToDisplay']) {
      this.onColumnsChange();
    }
  }

  private onTableDataChange(): void {
    this.dataSource = combineLatest([of(this.tableData), this.scrollStrategy.scrolledIndexChange]).pipe(
      map((value: any) => {
        const start = Math.max(0, value[1] - this.BUFFER_SIZE);
        const end = Math.min(value[0].length, value[1] + this.range);

        return value[0].slice(start, end);
      })
    );
  }

  private onColumnsChange(): void {
    this.startWidth = 0;
    this.endWidth = 25;
    this.tableColumns = this.getTableColumns(this.startWidth, this.endWidth);
    this.updateWidthIndex();
  }

  public updateTableOnHorizontalScroll(event: any): void {
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
}

