import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import swal from "sweetalert2";
declare const $: any;
@Component({
  selector: "app-point-settings",
  templateUrl: "./point-settings.component.html",
  styleUrls: ["./point-settings.component.css"],
})
export class PointSettingsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  cardFormTitle: string;
  pageLoading: boolean = false; // controls the visibility of the page loader
  spinner: boolean = false;
  @ViewChild("fileInput")
  fileInput: ElementRef;

  @Input() staffId: number;
  performancePointSettings: any = {};

  pointSettings: any[] = [];
  selectedId: number[] = [];
  pointName: any;
  point: any;
  description: any;
  pointSettingsForm: any;

  constructor(
    private performanceManagementService: PerformanceManagementService,
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

      columns: [{ orderable: false }, null, null, null, null],
      order: [[1, "asc"]],
    };
    this.getPointSettings();
    this.cardFormTitle = "Add Point Settings";
  }

  submitPointSettingsForm() {
    const payload = {
      pointName: this.pointName,
      point: this.point,
      description: this.description,
    };
    // payload.point = +payload.point;
    // payload.hrSelectReviewer = +payload.hrSelectReviewer;

    this.spinner = true;
    return this.performanceManagementService
      .postPointSettings(payload)
      .subscribe(
        (res) => {
          this.spinner = false;
          const message = res.status.message.friendlyMessage;
          if (res.status.isSuccessful) {
            swal.fire("GOSHRM", message, "success");
            $("#point_settings_modal").modal("hide");

            this.pointName = "";
            this.point = "";
            this.description = "";
          }

          this.getPointSettings();
        },
        (err) => {
          this.spinner = false;
          const message = err.status.message.friendlyMessage;
          swal.fire("GOSHRM", message, "error");
        }
      );
  }

  getPointSettings() {
    this.pageLoading = true;
    this.performanceManagementService.getPointSettings().subscribe(
      (data) => {
        this.pageLoading = false;
        this.pointSettings = data.setupList;
      },
      (err) => {
        this.pageLoading = false;
      }
    );
  }

  edit(row) {
    this.cardFormTitle = "Edit Point Settings";
    this.pointSettingsForm.patchValue({
      id: row.id,
      pointName: row.pointName,
      point: row.point,
      description: row.description,
    });
    $("#point_settings_modal").modal("show");
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
          this.pageLoading = true;
          return this.performanceManagementService
            .deletePointSettings(payload)
            .subscribe(
              (res) => {
                this.pageLoading = false;
                const message = res.status.message.friendlyMessage;
                if (res.status.isSuccessful) {
                  swal.fire("GOSHRM", message, "success").then(() => {
                    this.getPointSettings();
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
      this.selectedId = this.performancePointSettings.map((item) => {
        return item.id;
      });
    } else {
      this.selectedId = [];
    }
  }
}
