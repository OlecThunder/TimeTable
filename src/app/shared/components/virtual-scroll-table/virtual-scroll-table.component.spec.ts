import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableHarness } from '@angular/material/table/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnixIntoReadablePipeModule } from '../../pipes/unix-into-readable/unix-into-readable.module';
import { TableVirtualScrollStrategy } from '../../services/table-vs-strategy.service';

import { VirtualScrollTableComponent } from './virtual-scroll-table.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BehaviorSubject } from 'rxjs';
import { generateMockTableData } from '../../utils/table-data-mock-generator';
import { Component, SimpleChange } from '@angular/core';
import { IntervalsTableDataResponse } from '../../../time-interval-selector/models/time-intervals.interface';
import { scrollEventMockWithoutReload, scrollEventMockWithReload } from '../../../test/mocks/virtual-scroll.mocks';

// @Component({
//   selector: `host-component`,
//   template: `<app-virtual-scroll-table 
//     [columnsToDisplay]="tableColumns" 
//     [tableData$]="tableData$">
//   </app-virtual-scroll-table>`,
//   directives: []
// })
// class TestHostComponent {
//   public tableData$ = new BehaviorSubject<{ [key: string]: string; }[]>([]);
//   public tableColumns: string[];

//   setInputs() {
//     const inputData = generateMockTableData(50, 5);
//     this.tableData$.next(inputData.data);
//     this.tableColumns = inputData.columns;
//     console.log(this.tableColumns)
//   }
// }

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
    tableVirtualScrollStrategy = TestBed.get(VIRTUAL_SCROLL_STRATEGY);

    inputData = generateMockTableData(100, 5);
    loader = TestbedHarnessEnvironment.loader(fixture);
    table = await loader.getHarness(MatTableHarness.with({ selector : '.table' }));
  });

  it('should create', async () => {
    component.columnsToDisplay = inputData.columns;
    component.tableData$ = new BehaviorSubject<{ [key: string]: string }[]>([]);
    component.ngOnChanges({
      columnsToDisplay: new SimpleChange([], inputData.columns, false),
      tableData$: new SimpleChange(null, new BehaviorSubject([]), true),
    });
    fixture.detectChanges();
    component.tableData$.next(inputData.data);
    fixture.detectChanges();

    // console.log(await table.getHeaderRows())
    // console.log(await table.getRows());
  });

  // it('qwe', () => {
  //   const getTableDataSpy = spyOn(tableVirtualScrollStrategy, 'setScrollHeight').and.callThrough();

  //   console.log(1)
  //   fixture.detectChanges();
  //   console.log(2)
  //   expect(getTableDataSpy).toHaveBeenCalledTimes(1);
  // })

  it('Should get table columns and update indexes on columns change', () => {
    const getTableDataSpy = spyOn<VirtualScrollTableComponent, any>(component, 'getTableColumns').and.callThrough();
    const updateWidthIndexSpy = spyOn<VirtualScrollTableComponent, any>(component, 'updateWidthIndex').and.callThrough();

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
      const getTableDataSpy = spyOn<VirtualScrollTableComponent, any>(component, 'getTableColumns').and.callThrough();
      const updateWidthIndexSpy = spyOn<VirtualScrollTableComponent, any>(component, 'updateWidthIndex').and.callThrough();
      const columnsBeforeExecution = [...component.tableColumns];
  
      component.updateTableOnHorizontalScroll(scrollEventMockWithoutReload);
  
      expect(columnsBeforeExecution).toEqual(component.tableColumns);
      expect(getTableDataSpy).not.toHaveBeenCalled();
      expect(updateWidthIndexSpy).not.toHaveBeenCalled();
    });
  
    it('Should update table columns if current columns doesn\'t fit the screen', () => {
      const getTableDataSpy = spyOn<VirtualScrollTableComponent, any>(component, 'getTableColumns').and.callThrough();
      const updateWidthIndexSpy = spyOn<VirtualScrollTableComponent, any>(component, 'updateWidthIndex').and.callThrough();
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
