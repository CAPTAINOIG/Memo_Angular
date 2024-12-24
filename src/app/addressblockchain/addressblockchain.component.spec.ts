import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressblockchainComponent } from './addressblockchain.component';

describe('AddressblockchainComponent', () => {
  let component: AddressblockchainComponent;
  let fixture: ComponentFixture<AddressblockchainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressblockchainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressblockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
