import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "src/app/services/employee.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;

@Component({
  selector: "app-dependent-contact",
  templateUrl: "./dependent-contact.component.html",
  styleUrls: ["./dependent-contact.component.css"],
})
export class DependentContactComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  employeeDetails: any = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;

  public selectedId: number[] = [];
  public countryId: number;
  public countries: any[] = [];

  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() dataFromParent: any;

  // Forms
  dependentContactForm: FormGroup;

  // To hold data for each card
  employeeDependentContact: any = {};
  setupService: any;

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
        null,
      ],
      order: [[1, "asc"]],
    };
    this.getEmployeeDependentContact(this.dataFromParent.user.staffId);
    this.initDependentContactForm();
    this.getCountry();
  }

  initDependentContactForm() {
    this.cardFormTitle = "Add Dependent Contact";
    this.dependentContactForm = this.formBuilder.group({
      id: [0],
      fullName: ["", Validators.required],
      email: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      relationship: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      address: ["", Validators.required],
      countryId: ["", Validators.required],
      // idExpiry_date: ["", Validators.required],
      approval_status: [
        { value: "2", disabled: !this.dataFromParent.isHr },
        Validators.required,
      ],
      staffId: this.dataFromParent.user.staffId,
      // identicationFile: ["", Validators.required],
    });
    //this.fileInput.nativeElement.value = "";
  }

  submitDependentContactForm(form: FormGroup) {
    form.get("approval_status").enable();

    if (!form.valid) {
      form.get("approval_status").disable();
      swal.fire("Error", "please fill all mandatory fields", "error");
      return;
    }
    const payload = form.value;
    payload.approval_status = +payload.approval_status;
    payload.countryId = +payload.countryId;
    form.get("approval_status").disable();
    this.spinner = true;
    return this.employeeService.postDependentContact(payload).subscribe(
      (res) => {
        this.spinner = false;
        const message = res.status.message.friendlyMessage;
        if (res.status.isSuccessful) {
          swal.fire("GOSHRM", message, "success");
          $("#dependent_contact_modal").modal("hide");
        }
        this.getEmployeeDependentContact(this.dataFromParent.user.staffId);
      },
      (err) => {
        this.spinner = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  getEmployeeDependentContact(id: number) {
    this.employeeService.getDependentContactByStaffId(id).subscribe((data) => {
      if (data.employeeList) {
        this.employeeDependentContact = data.employeeList;
      }
    });
  }

  getCountry() {
    return this.utilitiesService.getCountry().subscribe(
      (data) => {
        this.countries = data.commonLookups;
      },
      (err) => {}
    );
  }
  // Set Values To Edit Modal Form
  edit(row) {
    this.cardFormTitle = "Edit Dependent Contact";
    //row.idExpiry_date = new Date(row.idExpiry_date).toLocaleDateString("en-CA");
    this.dependentContactForm.patchValue({
      id: row.id,
      fullName: row.fullName,
      contact_phone_number: row.contact_phone_number,
      email: row.email,
      relationship: row.relationship,
      dateOfBirth: row.dateOfBirth,
      address: row.address,
      countryId: row.countryId,
      // idIssues: row.idIssues,
      // idExpiry_date: new Date(row.idExpiry_date).toLocaleDateString("en-CA"),
      approval_status: row.approval_status,
      staffId: this.dataFromParent.user.staffId,
      dependentContactFile: row.dependentContactFile,
    });
    $("#dependent_contact_modal").modal("show");
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
          this.pageLoading = true;
          return this.employeeService.deleteDependentContact(payload).subscribe(
            (res) => {
              this.pageLoading = false;
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("GOSHRM", message, "success").then(() => {
                  this.pageLoading = false;
                  this.getEmployeeDependentContact(
                    this.dataFromParent.user.staffId
                  );
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
      this.selectedId = this.employeeDependentContact.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
