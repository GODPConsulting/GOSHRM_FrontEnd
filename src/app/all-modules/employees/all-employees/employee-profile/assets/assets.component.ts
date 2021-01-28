import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  employeeDetails: any = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  currentUser: string[] = []; // contains the data of the current user
  currentUserId: number;
  public selectedId: number[] = [];

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
    console.log(this.staffId);

    this.getEmployeeAsset(this.staffId);
    this.initAssetForm();
  }

  initAssetForm() {
    this.cardFormTitle = "Add Asset";
    this.assetForm = this.formBuilder.group({
      id: [0],
      employeeName: ["", Validators.required],
      office: ["", Validators.required],
      assetName: ["", Validators.required],
      assetNumber: ["", Validators.required],
      description: ["", Validators.required],
      classification: ["", Validators.required],
      physicalCondition: ["", Validators.required],
      // idExpiry_date: ["", Validators.required],
      requestApprovalStatusName: ["", Validators.required],
      returnApprovalStatusName: ["", Validators.required],
      staffId: this.staffId,
      // identicationFile: ["", Validators.required],
    });
    //this.fileInput.nativeElement.value = "";
  }

  submitAssetForm(form: FormGroup) {
    console.log(form.value);

    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approvalStatus = +payload.approvalStatus;
    // const formData = new FormData();
    // for (const key in form.value) {
    //   //console.log(key, this.identificationForm.get(key).value);
    //   formData.append(key, this.hobbyForm.get(key).value);
    // }

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
        swal.fire("Error", message, "error");
      }
    );
  }

  getEmployeeAsset(id: number) {
    this.employeeService.getAssetByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeAsset = data.employeeList;
        console.log(data.employeeList);
      }
    });
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Asset";
    //row.idExpiry_date = new Date(row.idExpiry_date).toLocaleDateString("en-CA");
    this.assetForm.patchValue({
      id: row.id,
      employeeName: row.employeNamme,
      office: row.office,
      assetName: row.assetName,
      assetNumber: row.assetNumber,
      description: row.description,
      classification: row.classification,
      physicalCondition: row.physicalCondition,
      // idIssues: row.idIssues,
      // idExpiry_date: new Date(row.idExpiry_date).toLocaleDateString("en-CA"),
      requestApprovalStatusName: row.requestApprovalStatusName,
      returnApprovalStatusName: row.returnApprovalStatusName,
      staffId: this.staffId,
      assetFile: row.assetFile,
    });
    $("#asset_modal").modal("show");
  }

  // Fixes the misleading error message "Cannot find a differ supporting object '[object Object]'"
  hack(val: any[]) {
    return Array.from(val);
  }

  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.patchFile(event, form);
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
      //console.log(this.selectedId);
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
          return this.employeeService.deleteAsset(payload).subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getEmployeeAsset(this.staffId);
                });
              } else {
                swal.fire("Error", message, "error");
              }
            },
            (err) => {
              console.log(err);
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

