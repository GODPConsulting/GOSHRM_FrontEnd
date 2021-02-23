import { TestBed } from "@angular/core/testing";

import { PerformanceManagementService } from "./performance-management.service";

describe("PerformanceManagementService", () => {
  let service: PerformanceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceManagementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
