import { TestBed } from '@angular/core/testing';

import { AppartmentService } from './appartment.service';

describe('AppartmentService', () => {
  let service: AppartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
