import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { MailConfigService } from "src/app/services/mail-config.service";

import swal from "sweetalert2";

@Component({
  selector: "app-emailconfig",
  templateUrl: "./emailconfig.component.html",
  styleUrls: ["./emailconfig.component.css"]
})
export class EmailconfigComponent implements OnInit {
  form: FormGroup;
  formTitle: string = "Email Configuration";
  emailConfigId: Number = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mailConfigService: MailConfigService,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      emailConfigId: this.emailConfigId,
      smtpClient: [""],
      enableSSL: [false],
      smtpPort: [""],
      senderEmail: [""],
      mailCaption: [""],
      senderUserName: [""],
      senderPassword: [""],
      baseFrontend: [""],
      sendNotification: [false]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let emailConfigId = params.id;
      if (emailConfigId != null || emailConfigId != undefined) {
        this.emailConfigId = emailConfigId;
        this.editMailConfig(emailConfigId);
      }
    });
  }

  addEmailConfig(form: FormGroup) {
    let payload = form.value;
    payload.smtpPort = +payload.smtpPort;
    this.loadingService.show();
    return this.mailConfigService.updateMailConfig(payload).subscribe(
      data => {
        this.loadingService.hide();
        const message = data.status.message.friendlyMessage;
        if (data.status.isSuccessful) {
          swal.fire("Success", message, "success");
          this.router.navigateByUrl('/setup/emailconfig-list')
        } else {
          return swal.fire("Error", message, "error");
        }
      },
      err => {
        this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        return swal.fire("Error", message, "error");
      }
    );
  }
  editMailConfig(mailConfigurationId) {
    this.loadingService.show();
    return this.mailConfigService.getMailConfig(mailConfigurationId).subscribe(
      data => {
        this.loadingService.hide();
          let row = data.emailConfigs[0];
          this.form = this.fb.group({
            emailConfigId: [row.emailConfigId],
            smtpClient: [row.smtpClient],
            enableSSL: [row.enableSSL],
            smtpPort: [row.smtpPort],
            senderEmail: [row.senderEmail],
            mailCaption: [row.mailCaption],
            senderUserName: [row.senderUserName],
            senderPassword: [row.senderPassword],
            baseFrontend: [row.baseFrontend],
            sendNotification: [row.sendNotification]
          });

      },
      err => {
        this.loadingService.hide();
      }
    );
  }
  goBack() {
    this.router.navigateByUrl("/setup/emailconfig-list");
  }
}
