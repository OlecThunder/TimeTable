import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VirtualScrollTableModule } from '../shared/components/virtual-scroll-table/virtual-scroll-table.module';
import { TimeIntervalSelectorComponent } from '../time-interval-selector/time-interval-selector.component';
import { TimeIntervalsService } from './services/time-interval.service';
import { TimeIntervalComponent } from './time-interval.component';

describe('TimeIntervalComponent', () => {
  let component: TimeIntervalComponent;
  let fixture: ComponentFixture<TimeIntervalComponent>;
  let timeIntervalsService: TimeIntervalsService;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeIntervalComponent, TimeIntervalSelectorComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        VirtualScrollTableModule
      ],
      providers: [
        TimeIntervalsService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIntervalComponent);
    component = fixture.componentInstance;
    timeIntervalsService = TestBed.get(TimeIntervalsService);
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
  });

  it('Should subscribe on interval change', () => {
    const subscriptionSpy = spyOn<TimeIntervalComponent, any>(component, 'subscribeOnIntervalChange')

    fixture.detectChanges();

    expect(subscriptionSpy).toHaveBeenCalled();
  });

  it('Should set initial formControl value to 5', () => {
    spyOn<TimeIntervalComponent, any>(component, 'subscribeOnIntervalChange')

    fixture.detectChanges();

    expect(component.timeIntervalControl.getRawValue()).toBe(5);
  });

  it('Should set table data and columns values on select init', fakeAsync(() => {
    const detectChangesSpy = spyOn((<any>fixture.componentInstance).cdr, 'markForCheck').and.callThrough();
    const getTableDataSpy = spyOn(timeIntervalsService, 'getTableDataForInterval').and.callThrough();

    expect(component.tableColumns).toEqual([]);
    expect(component.tableData$.getValue()).toEqual([]);

    fixture.detectChanges();
    tick(1);

    expect(getTableDataSpy).toHaveBeenCalledWith(5);
    expect(detectChangesSpy).toHaveBeenCalledTimes(1);
    expect(component.tableColumns.length).toBe(287);
    expect(component.tableData$.getValue().length).toBe(100);
  }));

  it('Should set table data and columns values on select control value changes', fakeAsync(() => {
    const detectChangesSpy = spyOn((<any>fixture.componentInstance).cdr, 'markForCheck').and.callThrough();
    const getTableDataSpy = spyOn(timeIntervalsService, 'getTableDataForInterval').and.callThrough();

    fixture.detectChanges();
    component.timeIntervalControl.patchValue(30);
    tick(1);

    expect(getTableDataSpy).toHaveBeenCalledWith(30);
    expect(detectChangesSpy).toHaveBeenCalledTimes(2);
    expect(component.tableColumns.length).toBe(47);
    expect(component.tableData$.getValue().length).toBe(100);
  }));
});
