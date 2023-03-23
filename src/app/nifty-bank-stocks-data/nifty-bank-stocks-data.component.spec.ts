import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftyBankStocksDataComponent } from './nifty-bank-stocks-data.component';

describe('NiftyBankStocksDataComponent', () => {
  let component: NiftyBankStocksDataComponent;
  let fixture: ComponentFixture<NiftyBankStocksDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiftyBankStocksDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiftyBankStocksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
