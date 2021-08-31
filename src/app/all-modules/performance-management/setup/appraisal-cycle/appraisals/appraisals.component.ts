import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Observable } from "rxjs";

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
  appraisals$: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private performanceService: PerformanceManagementService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.appraisalCycleId = +params.get("id");
      this.appraisals$ = this.performanceService.getAppraisalsByCycleId(
        this.appraisalCycleId
      );
      // this.getAppraisalsByCycleId(this.appraisalCycleId);
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
    // this.loadingService.show();

    this.performanceService.getAppraisalsByCycleId(id).subscribe(
      (data) => {
        // this.loadingService.hide();
        this.appraisalList = data.objectiveList;
      },
      (err) => {
        // this.loadingService.hide();
        const message = err.status.message.friendlyMessage;
        swal.fire("GOSHRM", message, "error");
      }
    );
  }

  delete() {}

  checkAll($event: Event) {}

  stopParentEvent($event: MouseEvent) {}

  addItemId($event: Event, id: any) {}

  viewAppraisal(id: number) {
    this.router.navigate(["/performance/performance-appraisal"], {
      queryParams: {
        id: id,
      },
    });
  }
}
