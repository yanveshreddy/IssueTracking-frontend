import { TestBed } from '@angular/core/testing';

import { IssueRouteguardService } from './issue-routeguard.service';

describe('IssueRouteguardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IssueRouteguardService = TestBed.get(IssueRouteguardService);
    expect(service).toBeTruthy();
  });
});
