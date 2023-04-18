import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { map, Observable, combineLatest, tap, BehaviorSubject } from 'rxjs';
import { TableVirtualScrollStrategy } from '../../services';
import { HorizontalScrollPagination } from './models';

@Component({
  selector: 'app-virtual-scroll-table',
  templateUrl: './virtual-scroll-table.component.html',
  styleUrls: ['./virtual-scroll-table.component.scss'],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: TableVirtualScrollStrategy,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class VirtualScrollTableComponent implements OnInit, OnChanges {
  @Input() public tableData$: BehaviorSubject<{ [key: string]: string }[]>;
  @Input() public columnsToDisplay: string[] = [];

  private BUFFER_SIZE = 3;
  private ROW_HEIGHT = 52;
  private HEADER_HEIGHT = 56;
  private WIDTH_SCROLL_BUFFER = 200;
  public GRID_HEIGHT = 600;

  private verticalScrollRange = Math.ceil(this.GRID_HEIGHT / this.ROW_HEIGHT) + this.BUFFER_SIZE;
  public horizontalScrollData: HorizontalScrollPagination = { start: 0, end: 40, limit: 40 };
  public tableColumns: string[] = [];

  public dataSource: Observable<{ [key: string]: string }[]>;

  constructor(
    @Inject(VIRTUAL_SCROLL_STRATEGY) private readonly scrollStrategy: TableVirtualScrollStrategy,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.scrollStrategy.setScrollHeight(this.ROW_HEIGHT, this.HEADER_HEIGHT);
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData$']) {
      this.onTableDataChange();
    }

    if (changes['columnsToDisplay']) {
      this.onColumnsChange();
    }
  }

  private onTableDataChange(): void {
    this.dataSource = combineLatest([this.tableData$, this.scrollStrategy.scrolledIndexChange]).pipe(
      map((value: [{ [key: string]: string }[], number]) => {
        const start = Math.max(0, value[1] - this.BUFFER_SIZE);
        const end = Math.min(value[0].length, value[1] + this.verticalScrollRange);

        return value[0].slice(start, end);
      }),
      tap(() => this.cdr.detectChanges())
    );
  }

  private onColumnsChange(): void {
    this.horizontalScrollData = { start: 0, end: 40, limit: 40 };
    this.tableColumns = this.getTableColumns();
    this.updateWidthIndex();
  }

  public updateTableOnHorizontalScroll(event: any): void {
    const { offsetWidth, scrollWidth, scrollLeft } = event.target;
    const widthLimit = scrollWidth - offsetWidth - this.WIDTH_SCROLL_BUFFER;

    if (scrollLeft > widthLimit) {
      let columns = this.getTableColumns();
      this.tableColumns = [...this.tableColumns, ...columns];
      this.updateWidthIndex();
    }
  }
  
  private getTableColumns(): string[] {
    return this.columnsToDisplay.filter((_, index) => index >= this.horizontalScrollData.start && index < this.horizontalScrollData.end);
  }

  public updateWidthIndex(): void {
    this.horizontalScrollData.start = this.horizontalScrollData.end;
    this.horizontalScrollData.end = this.horizontalScrollData.limit + this.horizontalScrollData.start;
  }
}
