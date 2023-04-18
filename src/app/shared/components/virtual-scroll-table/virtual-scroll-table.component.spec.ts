import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatRowHarness, MatTableHarness } from '@angular/material/table/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BehaviorSubject } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { VirtualScrollTableComponent } from './virtual-scroll-table.component';
import { UnixIntoReadablePipeModule } from '../../pipes/unix-into-readable';
import { TableVirtualScrollStrategy } from '../../services';
import { generateMockTableData } from '../../utils';
import { IntervalsTableDataResponse } from '../../../time-interval';
import { scrollEventMockWithoutReload, scrollEventMockWithReload } from '../../../test/mocks';

describe('VirtualScrollTableComponent', () => {
  let component: VirtualScrollTableComponent;
  let fixture: ComponentFixture<VirtualScrollTableComponent>;
  let loader: HarnessLoader;
  let table: MatTableHarness;
  let inputData: IntervalsTableDataResponse;
  let tableVirtualScrollStrategy: TableVirtualScrollStrategy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualScrollTableComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        ScrollingModule,
        CdkTableModule,
        UnixIntoReadablePipeModule
      ],
      providers: [{
        provide: VIRTUAL_SCROLL_STRATEGY,
        useClass: TableVirtualScrollStrategy,
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualScrollTableComponent);
    component = fixture.componentInstance;
    tableVirtualScrollStrategy = TestBed.inject(VIRTUAL_SCROLL_STRATEGY) as TableVirtualScrollStrategy;

    inputData = generateMockTableData(100, 5);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('Should render correct ammount and content of table rows and columns on initial render', async () => {
    component.columnsToDisplay = inputData.columns;
    component.tableData$ = new BehaviorSubject<{ [key: string]: string }[]>([]);
    component.ngOnChanges({
      columnsToDisplay: new SimpleChange([], inputData.columns, false),
      tableData$: new SimpleChange(null, new BehaviorSubject([]), true),
    });
    
    component.tableData$.next(inputData.data);
    tableVirtualScrollStrategy.indexChange.next(0);

    table = await loader.getHarness(MatTableHarness.with({ selector : '.table' }));

    const headerRowsHarnesses = await table.getHeaderRows();
    const allVisibleRowsHarnesses = await table.getRows();
    const allVisibleRows = await Promise.all(allVisibleRowsHarnesses.map((rowHarness: MatRowHarness) => rowHarness.getCellTextByColumnName()));
    const allVisibleRowsWithColumns = await Promise.all(allVisibleRowsHarnesses.map((rowHarness: MatRowHarness) => rowHarness.getCells()));
    const firstColumnInsideFirstRow = Object.values(allVisibleRows[0])[0];

    expect(headerRowsHarnesses.length).toBe(1);
    expect(allVisibleRows.length).toBe(15);
    expect(firstColumnInsideFirstRow).toBe('Detail 1');
    expect(allVisibleRowsWithColumns[0].length).toBe(40);
  });

  it('Should get table columns and update indexes on columns change', () => {
    const getTableDataSpy = spyOn(component as any, 'getTableColumns').and.callThrough();
    const updateWidthIndexSpy = spyOn(component as any, 'updateWidthIndex').and.callThrough();

    component.columnsToDisplay = inputData.columns;
    component.ngOnChanges({
      columnsToDisplay: new SimpleChange([], inputData.columns, false),
    });
    fixture.detectChanges();

    expect(component.tableColumns.length).toBe(40);
    expect(getTableDataSpy).toHaveBeenCalledTimes(1);
    expect(updateWidthIndexSpy).toHaveBeenCalledTimes(1);
  });

  describe("Columns workflow", () => {
    beforeEach(() => {
      component.columnsToDisplay = inputData.columns;
      component.ngOnChanges({
        columnsToDisplay: new SimpleChange([], inputData.columns, false),
      });
      fixture.detectChanges();
    })

    it('Should not update table columns if current columns fits the screen', () => {
      const getTableDataSpy = spyOn(component as any, 'getTableColumns').and.callThrough();
      const updateWidthIndexSpy = spyOn(component as any, 'updateWidthIndex').and.callThrough();
      const columnsBeforeExecution = [...component.tableColumns];
  
      component.updateTableOnHorizontalScroll(scrollEventMockWithoutReload);
  
      expect(columnsBeforeExecution).toEqual(component.tableColumns);
      expect(getTableDataSpy).not.toHaveBeenCalled();
      expect(updateWidthIndexSpy).not.toHaveBeenCalled();
    });
  
    it('Should update table columns if current columns doesn\'t fit the screen', () => {
      const getTableDataSpy = spyOn(component as any, 'getTableColumns').and.callThrough();
      const updateWidthIndexSpy = spyOn(component as any, 'updateWidthIndex').and.callThrough();
      const columnsBeforeExecution = [...component.tableColumns];
  
      component.updateTableOnHorizontalScroll(scrollEventMockWithReload);
  
      expect(columnsBeforeExecution).not.toEqual(component.tableColumns);
      expect(getTableDataSpy).toHaveBeenCalled();
      expect(updateWidthIndexSpy).toHaveBeenCalled();
    });

    it('Should update indexes after getting new columns batch', () => {
      component.updateWidthIndex();

      expect(component.horizontalScrollData.start).toBe(80);
      expect(component.horizontalScrollData.end).toBe(120);
    });
  })
});
