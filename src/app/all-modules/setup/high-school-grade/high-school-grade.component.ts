import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'src/app/services/setup.service';
import swal from 'sweetalert2';

declare const $: any;
@Component({
  selector: 'app-high-school-grade',
  templateUrl: './high-school-grade.component.html',
  styleUrls: ['./high-school-grade.component.css','../setup.component.css']
})

export class HighSchoolGradeComponent implements OnInit {
  public grades: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add High School Grade";
  public highSchoolGradeForm: FormGroup;
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
    this.getHighSchoolGrade();
    this.initializeForm();
  }

  initializeForm() {
    this.highSchoolGradeForm = this.formBuilder.group({
      id: [0],
      grade: ["", Validators.required],
      description: ["", Validators.required],
      rank: ["", Validators.required],
      
    });
  }

  getHighSchoolGrade() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/highschoolgrades").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.grades = data.setuplist;
        this.rows = this.grades;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }
// Add employee  Modal Api Call
addHighSchoolGrade(highSchoolGradeForm: FormGroup) {
  const payload = highSchoolGradeForm.value;
  return this.setupService
    .updateData("/hrmsetup/add/update/highschoolgrade", payload)
    .subscribe(
      (res) => {
        const message = res.status.message.friendlyMessage;
        //console.log(message);

        if (res.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.initializeForm();
          $("#add_high_school_grade").modal("hide");
        } else {
          swal.fire("Error", message, "error");
        }
        this.getHighSchoolGrade();
      },
      (err) => {
        const message = err.status.message.friendlyMessage;
        swal.fire("Error", message, "error");
      }
    );
}
openModal() {
  $("#add_high_school_grade").modal("show");
}

closeModal() {
  $("#add_high_school_grade").modal("hide");
  this.initializeForm();
}
checkAll(event) {
  if (event.target.checked) {
    this.selectedId = this.grades.map((item) => {
      return item.id;
    });
  } else {
    this.selectedId = [];
  }
}
editHighSchoolGrade(row) {
  this.formTitle = "Edit High School Grade";
  this.highSchoolGradeForm.patchValue({
    id: row.id,
    grade: row.grade,
    rank: row.rank,
    description: row.description
  });
  $("#add_high_school_grade").modal("show");
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
          .deleteData("/hrmsetup/delete/highschoolgrade", payload)
          .subscribe(
            (res) => {
              const message = res.status.message.friendlyMessage;
              if (res.status.isSuccessful) {
                swal.fire("Success", message, "success").then(() => {
                  this.getHighSchoolGrade();
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

}
