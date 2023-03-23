import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankNiftyDataComponent } from './bank-nifty-data.component';

describe('BankNiftyDataComponent', () => {
  let component: BankNiftyDataComponent;
  let fixture: ComponentFixture<BankNiftyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankNiftyDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankNiftyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
