import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { TimeIntervalSelectorComponent } from './time-interval-selector.component';

describe('TimeIntervalSelectorComponent', () => {
  let component: TimeIntervalSelectorComponent;
  let fixture: ComponentFixture<TimeIntervalSelectorComponent>;
  let loader: HarnessLoader;
  let select: MatSelectHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeIntervalSelectorComponent ],
      imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatSelectModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeIntervalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    select = await loader.getHarness(MatSelectHarness.with({ selector : '.time-interval__select' }));
  });

  it('Should display three MatSelect options', async () => {
    await (await select.host()).click();

    const actual = await (await select.getOptions()).map(async (opt) => await opt.getText());

    expect(actual.length).toBe(3);
    expect(await actual[0]).toBe('5 minutes');
    expect(await actual[1]).toBe('30 minutes');
    expect(await actual[2]).toBe('1 hour');
  });

  it('Should update FormControl value on option change', async () => {
    await (await select.host()).click();
    const option = await select.getOptions({ text: '30 minutes' });

    await option[0].click();

    expect(component.timeIntervalControl.getRawValue()).toBe(30);
  });
});
