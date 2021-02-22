import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { EmployeeService } from "src/app/services/employee.service";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-employee-views",
  templateUrl: "./employee-views.component.html",
  styleUrls: ["./employee-views.component.css"],
})
export class EmployeeViewsComponent implements OnInit, AfterViewChecked {
  public dtOptions: DataTables.Settings = {};
  public employeesList: any = [];
  public pageLoading: boolean;
  public list: boolean = true;
  companies: any[] = [];
  filteredArray: any[] = [];
  canAddEmployee: boolean;

  constructor(
    private employeeService: EmployeeService,
    private dataService: DataService,
    private setupService: SetupService
  ) {}

  ngOnInit() {
    this.dataService.currentUser.subscribe((result) => {
      const user = result;
      this.canAddEmployee = user && user.activities.includes("employeeform");
    });
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
          this.pageLoading = true;
          this.employeeService.multiUploadEmployeePhotos().subscribe(
            (res) => {
              this.pageLoading = false;
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
              this.pageLoading = false;
              const message = err.status.message.friendlyMessage;
              swal.fire("GOSHRM", message, "error");
            }
          );
        }
      });
  }

  // Get All Employees
  loadEmployees() {
    this.pageLoading = true;
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.pageLoading = false;

        this.employeesList = data.employeeList;
        this.filteredArray = data.employeeList;
      },
      (err) => {
        this.pageLoading = false;
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
    return this.setupService.getStaffDepartments().subscribe((data) => {
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
