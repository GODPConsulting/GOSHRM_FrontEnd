import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { EmployeeService } from "src/app/services/employee.service";

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

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();

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
  //this.setupService.getData
  // Get All Employees
  loadEmployees() {
    this.pageLoading = true;
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.pageLoading = false;

        this.employeesList = data.employeeList;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  // Toggles between the grid view and list view of the employees
  changeView() {
    this.list = !this.list;
  }

  // Disposes the tooltip after the view is changed
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip("dispose");
    });
  }
}
