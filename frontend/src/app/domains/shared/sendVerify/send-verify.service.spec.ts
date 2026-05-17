import { TestBed } from '@angular/core/testing';

import { SendVerifyService } from './send-verify.service';

describe('SendVerifyService', () => {
  let service: SendVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
