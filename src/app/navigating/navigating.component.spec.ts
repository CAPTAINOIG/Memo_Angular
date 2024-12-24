import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatingComponent } from './navigating.component';

describe('NavigatingComponent', () => {
  let component: NavigatingComponent;
  let fixture: ComponentFixture<NavigatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
