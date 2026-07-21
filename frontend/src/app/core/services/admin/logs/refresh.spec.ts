import { TestBed } from '@angular/core/testing';

import { Refresh } from './refresh';

describe('Refresh', () => {
  let service: Refresh;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Refresh);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
