import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpconfirmationComponent } from './otpconfirmation.component';

describe('OtpconfirmationComponent', () => {
  let component: OtpconfirmationComponent;
  let fixture: ComponentFixture<OtpconfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpconfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
