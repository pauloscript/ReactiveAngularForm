import { TestBed } from '@angular/core/testing';

import { ConsultCepService } from './consult-cep.service';

describe('ConsultCepService', () => {
  let service: ConsultCepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultCepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
