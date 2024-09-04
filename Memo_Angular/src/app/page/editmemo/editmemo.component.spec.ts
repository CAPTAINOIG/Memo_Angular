import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmemoComponent } from './editmemo.component';

describe('EditmemoComponent', () => {
  let component: EditmemoComponent;
  let fixture: ComponentFixture<EditmemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
