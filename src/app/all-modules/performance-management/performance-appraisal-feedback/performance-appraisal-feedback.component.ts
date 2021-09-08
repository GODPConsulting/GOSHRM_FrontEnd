import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UtilitiesService } from "../../../services/utilities.service";
import { EmployeeService } from "../../../services/employee.service";
import { PerformanceManagementService } from "../../../services/performance-management.service";
import { Observable } from "rxjs";
declare const $: any;
@Component({
  selector: "app-performance-appraisal-feedback",
  templateUrl: "./performance-appraisal-feedback.component.html",
  styleUrls: ["./performance-appraisal-feedback.component.css"],
})
export class PerformanceAppraisalFeedbackComponent implements OnInit {
  feebackForm: FormGroup;
  employees: any[] = [];
  employees$: Observable<any>;
  constructor(
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private employeeService: EmployeeService,
    private performanceManagementService: PerformanceManagementService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.employees$ = this.employeeService.getEmployees();
    this.employees$.subscribe((data) => {
      this.employees = data.map((item) => {
        return {
          label: `${item.firstName} ${item.lastName}`,
          id: item.employeeId,
        };
      });
    });
  }
  initialiseForm() {
    this.feebackForm = this.formBuilder.group({
      employeeId: [[]],
    });
  }
  show360Modal() {
    $("#feedback_modal").modal("show");
  }

  closeScheduleModal() {
    $("#feedback_modal").modal("hide");
  }

  save(feebackForm: FormGroup) {}
  public onSelectAll() {
    const selected = this.employees.map((item) => item.id);
    this.feebackForm.get("employeeId").patchValue(selected);
  }

  public onClearAll() {
    this.feebackForm.get("employeeId").patchValue([]);
  }
}
