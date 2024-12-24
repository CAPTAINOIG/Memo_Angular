import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageusersComponent } from './landingpageusers.component';

describe('LandingpageusersComponent', () => {
  let component: LandingpageusersComponent;
  let fixture: ComponentFixture<LandingpageusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingpageusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingpageusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
