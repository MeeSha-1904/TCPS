import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftyDataComponent } from './nifty-data.component';

describe('NiftyDataComponent', () => {
  let component: NiftyDataComponent;
  let fixture: ComponentFixture<NiftyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiftyDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiftyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
