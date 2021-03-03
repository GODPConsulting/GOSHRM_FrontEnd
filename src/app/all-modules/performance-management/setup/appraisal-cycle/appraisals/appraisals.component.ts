import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import swal from "sweetalert2";

@Component({
  selector: "app-appraisals",
  templateUrl: "./appraisals.component.html",
  styleUrls: ["./appraisals.component.css"],
})
export class AppraisalsComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public selectedId: number[] = [];
  public appraisalList: any[] = [];
  appraisalCycleId: number;
  pageLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private performanceService: PerformanceManagementService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.appraisalCycleId = +params.get("id");
      this.getAppraisalsByCycleId(this.appraisalCycleId);
    });

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
        null,
        null,
        null,
        null,
      ],
      order: [[1, "asc"]],
    };
  }

  getAppraisalsByCycleId(id: number) {
    this.pageLoading = true;

    this.performanceService.getAppraisalsByCycleId(id).subscribe(
      (data) => {
        this.pageLoading = false;
        this.appraisalList = data.objectiveList;
      },
      (err) => {
        this.pageLoading = false;
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }
}
