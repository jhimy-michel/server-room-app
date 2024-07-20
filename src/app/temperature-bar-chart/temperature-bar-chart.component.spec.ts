import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureBarChartComponent } from './temperature-bar-chart.component';

describe('TemperatureBarChartComponent', () => {
  let component: TemperatureBarChartComponent;
  let fixture: ComponentFixture<TemperatureBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemperatureBarChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemperatureBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
