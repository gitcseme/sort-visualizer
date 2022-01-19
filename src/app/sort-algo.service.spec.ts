import { TestBed } from '@angular/core/testing';

import { SortAlgoService } from './sort-algo.service';

describe('SortAlgoService', () => {
  let service: SortAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
