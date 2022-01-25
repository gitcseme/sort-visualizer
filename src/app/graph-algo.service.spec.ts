import { TestBed } from '@angular/core/testing';

import { GraphAlgoService } from './graph-algo.service';

describe('GraphAlgoService', () => {
  let service: GraphAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
