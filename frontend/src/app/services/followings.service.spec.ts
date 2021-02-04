import { TestBed } from '@angular/core/testing';

import { FollowingsService } from './followings.service';

describe('FollowingsService', () => {
  let service: FollowingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
