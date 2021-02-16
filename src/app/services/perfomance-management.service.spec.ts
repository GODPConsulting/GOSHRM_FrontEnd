import { TestBed } from "@angular/core/testing";

import { PerfomanceManagementService } from "./perfomance-management.service";

describe("PerfomanceManagementService", () => {
  let service: PerfomanceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfomanceManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
