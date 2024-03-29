import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { MailConfigService } from "src/app/services/mail-config.service";
import swal from "sweetalert2";

@Component({
  selector: "app-emailconfig-list",
  templateUrl: "./emailconfig-list.component.html",
  styleUrls: ["./emailconfig-list.component.css"]
})
export class EmailconfigListComponent implements OnInit {
  selectedMailConfig: any[] = [];
  emailConfigs: any[] = [];
  cols: any[];
  viewHeight: any = "600px";
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private mailConfigService: MailConfigService
  ) {

  }
  ngOnInit() {
   this.cols = [
     {
       header: 'senderUserName',
       field: 'senderUserName'
     },
     {
       header: 'smtpClient',
       field: 'smtpClient'
     },
     {
       header: 'senderEmail',
       field: 'senderEmail'
     }
   ]
    this.getAllMailConfigs();
  }
  getAllMailConfigs() {

    return this.mailConfigService.getMailConfigs().subscribe(
      data => {

        this.emailConfigs = data.emailConfigs;
      },
      err => {

      }
    );
  }

  deleteMailConfigur() {
    if (
      this.selectedMailConfig == null ||
      this.selectedMailConfig.length == 0
    ) {
      return swal.fire(
        "GOS FINANCIAL",
        "Please select records you want to delete",
        "error"
      );
    }

    let ids: number[] = [];
    this.selectedMailConfig.forEach(element => {
      ids.push(element.emailConfigId);
    });
    const payload = {
      targetIds: ids
    }
    swal
      .fire({
        title: "Are you sure you want to delete record?",
        text: "Delete this Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!"
      })
      .then(result => {
        if (result.value) {

          this.mailConfigService.deleteMailConfig(payload).subscribe(data => {

            const message = data.status.message.friendlyMessage;
            if (data.status.isSuccessful) {
              swal.fire(
                "GOS FINANCIAL",
                message,
                "success"
              );
              this.getAllMailConfigs();
            } else {
              swal.fire("GOS FINANCIAL", message, "error");
            }
            this.selectedMailConfig = [];
          }, err => {

            const message = err.status.message.friendlyMessage;
            swal.fire("GOS FINANCIAL", message, "error");
          });
        } else {
          swal.fire("GOS FINANCIAL", "Cancelled", "error");
        }
        this.selectedMailConfig = [];
      });
  }

  // deleteMailConfig(row: any) {
  //   swal
  //     .fire({
  //       title: "Are you sure you want to delete record?",
  //       text: "You won't be able to revert this!",
  //       type: "question",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel!",
  //       confirmButtonClass: "btn btn-success btn-move",
  //       cancelButtonClass: "btn btn-danger",
  //       buttonsStyling: true
  //     })
  //     .then(result => {
  //       if (result.value) {

  //         this.mailConfigService
  //           .deleteMailConfig(row.mailConfigurationId)
  //           .subscribe(data => {

  //             if (data["result"] == true) {
  //               swal.fire(
  //                 "GOS FINANCIAL",
  //                 `Mail config deleted successfully.`,
  //                 "success"
  //               );
  //               this.getAllMailConfigs();
  //             } else {
  //               swal.fire("GOS FINANCIALS", `Record not deleted`, "error");
  //             }
  //           });
  //       } else {
  //         swal.fire("GOS FINANCIALS", "Cancelled", "error");
  //       }
  //     }, err => {

  //     });
  // }

  rowClicked(row?: any) {}
  editMailConfig(row) {
    this.router.navigate(["/setup/email-config"], {
      queryParams: { id: row.emailConfigId }
    });
  }
  addMailConfig(): void {
    this.router.navigate(["/setup/email-config"]);
  }

  deleteMailConfig(x) {

  }
}
