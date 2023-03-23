import { TestBed } from '@angular/core/testing';

import { BtstStrategyService } from './btst-strategy.service';

describe('BtstStrategyService', () => {
  let service: BtstStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtstStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
