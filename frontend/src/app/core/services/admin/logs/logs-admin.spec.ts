import { TestBed } from '@angular/core/testing';

import { LogsAdmin } from './logs-admin';

describe('LogsAdmin', () => {
  let service: LogsAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogsAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
