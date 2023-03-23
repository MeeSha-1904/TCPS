import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftyStocksDataComponent } from './nifty-stocks-data.component';

describe('NiftyStocksDataComponent', () => {
  let component: NiftyStocksDataComponent;
  let fixture: ComponentFixture<NiftyStocksDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiftyStocksDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiftyStocksDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
