import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PerformanceManagementService } from "src/app/services/performance-management.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../../../services/loading.service";
import { Observable } from "rxjs";
import { ISearchColumn } from "../../../../../interface/interfaces";
import { UtilitiesService } from "../../../../../services/utilities.service";

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
  cols: ISearchColumn[];
  file: File;
  selectedItems: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private performanceService: PerformanceManagementService,
    private loadingService: LoadingService,
    private router: Router,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.cols = [
      {
        header: "employeeName",
        field: "employeeName",
      },
      {
        header: "companyName",
        field: "companyName",
      },
      {
        header: "reviewerOneScore",
        field: "reviewerOneScore",
      },
      {
        header: "reviewerTwoScore",
        field: "reviewerTwoScore",
      },
      {
        header: "reviewerThreeScore",
        field: "reviewerThreeScore",
      },
      {
        header: "_360Peers",
        field: "_360Peers",
      },
      {
        header: "_360Report",
        field: "_360Report",
      },
      {
        header: "_360Self",
        field: "_360Self",
      },
      {
        header: "overall",
        field: "overall",
      },
      {
        header: "overallRemark",
        field: "overallRemark",
      },
      {
        header: "score",
        field: "score",
      },
    ];
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

  delete() {
    if (this.selectedItems.length === 0) {
      return this.utilitiesService.showError("Select item(s) to delete");
    }
    this.utilitiesService.confirmDelete().then((response) => {
      if (response.isConfirmed) {
        const ids = this.selectedItems.map((item) => item.empId);
        this.performanceService.deleteEmployeeAppraisal(ids).subscribe(
          (res) => {
            if (res.status.isSuccessful) {
              return this.utilitiesService
                .showMessage(res, "success")
                .then(() => {
                  this.appraisals$ =
                    this.performanceService.getAppraisalsByCycleId(
                      this.appraisalCycleId
                    );
                });
            } else {
              return this.utilitiesService.showMessage(res, "error");
            }
          },
          (err) => {
            return this.utilitiesService.showMessage(err, "error");
          }
        );
      }
    });
  }

  checkAll($event: Event) {}

  stopParentEvent($event: MouseEvent) {}

  addItemId($event: Event, id: any) {}

  viewAppraisal(row) {
    this.utilitiesService.sendUser(row.employeeName);
    this.router.navigate(["/performance/performance-appraisal"], {
      queryParams: {
        emp: row.empId,
        appraisalCycleId: row.appraisalCycleId,
        deptId: row.companyId,
        employeePerformId: row.employeePerformId,
        jobGrade: row.jobGrade,
      },
    });
  }

  downloadAppraisals() {
    this.performanceService.downloadAppraisalSummary().subscribe(
      (data) => {
        return this.utilitiesService.byteToFile(
          data,
          "Appraisals Summary.xlsx"
        );
      },
      (err) => {
        return this.utilitiesService.showMessage(err, "error");
      }
    );
  }

  handleFileUpload(files: FileList) {
    this.file = files.item(0);
  }

  uploadAppraisalSummary() {}

  reOpenObjective() {}
}
