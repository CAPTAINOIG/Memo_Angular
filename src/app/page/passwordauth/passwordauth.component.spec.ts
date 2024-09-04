import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordauthComponent } from './passwordauth.component';

describe('PasswordauthComponent', () => {
  let component: PasswordauthComponent;
  let fixture: ComponentFixture<PasswordauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordauthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
