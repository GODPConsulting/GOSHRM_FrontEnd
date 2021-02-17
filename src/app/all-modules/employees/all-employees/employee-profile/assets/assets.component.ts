import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-assets",
  templateUrl: "./assets.component.html",
  styleUrls: ["./assets.component.css"],
})
export class AssetsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  employeeDetails: any = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];
  public offices: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;

  // Forms
  assetForm: FormGroup;

  // To hold data for each card
  employeeAsset: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-8 col-md-5'f><'col-sm-4 col-md-6 align-self-end'l>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Start typing to search by any field",
      },

      columns: [{ orderable: false }, null, null, null, null, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getEmployeeAsset(this.staffId);
    this.initAssetForm();
  }

  initAssetForm() {
    this.cardFormTitle = "Add Asset";
    this.assetForm = this.formBuilder.group({
      id: [0],
      employeeName: ["", Validators.required],
      locationId: ["", Validators.required],
      officeId: ["", Validators.required],
      assetName: ["", Validators.required],
      assetNumber: ["", Validators.required],
      description: ["", Validators.required],
      classification: ["", Validators.required],
      physicalCondition: ["", Validators.required],
      // idExpiry_date: ["", Validators.required],
      requestApprovalStatus: ["", Validators.required],
      returnApprovalStatus: ["", Validators.required],
      staffId: this.staffId,
      // identicationFile: ["", Validators.required],
    });
    //this.fileInput.nativeElement.value = "";
  }

  submitAssetForm(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.physicalCondition = +payload.physicalCondition;
    payload.locationId = +payload.locationId;
    payload.officeId = +payload.officeId;
    payload.returnApprovalStatus = +payload.returnApprovalStatus;
    payload.requestApprovalStatus = +payload.requestApprovalStatus;

    /* const formData = new FormData();
    for (const key in form.value) {
      
      formData.append(key, this.assetForm.get(key).value);
    }
 */

    this.spinner = true;
    return this.employeeService.postAsset(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#asset_modal").modal("hide");
        }
        this.getEmployeeAsset(this.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeAsset(id: number) {
    this.employeeService.getAssetByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeAsset = data.employeeList;
      }
    });
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Asset";
    //row.idExpiry_date = new Date(row.idExpiry_date).toLocaleDateString("en-CA");
    this.assetForm.patchValue({
      id: row.id,
      employeeName: row.employeeName,
      locationId: row.locationId,
      officeId: row.officeId,
      assetName: row.assetName,
      assetNumber: row.assetNumber,
      description: row.description,
      classification: row.classification,
      physicalCondition: row.physicalCondition,
      // idIssues: row.idIssues,
      // idExpiry_date: new Date(row.idExpiry_date).toLocaleDateString("en-CA"),
      requestApprovalStatus: row.requestApprovalStatus,
      returnApprovalStatus: row.returnApprovalStatus,
      // staffId: this.staffId,
      assetFile: row.assetFile,
    });
    $("#asset_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, this.staffId);
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
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
          this.pageLoading= true;
          return this.employeeService.deleteAsset(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeAsset(this.staffId);
                });
              } else {
                swal.fire("GOSHRM", message, "error");
              }
            },
            (err) => {
              this.pageLoading = false;
            }
          );
        }
      });
    this.selectedId = [];
  }

  addItemId(event, id: number) {
    if (event.target.checked) {
      if (!this.selectedId.includes(id)) {
        this.selectedId.push(id);
      }
    } else {
      this.selectedId = this.selectedId.filter((_id) => {
        return _id !== id;
      });
    }
  }

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.employeeAsset.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
