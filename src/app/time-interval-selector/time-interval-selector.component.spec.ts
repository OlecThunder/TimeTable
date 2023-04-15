import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIntervalSelectorComponent } from './time-interval-selector.component';

describe('TimeIntervalSelectorComponent', () => {
  let component: TimeIntervalSelectorComponent;
  let fixture: ComponentFixture<TimeIntervalSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeIntervalSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIntervalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
