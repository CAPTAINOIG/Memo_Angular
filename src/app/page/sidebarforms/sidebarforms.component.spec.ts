import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarformsComponent } from './sidebarforms.component';

describe('SidebarformsComponent', () => {
  let component: SidebarformsComponent;
  let fixture: ComponentFixture<SidebarformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarformsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
