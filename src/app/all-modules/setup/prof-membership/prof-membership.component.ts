import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SetupService } from "../../../services/setup.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";
import { Subject } from "rxjs";
import { ISearchColumn } from "../../../interface/interfaces";

declare const $: any;
@Component({
  selector: "app-prof-membership",
  templateUrl: "./prof-membership.component.html",
  styleUrls: ["./prof-membership.component.css", "../setup.component.css"],
})
export class ProfMembershipComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  @ViewChild("fileInput")
  fileInput: ElementRef;
  public profMemberships: any[] = [];
  public professionalMembershipUploadForm: FormGroup;
  public formTitle: string = "Add Professional Membership";
  public spinner: boolean = false;
  public selectedId: number[] = [];
  public professionalMembershipForm: FormGroup;
  dtTrigger: Subject<any> = new Subject();
  cols: ISearchColumn[];
  selectProfMemberships: any[];
  constructor(
    private setupService: SetupService,
    private formBuilder: FormBuilder,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "professional_membership",
        field: "professional_membership",
      },
      {
        header: "description",
        field: "description",
      },
    ];
    this.initializeForm();
    this.getProfMembershipForm();
  }

  downloadFile() {
    this.loadingService.show();
    this.setupService.downloadProfMem().subscribe(
      (resp) => {
        this.loadingService.hide();
        this.utilitiesService.byteToFile(resp, "Professional Membership.xlsx", {
          type: "application/vnd.ms-excel",
        });
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  uploadProfMembership() {
    if (!this.professionalMembershipUploadForm.get("uploadInput").value) {
      return swal.fire("Error", "Select a file", "error");
    }
    const formData = new FormData();
    formData.append(
      "uploadInput",
      this.professionalMembershipUploadForm.get("uploadInput").value
    );
    this.spinner = true;
    return this.setupService.uploadProfMem(formData).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;

        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#upload_prof_membership").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getProfMembershipForm();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  openUploadModal() {
    // Resets the upload form
    this.fileInput.nativeElement.value = "";
    $("#upload_prof_membership").modal("show");
  }

  initializeForm() {
    this.formTitle = "Add Professional Membership";
    this.professionalMembershipForm = this.formBuilder.group({
      id: [0],
      professional_membership: ["", Validators.required],
      description: [""],
    });
    this.professionalMembershipUploadForm = this.formBuilder.group({
      uploadInput: [""],
    });
  }

  getProfMembershipForm() {
    this.loadingService.show();
    return this.setupService.getProfMems().subscribe(
      (data) => {
        this.loadingService.hide();
        this.profMemberships = data.setuplist;
        this.dtTrigger.next();
      },
      (err) => {
        this.loadingService.hide();
      }
    );
  }

  // Set Values To Edit Modal Form
  edit(row) {
    this.formTitle = "Edit Professional Membership";
    this.professionalMembershipForm.patchValue({
      id: row.id,
      professional_membership: row.professional_membership,
      description: row.description,
    });
    $("#add_prof_membership").modal("show");
  }

  openModal() {
    this.initializeForm();
    $("#add_prof_membership").modal("show");
  }

  closeModal() {
    $("#add_prof_membership").modal("hide");
  }

  addProfMembership(form: FormGroup) {
    if (!form.valid) {
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    this.spinner = true;
    return this.setupService.addProfMem(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          this.initializeForm();
          $("#add_prof_membership").modal("hide");
        } else {
          swal.fire("GOSHRM", message, "error");
        }
        this.getProfMembershipForm();
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  delete() {
    let payload: object;
    if (this.selectProfMemberships.length === 0) {
      return swal.fire("Error", "Select items to delete", "error");
    }
    this.selectProfMemberships.map((item) => {
      this.selectedId.push(item.id);
    });
    payload = {
      itemIds: this.selectedId,
    };
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
          return this.setupService.deleteProfMem(payload).subscribe(
            (res) => {
              this.loadingService.hide();
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.getProfMembershipForm();
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

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(
      event,
      this.profMemberships
    );
  }

  // Prevents the edit modal from popping up when checkbox is clicked
  stopParentEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  // Appends a selected file to "uploadInput"
  onSelectedFile(event: Event, form: FormGroup) {
    this.utilitiesService.uploadFileValidator(event, form, "hr");
  }
}
