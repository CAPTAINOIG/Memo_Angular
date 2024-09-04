import { TestBed } from '@angular/core/testing';

import { ServicesidebarService } from './servicesidebar.service';

describe('ServicesidebarService', () => {
  let service: ServicesidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
