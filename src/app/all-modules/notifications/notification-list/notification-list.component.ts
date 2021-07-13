import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: "app-notification-list",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.css"],
})
export class NotificationListComponent implements OnInit {
  mails: any = [];
  status: boolean = false;
  public dtOptions: DataTables.Settings = {};
  selectedId: any[] = [];

  constructor(
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private loadingService: LoadingService
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
    this.dataService.currentMail.subscribe((result) => {
      // this.loadingService.hide();
      this.mails = result;
    });
  }

  /*  clickMessage() {
    this.routes.navigate(["/apps/mailview"]);
  }
 */
  clickEvent() {
    this.status = !this.status;
  }

  addItemId(event: Event, id: number) {
    this.utilitiesService.deleteArray(event, id, this.selectedId);
  }

  checkAll(event: Event) {
    this.selectedId = this.utilitiesService.checkAllBoxes(event, this.mails);
  }
}
