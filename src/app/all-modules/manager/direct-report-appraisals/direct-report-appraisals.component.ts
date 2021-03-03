import { Component, OnInit } from "@angular/core";
import { JwtService } from "src/app/services/jwt.service";
import { ManagerService } from "src/app/services/manager.service";
import swal from "sweetalert2";

@Component({
  selector: "app-direct-report-appraisals",
  templateUrl: "./direct-report-appraisals.component.html",
  styleUrls: ["./direct-report-appraisals.component.css"],
})
export class DirectReportAppraisalsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public selectedId: number[] = [];
  public reportAppraisals: any[] = [];
  pageLoading: boolean;
  user: any;

  constructor(
    private managerService: ManagerService,
    private jwtService: JwtService
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
        null,
      ],
      order: [[1, "asc"]],
    };
    this.user = this.jwtService.getHrmUserDetails();
    if (this.user.userRoleNames.includes("Line Managers")) {
      this.getAppraisalObjByManagerId(this.user.staffId);
    }
  }

  getAppraisalObjByManagerId(id: number) {
    this.pageLoading = true;
    this.managerService.getAppraisalObjByManagerId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.reportAppraisals = data.objectiveList;
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
}
