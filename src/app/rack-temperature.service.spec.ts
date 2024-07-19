import { TestBed } from '@angular/core/testing';

import { RackTemperatureService } from './rack-temperature.service';

describe('RackTemperatureService', () => {
  let service: RackTemperatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RackTemperatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
