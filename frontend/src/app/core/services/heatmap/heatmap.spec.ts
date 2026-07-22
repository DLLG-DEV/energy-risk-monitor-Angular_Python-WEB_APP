import { TestBed } from '@angular/core/testing';

import { Heatmap } from './heatmap';

describe('Heatmap', () => {
  let service: Heatmap;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Heatmap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
