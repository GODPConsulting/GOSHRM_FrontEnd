import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
declare const $: any;

@Component({
  selector: "app-employee-id-format",
  templateUrl: "./employee-id-format.component.html",
  styleUrls: ["./employee-id-format.component.css"],
})
export class EmployeeIdFormatComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public spinner: boolean = false;
  public formTitle = "Add Employee ID Format";
  public idFormatForm: FormGroup;
  public employeeIdFormats: any[] = [];
  public selectedId: number[] = [];
  public allCompanies$ = this.utilitiesService.getCompanyStructures();
  public format: string = "";
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initIdFormatForm();

    this.getEmployeeIdFormat();

    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },
      columns: [{ orderable: false }, null, null, null],
      order: [[1, "asc"]],
    };
  }

  setSuffix(digit: number) {
    if (!digit) {
      return "";
    }
    return (2).toLocaleString("en-US", {
      minimumIntegerDigits: digit,
      useGrouping: false,
    });
  }

  initIdFormatForm() {
    this.formTitle = "Add ID Format";
    this.idFormatForm = this.formBuilder.group({
      id: [0],
      companyStructureId: ["", Validators.required],
      employeeIdPrefix: ["", Validators.required],
      numberOfDigits: ["", Validators.required],
      format: [{ value: "", disabled: true }],
    });

    // Binds the input fields..syncs them
    this.idFormatForm.valueChanges.subscribe((val) => {
      const prefix = val.employeeIdPrefix;
      const suffix = this.setSuffix(+val.numberOfDigits);
      this.idFormatForm
        .get("format")
        .setValue(prefix + suffix, { emitEvent: false });
    });
  }

  // Set Values To Edit Modal Form
  editIdFormat(row) {
    this.formTitle = "Edit ID Format";
    this.idFormatForm.patchValue({
      id: row.id,
      companyStructureId: row.companyStructureId,
      employeeIdPrefix: row.employeeIdPrefix,
      numberOfDigits: row.numberOfDigits,
      format: row.format,
    });
    $("#employee_id_format").modal("show");
  }

  submitIdFormatForm(form: FormGroup) {
    if (!form.valid) {
      return this.utilitiesService.showError(
        "Please fill all mandatory fields"
      );
      // swal.fire("Error", "please fill all mandatory fields", "error");
      // return;
    }
    const payload = form.value;
    payload.companyStructureId = +payload.companyStructureId;
    payload.numberOfDigits = +payload.numberOfDigits;
    this.spinner = true;
    return this.setupService.addEmployeeIdFormat(payload).subscribe(
      (res) => {
        this.spinner = false;
        if (res.status.isSuccessful) {
          this.utilitiesService.showMessage(res, "success").then(() => {
            this.initIdFormatForm();
            $("#employee_id_format").modal("hide");
            this.getEmployeeIdFormat();
          });
        } else {
          this.utilitiesService.showMessage(res, "error");
        }
      },
      (err) => {
        this.spinner = false;
        this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  getEmployeeIdFormat() {
    this.loadingService.show();
    return this.setupService.getEmployeeIdFormat().subscribe(
      (data) => {
        this.loadingService.hide();
        this.employeeIdFormats = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  delete() {
    let payload: object;
    if (this.selectedId.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    } else {
      payload = {
        itemIds: this.selectedId,
      };
    }
    swal
      .fire({
        title: "Are you sure you want to delete this record?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
      })
      .then((result) => {
        if (result.value) {
          this.loadingService.show();
          return this.setupService.deleteIdFormat(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              if (res.status.isSuccessful) {
                this.utilitiesService.showMessage(res, "success");
              } else {
                this.utilitiesService.showMessage(res, "error");
              }
            },
            (err) => {
              this.loadingService.hide();
              this.utilitiesService.showMessage(err, "error");
            }
          );
        }
      });
    this.selectedId = [];
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.employeeIdFormats
    );
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
