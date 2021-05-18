import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Subject, zip } from "rxjs";
import { CommonService } from "../../../../../services/common.service";
import { SetupService } from "../../../../../services/setup.service";
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
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];
  public offices: any[] = [];
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;

  // Forms
  assetForm: FormGroup;

  // To hold data for each card
  employeeAsset: any = {};
  locations: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private setupService: SetupService
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

      columns: [
        { orderable: false },
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
    this.getEmployeeAsset(this.dataFromParent.user.staffId);
    this.initAssetForm();
    this.getStaffDepartments();
    this.getLocation();
    this.getData();
  }
  getLocation() {
    return this.setupService.getLocation().subscribe(
      (data) => {
        this.locations = data.setuplist;
      },
      (err) => {}
    );
  }
  getStaffDepartments() {
    this.loadingService.show();
    return this.commonService.getCompanyStructures().subscribe(
      (data) => {
        this.loadingService.hide();
        this.offices = data.companyStructures;
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }
  getData() {
    zip([this.getLocation(), this.getStaffDepartments()]).subscribe((data) => {
      console.log(data);
    });
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
      requestApprovalStatus: [""],
      returnApprovalStatus: [""],
      staffId: this.dataFromParent.user.staffId,
      // identicationFile: ["", Validators.required],
    });
    //this.fileInput.nativeElement.value = "";
  }

  submitAssetForm(form: FormGroup) {
    // form.get("requestApprovalStatus").enable();
    // form.get("returnApprovalStatus").enable();
    // Send mail to HR
    if (!form.valid) {
      form.get("requestApprovalStatus").disable();
      form.get("returnApprovalStatus").disable();

      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.physicalCondition = +payload.physicalCondition;
    payload.locationId = +payload.locationId;
    payload.officeId = +payload.officeId;
    payload.returnApprovalStatus = 1;
    payload.requestApprovalStatus = 1;

    /* const formData = new FormData();
    for (const key in form.value) {

      formData.append(key, this.assetForm.get(key).value);
    }
 */

    // form.get("requestApprovalStatus").disable();
    // form.get("returnApprovalStatus").disable();
    this.spinner = true;
    return this.employeeService.postAsset(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success").then(() => {
            if (!this.dataFromParent.isHr) {
              this.utilitiesService
                .sendToHr(
                  "Add Assets",
                  this.dataFromParent.user.firstName,
                  this.dataFromParent.user.lastName,
                  this.dataFromParent.user.email,
                  this.dataFromParent.user.userId
                )
                .subscribe();
              // Handles if user edits
              if (form.get("requestApprovalStatus").value !== 2) {
                form.get("requestApprovalStatus").setValue(2);
              } else if (
                form.get("requestApprovalStatus").value === 1 &&
                form.get("returnApprovalStatus").value !== 2
              ) {
                form.get("returnApprovalStatus").setValue(2);
              }
            }
            $("#asset_modal").modal("hide");
            this.getEmployeeAsset(this.dataFromParent.user.staffId);
          });
        } else {
          swal.fire("GOS HRM", message, "error");
        }
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
        this.dtTrigger.next();
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
      // staffId: this.dataFromParent.user.staffId,
      assetFile: row.assetFile,
    });
    $("#asset_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(
      event,
      form,
      this.dataFromParent.user.staffId
    );
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
          this.loadingService.show();
          return this.employeeService.deleteAsset(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeAsset(this.dataFromParent.user.staffId);
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

  downloadFile() {}
}
