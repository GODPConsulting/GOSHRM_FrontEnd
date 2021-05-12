import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { EmployeeService } from "src/app/services/employee.service";
import { JwtService } from "src/app/services/jwt.service";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../services/loading.service";
import { CommonService } from "../../../../services/common.service";

declare const $: any;
@Component({
  selector: "app-employee-views",
  templateUrl: "./employee-views.component.html",
  styleUrls: ["./employee-views.component.css"],
})
export class EmployeeViewsComponent implements OnInit, AfterViewChecked {
  public dtOptions: DataTables.Settings = {};
  public employeesList: any = [];
  public list: boolean = true;
  companies: any[] = [];
  filteredArray: any[] = [];
  canAddEmployee: boolean;
  userActivities: any;

  constructor(
    private employeeService: EmployeeService,
    private dataService: DataService,
    private setupService: SetupService,
    private jwtService: JwtService,
    private loadingService: LoadingService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.userActivities = this.jwtService.getUserActivities();

    this.canAddEmployee = this.userActivities.includes("employeeform");

    this.loadEmployees();
    this.getStaffDepartments();

    // Determines the structure of the table (Angular Datatables)
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [
        null,
        null,
        { className: "nowrap" },
        null,
        null,
        { className: "nowrap" },
        //{ className: "nowrap" },
      ],
      //order: [[1, "asc"]],
    };

    // Initializes the tooltip
    $("body").tooltip({
      selector: '[data-toggle="tooltip"]',
    });
  }

  multiUploadPhoto() {
    swal
      .fire({
        title: "Upload Multiple photos for employees?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        if (result.value) {
          this.loadingService.show();
          this.employeeService.multiUploadEmployeePhotos().subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.loadEmployees();
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
  }

  // Get All Employees
  loadEmployees() {
    this.loadingService.show();
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.loadingService.hide();

        this.employeesList = data.employeeList;
        this.filteredArray = data.employeeList;
      },
      (err) => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  // Toggles between the grid view and list view of the employees
  changeView() {
    this.list = !this.list;
  }

  getStaffDepartments() {
    return this.commonService.getCompanyStructures().subscribe((data) => {
      this.companies = data.companyStructures;
    });
  }

  filterEmployee(id) {
    if (id == 0) {
      this.filteredArray = this.employeesList;
    } else {
      this.filteredArray = this.employeesList.filter(
        (item) => item.staffOfficeId == id
      );
    }
  }
  // Disposes the tooltip after the view is changed
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip("dispose");
    });
  }
}
