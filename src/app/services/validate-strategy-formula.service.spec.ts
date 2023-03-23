import { TestBed } from '@angular/core/testing';

import { ValidateStrategyFormulaService } from './validate-strategy-formula.service';

describe('ValidateStrategyFormulaService', () => {
  let service: ValidateStrategyFormulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateStrategyFormulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
