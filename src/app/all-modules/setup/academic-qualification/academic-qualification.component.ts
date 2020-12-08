import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'src/app/services/setup.service';

import swal from 'sweetalert2';

declare const $: any;
@Component({
  selector: 'app-academic-qualification',
  templateUrl: './academic-qualification.component.html',
  styleUrls: ['./academic-qualification.component.css']
})
export class AcademicQualificationComponent implements OnInit {

  public qualifications: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add Academic Qualification";
  public academicQualificationForm: FormGroup;
  selectedId: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) { }

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.getAcademicQualifications();
    this.initializeForm();
  }

  initializeForm() {
    this.academicQualificationForm = this.formBuilder.group({
      id: [0],
      qualification: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
      
    });
  }
  
  getAcademicQualifications() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/academic/qualifications").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.qualifications = data.setuplist;
        this.rows = this.qualifications;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }
// Add employee  Modal Api Call
addAcademicQualification(academicQualificationForm: FormGroup) {
  const payload = academicQualificationForm.value;
  return this.setupService
    .updateData("/hrmsetup/add/update/academic/qualification", payload)
    .subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        //console.log(message);

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#add_acadmic_qualification").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getAcademicQualifications();
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
}

  delete(id: any) {
    let payload;

    if (id) {
      const body = [id];
      //body.push(id);
      //console.log(body);
      payload = {
        itemIds: body,
      };
    } else if (this.selectedId) {
      if (this.selectedId.length === 0) {
        return swal.fire("Error", "Select items to delete", "error");
      }
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
        //console.log(result);

        if (result.value) {
          return this.setupService
            .deleteData("/hrmsetup/delete/academic/qualification", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getAcademicQualifications();
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
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editAcademicQualification(row) {
    this.formTitle = "Edit Academic Qualification";
    this.academicQualificationForm.patchValue({
      id: row.id,
      qualification: row.qualification,
      description: row.description,
      rank: row.rank,
    });
    $("#add_academic_qualification").modal("show");
  }
  
  openModal() {
    $("#add_academic_qualification").modal("show");
  }

  closeModal() {
    $("#add_academic_qualification").modal("hide");
    this.initializeForm();
  }
  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.qualifications.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }

  addItemId(event, id) {
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

}
