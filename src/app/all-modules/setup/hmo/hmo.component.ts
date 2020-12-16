import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "src/app/services/setup.service";
import swal from "sweetalert2";

declare const $: any;
@Component({
  selector: "app-hmo",
  templateUrl: "./hmo.component.html",
  styleUrls: ["./hmo.component.css","../setup.component.css"]
})
export class HmoComponent implements OnInit {
  public hmos: any[] = [];
  public rows = [];
  public srch = [];
  pageLoading: boolean;
  public formTitle = "Add HMO";
  public hmoForm: FormGroup;
  selectedId: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
    this.getHmo();
    this.initializeForm();
  }

  initializeForm() {
    this.hmoForm = this.formBuilder.group({
      id: [0],
      hmo_name: ["", Validators.required],
      hmo_code: ["", Validators.required],
      contact_phone_number: ["", Validators.required],
      contact_email: ["", Validators.required],
      address: ["", Validators.required],
      reg_date: ["", Validators.required],
      rating: ["", Validators.required],
      order_comments: ["", Validators.required],
    });
  }

  getHmo() {
    this.pageLoading = true;
    return this.setupService.getData("/hrmsetup/get/all/hmos").subscribe(
      (data) => {
        this.pageLoading = false;
        //console.log(data);
        this.hmos = data.setuplist;
        this.rows = this.hmos;
        this.srch = [...this.rows];
      },
      (err) => {
        this.pageLoading = false;
        console.log(err);
      }
    );
  }

  openModal() {
    $("#add_hmo").modal("show");
  }

  closeModal() {
    $("#add_hmo").modal("hide");
    this.initializeForm();
  }

  // Add employee  Modal Api Call
  addHmo(Form: FormGroup) {
    const payload = Form.value;
    console.log(payload);
    return this.setupService
      .updateData("/hrmsetup/add/update/hmo", payload)
      .subscribe(
        (res) => {
          const message = res.status.message.friendlyMessage;
          //console.log(message);

          if (res.status.isSuccessful) {
            swal.fire("Success", message, "success");
            this.initializeForm();
            $("#add_hmo").modal("hide");
          } else {
            swal.fire("Error", message, "error");
          }
          this.getHmo();
        },
        (err) => {
          const message = err.status.message.friendlyMessage;
          swal.fire("Error", message, "error");
        }
      );
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editHmo(row) {
    this.formTitle = "Edit HMO";
    this.hmoForm.patchValue({
      id: row.id,
      hmo_name: row.hmo_name,
      hmo_code: row.hmo_code,
      contact_phone_number: row.contact_phone_number,
      contact_email: row.contact_email,
      address: row.address,
      reg_date: row.reg_date,
      rating: row.rating,
      order_comments: row.order_comments,
    });
    $("#add_hmo").modal("show");
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
            .deleteData("/hrmsetup/delete/hmo", payload)
            .subscribe(
              (res) => {
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("Success", message, "success").then(() => {
                    this.getHmo();
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

  checkAll(event) {
    if (event.target.checked) {
      this.selectedId = this.hmos.map((item) => {
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
