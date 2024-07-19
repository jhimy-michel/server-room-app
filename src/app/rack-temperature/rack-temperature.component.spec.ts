import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackTemperatureComponent } from './rack-temperature.component';

describe('RackTemperatureComponent', () => {
  let component: RackTemperatureComponent;
  let fixture: ComponentFixture<RackTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RackTemperatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RackTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
